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

  const CACHE_KEY = "sytudio_products_cache";
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  const getCachedProducts = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp > CACHE_TTL) return null;
      return data;
    } catch {
      return null;
    }
  };

  const setCachedProducts = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      // localStorage cheio ou indisponível — ignorar silenciosamente
    }
  };

  const [products, setProducts] = useState(() => getCachedProducts() || []);
  const [loading, setLoading] = useState(() => !getCachedProducts());
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
      const updated = data.data || data;
      setProducts(updated);
      setCachedProducts(updated);
    });

    socket.on("error", (error) => {
      console.error("❌ Erro Socket:", error);
      setError(error);
    });
  };

  // Buscar produtos
  const fetchProducts = async () => {
    try {
      // Se já tem cache válido, não exibe loading (atualiza silenciosamente)
      const hasCachedData = products.length > 0;
      if (!hasCachedData) setLoading(true);
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
      setCachedProducts(productList);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      // Só exibe erro se não há produtos em cache para mostrar
      if (products.length === 0) setError(err.message);
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
