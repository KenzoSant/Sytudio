import "./Products.css";
import { useFront } from "../../context/FrontContext";
import useScrollReveal from "../../hooks/useScroolReveal";
import ProductImageCarousel from "../../components/ProductImageCarousel/ProductImageCarousel";

const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP || "551992465322";

export default function Products() {
  useScrollReveal();
  const { products, loading } = useFront();

  function handleWhatsapp(prod) {
    const message = `Olá! Gostaria de mais informações sobre o produto: ${prod.nome}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="products" id="products">
      <div className="container">
        <h2 className="section__title">.Nossos Produtos</h2>

        <div className="prod__container">
          {loading ? (
            <p className="loading-products">Carregando produtos...</p>
          ) : products.length === 0 ? (
            <p className="loading-products">Nenhum produto encontrado.</p>
          ) : (
            products.map((prod) => (
              <div className="prod__content" key={prod._id}>
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
                  <i className="bx bx-message-circle-dots prod__icon"></i>
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
