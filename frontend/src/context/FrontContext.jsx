import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const FrontContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Socket conexão (será autenticada com token se disponível)
let socket;

export function FrontProvider({ children }) {
  // 🧹 Limpar dados antigos do localStorage (migração)
  const cleanOldStorage = () => {
    const oldKeys = ["user", "userData", "token"];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🧹 Removendo dados antigos: ${key}`);
        localStorage.removeItem(key);
      }
    });
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("userToken"));

  // Inicializar socket com autenticação
  const initializeSocket = (userToken) => {
    if (socket) {
      socket.disconnect();
    }

    socket = io(API_URL, {
      transports: ["websocket"],
      auth: userToken ? {
        token: userToken
      } : {}
    });

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket desconectado");
    });

    socket.on("productsUpdated", (data) => {
      console.log("📦 Produtos atualizados em tempo real");
      setProducts(data.data || data);
    });

    socket.on("error", (error) => {
      console.error("❌ Erro Socket:", error);
      setError(error);
    });
  };

  // Buscar produtos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = {};
      
      // Adicionar token se disponível
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/api/products`, { headers });
      
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      // Suportar novo formato com .data e também o formato antigo
      const productList = Array.isArray(data) ? data : (data.data || []);
      setProducts(productList);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Login do usuário (opcional)
  const login = async (email, password) => {
    try {
      setError(null);

      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao fazer login");
      }

      const data = await res.json();
      
      // Armazenar token e usuário
      localStorage.setItem("userToken", data.token);
      setToken(data.token);
      setUser(data.user);
      
      // Reinicializar socket com novo token
      initializeSocket(data.token);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("userToken");
    setToken(null);
    setUser(null);
    setError(null);
    
    if (socket) {
      socket.disconnect();
    }
  };

  // Carregar produtos ao montar
  useEffect(() => {
    // 🧹 Limpar dados antigos na primeira carga
    cleanOldStorage();

    fetchProducts();
    initializeSocket(token);

    return () => {
      if (socket) {
        socket.off("productsUpdated");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("error");
      }
    };
  }, [token]);

  return (
    <FrontContext.Provider 
      value={{ 
        products, 
        loading, 
        error,
        user,
        token,
        login,
        logout,
        refreshProducts: fetchProducts
      }}
    >
      {children}
    </FrontContext.Provider>
  );
}

export function useFront() {
  return useContext(FrontContext);
}
