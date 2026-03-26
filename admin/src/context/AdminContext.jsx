import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const API_PRODUCTS = `${BASE_URL}/api/products`;
  const API_USERS = `${BASE_URL}/api/users`;
  const API_DELIVERIES = `${BASE_URL}/api/deliveries`;

  const navigate = useNavigate();

  // 🧹 Limpar dados antigos do localStorage (migração)
  const cleanOldStorage = () => {
    // Remover chaves antigas que não são mais usadas
    const oldKeys = ["admin", "user", "adminData"];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🧹 Removendo dados antigos: ${key}`);
        localStorage.removeItem(key);
      }
    });
  };

  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [deliveries, setDeliveries] = useState([]);
  const [authError, setAuthError] = useState(null);

  // 🔁 Restaurar sessão ao carregar
  useEffect(() => {
    const verifyToken = async () => {
      // 🧹 Limpar dados antigos na primeira carga
      cleanOldStorage();

      const savedToken = localStorage.getItem("adminToken");
      
      if (savedToken) {
        try {
          // Verificar se o token ainda é válido
          const res = await fetch(`${API_USERS}/me`, {
            headers: { "Authorization": `Bearer ${savedToken}` }
          });

          if (res.ok) {
            const data = await res.json();
            setAdmin(data.user);
            setToken(savedToken);
          } else {
            // Token inválido ou expirado
            localStorage.removeItem("adminToken");
            setToken(null);
          }
        } catch (err) {
          console.error("Erro ao verificar token:", err);
          localStorage.removeItem("adminToken");
          setToken(null);
        }
      }
      
      setLoadingAuth(false);
    };

    verifyToken();
  }, []);

  // ================= AUTH =================
  
  /**
   * Login - Gera JWT no servidor
   */
  const login = async (email, password) => {
    try {
      setAuthError(null);
      
      const res = await fetch(`${API_USERS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Armazenar token e dados do usuário
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setAdmin(data.user);

      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  /**
   * Refresh Token - Obter novo token antes de expirar
   */
  const refreshToken = async () => {
    try {
      if (!token) return;

      const res = await fetch(`${API_USERS}/refresh-token`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao renovar token");
      }

      localStorage.setItem("adminToken", data.token);
      setToken(data.token);

      return data.token;
    } catch (err) {
      console.error("Erro ao renovar token:", err);
      logout();
      throw err;
    }
  };

  /**
   * Logout - Limpar sessão
   */
  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setAdmin(null);
    setAuthError(null);
    navigate("/login");
  };

  const isAuthenticated = !!token && !!admin;

  // ================= FETCH COM AUTENTICAÇÃO =================
  
  /**
   * Fetch com autenticação JWT
   * Renova token automaticamente se expirado
   */
  const fetchWithAuth = async (url, options = {}, retryCount = 0) => {
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...(!options.body || typeof options.body === "string" ? { "Content-Type": "application/json" } : {}),
          ...(options.headers || {}),
          "Authorization": `Bearer ${token}`
        }
      });

      // ⚠️ Token expirado - tentar renovar
      if (res.status === 401 && retryCount === 0) {
        console.warn("⚠️ Token expirado. Renovando...");
        
        try {
          const newToken = await refreshToken();
          // Retry com novo token
          return fetchWithAuth(url, options, retryCount + 1);
        } catch (err) {
          logout();
          throw new Error("Sessão expirada. Faça login novamente.");
        }
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Erro desconhecido" }));
        
        if (res.status === 403) {
          throw new Error("Acesso negado. Apenas administradores podem realizar esta ação.");
        }
        
        throw new Error(data.message || `Erro ${res.status}`);
      }

      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // ================= PRODUCTS =================
  const createProduct = async (formData) => {
    return fetchWithAuth(API_PRODUCTS, {
      method: "POST",
      body: formData
    });
  };

  const getProducts = async () => {
    const res = await fetchWithAuth(API_PRODUCTS);
    return res.json();
  };

  const deleteProduct = async (id) => {
    return fetchWithAuth(`${API_PRODUCTS}/${id}`, {
      method: "DELETE"
    });
  };

  // ✅ ALTERADO: aceita JSON OU FormData (para upload de múltiplas imagens no edit)
  const updateProduct = async (id, data) => {
    const isFormData = data instanceof FormData;

    return fetchWithAuth(`${API_PRODUCTS}/${id}`, {
      method: "PUT",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data)
    });
  };

  // ================= DELIVERY =================

  // Função para ajustar a data para o formato correto
  const adjustDeliveryDate = (deliveryData) => {
    // Se já tiver dataEntrega, garante que seja uma string YYYY-MM-DD
    if (deliveryData.dataEntrega) {
      // Se for um objeto Date, converte para string
      if (deliveryData.dataEntrega instanceof Date) {
        const date = new Date(deliveryData.dataEntrega);
        // Adiciona o timezone offset para garantir que a data seja mantida
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return {
          ...deliveryData,
          dataEntrega: date.toISOString().split("T")[0]
        };
      }
      // Se já for string, verifica o formato
      else if (typeof deliveryData.dataEntrega === "string") {
        // Se estiver no formato ISO (com T), extrai apenas a data
        if (deliveryData.dataEntrega.includes("T")) {
          return {
            ...deliveryData,
            dataEntrega: deliveryData.dataEntrega.split("T")[0]
          };
        }
        // Se já estiver no formato YYYY-MM-DD, mantém
        return deliveryData;
      }
    }
    return deliveryData;
  };

  // Função para formatar data para exibição
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      // Ajusta para o timezone local
      const adjustedDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      return adjustedDate.toLocaleDateString("pt-BR");
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
  };

  const fetchDeliveries = async () => {
    try {
      const res = await fetchWithAuth(API_DELIVERIES);
      const data = await res.json();

      // Garante que todas as datas sejam strings no formato YYYY-MM-DD
      const adjustedData = data.data?.map((delivery) => ({
        ...delivery,
        dataEntrega:
          delivery.dataEntrega && delivery.dataEntrega.includes("T")
            ? delivery.dataEntrega.split("T")[0]
            : delivery.dataEntrega
      })) || [];

      setDeliveries(adjustedData);
    } catch (error) {
      console.error("Erro ao buscar entregas:", error);
      setAuthError(error.message);
    }
  };

  const addDelivery = async (delivery) => {
    try {
      const adjustedDelivery = adjustDeliveryDate(delivery);

      const res = await fetchWithAuth(API_DELIVERIES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustedDelivery)
      });
      
      await res.json();
      await fetchDeliveries();
    } catch (error) {
      console.error("Erro ao adicionar entrega:", error);
      throw error;
    }
  };

  const updateDelivery = async (id, data) => {
    try {
      const adjustedData = adjustDeliveryDate(data);

      const res = await fetchWithAuth(`${API_DELIVERIES}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustedData)
      });
      
      await res.json();
      await fetchDeliveries();
    } catch (error) {
      console.error("Erro ao atualizar entrega:", error);
      throw error;
    }
  };

  const deleteDelivery = async (id) => {
    try {
      await fetchWithAuth(`${API_DELIVERIES}/${id}`, { method: "DELETE" });
      await fetchDeliveries();
    } catch (error) {
      console.error("Erro ao deletar entrega:", error);
      throw error;
    }
  };

  // Carregar entregas ao montar o componente (apenas se autenticado)
  useEffect(() => {
    if (isAuthenticated) {
      fetchDeliveries();
    }
  }, [isAuthenticated]);

  return (
    <AdminContext.Provider
      value={{
        admin,
        loadingAuth,
        isAuthenticated,
        authError,
        login,
        logout,
        refreshToken,
        createProduct,
        getProducts,
        deleteProduct,
        updateProduct,
        deliveries,
        addDelivery,
        updateDelivery,
        deleteDelivery,
        formatDateForDisplay 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
