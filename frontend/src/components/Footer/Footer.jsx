import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer section" id="contact">
      <div className="footer__container container grid">
        <div className="footer__content">
          <a href="/" className="footer__logo">
            <img src={assets.logo} alt="Logo" className="footer__logo-img" /> 
            Sytudio
          </a>

          <p className="footer__description">Transformando visões em realidade com a precisão do 3D.</p>

          <div className="footer__social">
            <a
              href="https://www.instagram.com/sytudio.art"
              target="_blank"
              rel="noreferrer"
              className="footer__social-link"
            >
              <i className="bx bxl-instagram" />
            </a>
          </div>
        </div>


        <div className="footer__content">
          <h3 className="footer__title">Sobre</h3>
          <ul className="footer__links">
            <li><a href="#about" className="footer__link">Sobre nós</a></li>
            <li><a href="#products" className="footer__link">Produtos</a></li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Nossos Serviços</h3>
          <ul className="footer__links">
            <li><a href="#products" className="footer__link">Preços</a></li>
            <li><a href="#" className="footer__link">Entrega</a></li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Nossa Empresa</h3>
          <ul className="footer__links">
            <li><a href="#about" className="footer__link">Nossa missão</a></li>
          </ul>
        </div>
      </div>

      <span className="footer__copy">
        &#169; Sytudio. Todos os direitos reservados
      </span>

    </footer>
  );
};

export default Footer;
