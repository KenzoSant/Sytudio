import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const FrontContext = createContext();

//const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API_URL = "http://localhost:4000"

// socket conexão
const socket = io(API_URL, {
  transports: ["websocket"]
});

export function FrontProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchInitial = async () => {
    try {
      setLoading(true); // começa carregando

      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setLoading(false); // termina
    }
  };

  useEffect(() => {
    fetchInitial();

    socket.on("productsUpdated", (data) => {
      setProducts(data);
    });

    return () => {
      socket.off("productsUpdated");
    };
  }, []);

  return (
    <FrontContext.Provider value={{ products, loading }}>
      {children}
    </FrontContext.Provider>
  );
}

export function useFront() {
  return useContext(FrontContext);
}
