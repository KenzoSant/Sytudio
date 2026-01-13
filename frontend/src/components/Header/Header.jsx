import React from "react";
import useScrollReveal from "../../hooks/useScroolReveal";
import "./Header.css";

const Header = () => {
  useScrollReveal(); 

  return (
    <header className="header" id="home">
      <div className="banner container">

        <div className="section_logo">
          <h1 className="section__title_name">SYTUDIO</h1>
        </div>

        <div className="section_infos">
          <p className="section__subtitle info1">
            Impressão 3D
          </p>

          <hr />

          <p className="section__subtitle info2">
            Plataforma desenvolvida como vitrine exclusiva para exibir uma
            coleção de peças incríveis, meticulosamente criadas com impressão 3D
            de alta precisão em resina e finalizadas com pintura manual artesanal.
          </p>
        </div>

        <div className="section_button">
          <a href="#work" className="button btn">
            Contato <span>➞</span>
          </a>
        </div>

      </div>
    </header>
  );
};

export default Header;