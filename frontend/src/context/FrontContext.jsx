import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const FrontContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

// socket conexão
const socket = io(API_URL, {
  transports: ["websocket"]
});

export function FrontProvider({ children }) {
  const [products, setProducts] = useState([]);

  const fetchInitial = async () => {
    const res = await fetch(`${API_URL}/api/products`);
    const data = await res.json();
    setProducts(data);
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
    <FrontContext.Provider value={{ products }}>
      {children}
    </FrontContext.Provider>
  );
}

export function useFront() {
  return useContext(FrontContext);
}
