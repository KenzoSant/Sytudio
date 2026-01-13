import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Verify() {
  const { token } = useParams();
  const [msg, setMsg] = useState("Verificando...");

  useEffect(() => {
    fetch(`${BASE_URL}/api/users/verify/${token}`)
      .then(r => r.json())
      .then(d => setMsg(d.message))
      .catch(() => setMsg("Erro ao verificar email"));
  }, [token]);

  return <h2>{msg}</h2>;
}
