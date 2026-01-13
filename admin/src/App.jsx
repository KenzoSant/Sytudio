import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import AddProduct from "./pages/Add/AddProduct";
import ListProduct from "./pages/List/ListProduct";
import Dashboard from "./pages/Dashboard/Dashboard";
import Layout from "./pages/Layout/Layout";
import Verify from "./pages/Verify/Verify";
import { AdminProvider } from "./context/AdminContext";
import PrivateRoute from "./context/PrivateRoute";
import './App.css';

function App() {
  return (
    <div className="app">
      <AdminProvider>
        <Routes>

          {/* ROTA RAIZ */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* PUBLICAS */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/verify/:token" element={<Verify />} />

          {/* PRIVADAS */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/list" element={<ListProduct />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </AdminProvider>
    </div>
  );
}

export default App;
