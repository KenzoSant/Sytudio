import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminContext = createContext();

export function AdminProvider({ children }) {

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const API_PRODUCTS = `${BASE_URL}/api/products`;
  const API_USERS = `${BASE_URL}/api/users`;
  const API = `${BASE_URL}/api/deliveries`;

  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [deliveries, setDeliveries] = useState([]);

  // 🔁 Restaurar sessão ao carregar
  useEffect(() => {
    const saved = localStorage.getItem("admin");
    if (saved) {
      setAdmin(JSON.parse(saved));
    }
    setLoadingAuth(false);
  }, []);

  // ================= AUTH =================
  const login = async (email, password) => {
    const res = await fetch(`${API_USERS}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("admin", JSON.stringify(data));
    setAdmin(data);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
    navigate("/login");
  };

  const isAuthenticated = !!admin;

  // ================= FETCH COM TOKEN =================
  const fetchWithAuth = async (url, options = {}) => {
    const token = admin?.token;

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : ""
      }
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Erro" }));
      throw new Error(data.message);
    }

    return res;
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

  const updateProduct = async (id, data) => {
    return fetchWithAuth(`${API_PRODUCTS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
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
          dataEntrega: date.toISOString().split('T')[0]
        };
      }
      // Se já for string, verifica o formato
      else if (typeof deliveryData.dataEntrega === 'string') {
        // Se estiver no formato ISO (com T), extrai apenas a data
        if (deliveryData.dataEntrega.includes('T')) {
          return {
            ...deliveryData,
            dataEntrega: deliveryData.dataEntrega.split('T')[0]
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
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      // Ajusta para o timezone local
      const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      return adjustedDate.toLocaleDateString("pt-BR");
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
  };

  const fetchDeliveries = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      
      // Garante que todas as datas sejam strings no formato YYYY-MM-DD
      const adjustedData = data.map(delivery => ({
        ...delivery,
        // Se a data estiver em formato ISO, converte para YYYY-MM-DD
        dataEntrega: delivery.dataEntrega && delivery.dataEntrega.includes('T') 
          ? delivery.dataEntrega.split('T')[0] 
          : delivery.dataEntrega
      }));
      
      setDeliveries(adjustedData);
    } catch (error) {
      console.error("Erro ao buscar entregas:", error);
    }
  };

  const addDelivery = async (delivery) => {
    try {
      const adjustedDelivery = adjustDeliveryDate(delivery);
      
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustedDelivery)
      });
      fetchDeliveries();
    } catch (error) {
      console.error("Erro ao adicionar entrega:", error);
      throw error;
    }
  };

  const updateDelivery = async (id, data) => {
    try {
      const adjustedData = adjustDeliveryDate(data);
      
      await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustedData)
      });
      fetchDeliveries();
    } catch (error) {
      console.error("Erro ao atualizar entrega:", error);
      throw error;
    }
  };

  const deleteDelivery = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchDeliveries();
    } catch (error) {
      console.error("Erro ao deletar entrega:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        loadingAuth,
        isAuthenticated,
        login,
        logout,
        createProduct,
        getProducts,
        deleteProduct,
        updateProduct,
        deliveries,
        addDelivery,
        updateDelivery,
        deleteDelivery,
        formatDateForDisplay // Exporta a função para uso nos componentes
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}