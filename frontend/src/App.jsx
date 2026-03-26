import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home/Home";
import About from "./components/About/About";
import Products from "./components/Products/Products";
import Navbar from "./components/Navbar/Navbar";
import ScrollUp from "./components/ScrollUp/ScrollUp";
import Footer from "./components/Footer/Footer";
import { FrontProvider } from "./context/FrontContext";
import './App.css';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <FrontProvider>
        <Navbar />
        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Footer />} />
            </Routes>
          </AnimatePresence>
        </div>
        <ScrollUp />
      </FrontProvider>
    </div>
  );
}

export default App;