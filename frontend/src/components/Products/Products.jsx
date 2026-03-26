import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useFront } from "../../context/FrontContext";
import ProductImageCarousel from "../../components/ProductImageCarousel/ProductImageCarousel";
import "./Products.css";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP || "551992465322";

export default function Products() {
  const { products, loading } = useFront();

  const handleWhatsapp = (prod) => {
    const message = `Olá! Gostaria de mais informações sobre o produto: ${prod.nome}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="products section" id="products">
      <h2 className="section__title">.Nossos Produtos</h2>

      <div className="prod__container container grid">
        {loading ? (
          <p className="loading-products">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p className="loading-products">Nenhum produto encontrado.</p>
        ) : (
          products.map((prod) => (
            <motion.div 
              className="prod__content" 
              key={prod._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >

              <div className="prod__img">
                <ProductImageCarousel imagemUrl={prod.imagemUrl} nome={prod.nome} />
              </div>

              <div className="prod__infos">
                <h3 className="prod__title">{prod.nome}</h3>
                <span className="prod__subtitle">
                  <p>{prod.descricao}</p>
                </span>
                <span className="prod__price">
                  R$ {Number(prod.valor).toFixed(2)}
                </span>
              </div>

              <button
                className="button prod__button"
                onClick={() => handleWhatsapp(prod)}
                aria-label="Contato via WhatsApp"
              >
                <MessageCircle className="prod__icon" size={20} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
