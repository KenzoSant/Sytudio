import React from "react";
import "./About.css";
import { assets } from "../../assets/assets";
import useScrollReveal from "../../hooks/useScroolReveal";

const About = () => {

  useScrollReveal();

  return (
    <div className="about" id="about">
      <div className="about__container container">

        <div className="about__data">
          <h2 className="section__title">
            .SOBRE A SYTUDIO
          </h2>

          <div className="about__description">
            <p className="about__desc left">
              Cada produto é uma obra de arte, onde a tecnologia de ponta se une
              ao talento do artesão. A resina garante detalhes nítidos e texturas
              perfeitas,
            </p>

            <p className="about__desc right">
              enquanto a pintura manual confere vida, personalidade e um toque de
              exclusividade a cada item, transformando-o em uma peça especial e
              verdadeiramente singular.
            </p>
          </div>
        </div>

        <div className="about__visual">
          <p className="about__highlight">
            MODELOS DE FILMES <br />
            MODELOS DE ANIMES <br />
            MODELOS DE SÉRIES <br />
            MODELOS DE JOGOS <br />
            MODELOS DE OBJETOS
          </p>

          <img src={assets.shape} alt="Logo Yumo" className="about__img" />
        </div>

      </div>
    </div>
  );
};

export default About;
