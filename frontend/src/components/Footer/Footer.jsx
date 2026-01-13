import React from "react";
import "./Footer.css";
import {assets} from "../../assets/assets"

const Footer = () => {
  return (
    <div className="footer" id="contact">
      <div className="footer__container container grid">
        <div className="footer__content">
          <a href="/" className="footer__logo">
            <img src={assets.logo} alt="Yumo Logo" className="footer__logo-img" /> 
            YUMO
          </a>

          <p className="footer__description">Aproveite o melhor do 3D</p>

          <div className="footer__social">
            <a
              href="https://www.instagram.com/sytudio.art?igsh=M3BmeDdsamlwYjV4"
              target="_blank"
              rel="noreferrer"
              className="footer__social-link"
            >
              <i className="bxl bx-instagram" />
            </a>
          </div>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Sobre</h3>

          <ul className="footer__links">
            <li>
              <a href="#about" className="footer__link">
                Sobre nós
              </a>
            </li>
            <li>
              <a href="#products" className="footer__link">
                Produtos
              </a>
            </li>
            <li>
              <a href="#news" className="footer__link">
                News
              </a>
            </li>
          </ul>
        </div>


        <div className="footer__content">
          <h3 className="footer__title">Nossos Serviços</h3>

          <ul className="footer__links">
            <li>
              <a href="#products" className="footer__link">
                Preços
              </a>
            </li>
            <li>
              <a href="#" className="footer__link">
                Descontos
              </a>
            </li>
            <li>
              <a href="#" className="footer__link">
                Entrega
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Nossa Empresa</h3>

          <ul className="footer__links">
            <li>
              <a href="#" className="footer__link">
                Sobre nós
              </a>
            </li>
            <li>
              <a href="#" className="footer__link">
                Nossa missão
              </a>
            </li>
          </ul>
        </div>
      </div>

      <span className="footer__copy">
        &#169; MK. Todos os direitos reservados
      </span>
    </div>
  );
};

export default Footer;
