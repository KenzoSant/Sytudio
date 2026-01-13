import "./Products.css";
import { useFront } from "../../context/FrontContext";
import useScrollReveal from "../../hooks/useScroolReveal";

export default function Products() {
  useScrollReveal(); 
  const { products } = useFront();

  return (
    <section className="products" id="products">
      <div className="container">
        <h2 className="section__title">.Nossos Produtos</h2>

        <div className="prod__container">
          {products.map(prod => (
            <div className="prod__content" key={prod._id}>
              <img
                src={prod.imagemUrl}
                alt={prod.nome}
                className="prod__img"
              />

              <div className="prod__infos">
                <h3 className="prod__title">{prod.nome}</h3>
                <span className="prod__subtitle">{prod.descricao}</span>
                <span className="prod__price">R$ {prod.valor}</span>
              </div>

              <button className="button prod__button">
                <i className="bx bx-message-circle-dots prod__icon"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
