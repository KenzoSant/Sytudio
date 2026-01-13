import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import "./Sidebar.css";

export default function Sidebar() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeSidebar = () => setIsMobileOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fecha sidebar ao redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <i className="bx bx-menu"></i>
      </button>

      <div
        className={`sidebar-overlay ${isMobileOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>

      <div className={`sidebar-container ${isMobileOpen ? "mobile-open" : ""}`}>

        {/* HEADER */}
        <div className="sidebar-header">
          <NavLink to="/list" className="sidebar-logo" onClick={closeSidebar}>
            <span className="sidebar-logo-icon">
              <img className="sidebar-logo-img" src={assets.logo} alt="" />
            </span>
            <span>Sytudio</span>
          </NavLink>
        </div>

        {/* NAV */}
        <nav className="sidebar-nav">
          <div className="nav-group">
            <div className="nav-group-title">MENU</div>

            <NavLink to="/list" className="nav-link" onClick={closeSidebar}>
              <span className="nav-icon list"><i className="bx bxs-list-ul"></i></span>
              <span className="nav-text">Lista de Produtos</span>
            </NavLink>

            <NavLink to="/add" className="nav-link" onClick={closeSidebar}>
              <span className="nav-icon add"><i className="bx bxs-plus-circle"></i></span>
              <span className="nav-text">Adicionar Produto</span>
            </NavLink>

            <NavLink to="/dash" className="nav-link" onClick={closeSidebar}>
              <span className="nav-icon dashboard"><i className="bx bxs-dashboard"></i></span>
              <span className="nav-text">Dashboard</span>
            </NavLink>
          </div>

          {/* LOGOUT */}
          
        </nav>

        <button className="nav-link logout" onClick={handleLogout}>
            <span className="nav-icon"><i className="bx bxs-log-out"></i></span>
            <span className="nav-text">Sair</span>
          </button>

        {/* FOOTER USUÁRIO */}
        <div className="sidebar-footer">
          
          <div className="user-info">
            <div className="user-avatar">
              <i className="bx bxs-user-circle"></i>
            </div>
            <div className="user-details">
              <h4>{admin?.user?.name || "Administrador"}</h4>
              <span>{admin?.user?.email || ""}</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
