import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const FrontContext = createContext();

const socket = io("http://localhost:4000");

export function FrontProvider({ children }) {
  const [products, setProducts] = useState([]);

  const fetchInitial = async () => {
    const res = await fetch("http://localhost:4000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchInitial();

    socket.on("productsUpdated", (data) => {
      setProducts(data);
    });

    return () => socket.off("productsUpdated");
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
