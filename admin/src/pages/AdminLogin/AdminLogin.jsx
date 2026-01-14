import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/list");
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        {error && <p className="login-error">{error}</p>}

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            <i className={`bxr ${showPassword ? "bx-eye-slash" : "bx-eye"}`}></i>
          </button>
        </div>

        <button type="submit" className="button-submit">
          Entrar
        </button>
      </form>
    </div>
  );
}