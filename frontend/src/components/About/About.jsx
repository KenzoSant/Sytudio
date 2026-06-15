import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import "./About.css";

const About = () => {
  return (
    <section className="about section" id="about">
      <motion.h2
        className="section__title"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        .Sobre Nós
      </motion.h2>

      <div className="about__container container grid">
        <motion.div
          className="about__img-container"
          initial={{ opacity: 0, x: -100, rotate: -5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img src={assets.shape} alt="Sytudio Shape" className="about__img" />
          {/* <ShapeModel /> */}
        </motion.div>

        <motion.div
          className="about__data"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, staggerChildren: 0.3 }}
        >
          <motion.p
            className="about__description"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            O <strong>Sytudio</strong> nasceu da fusão entre a precisão tecnológica e a sensibilidade artística.
            Especializados em impressão 3D de alta definição, transformamos polímeros em peças de desejo,
            cada uma com sua própria alma e história.
          </motion.p>

          <div className="about__info">
            {[
              { title: "01+", name: "Anos de \n Experiência" },
              { title: "50+", name: "Peças \n Produzidas" },
              { title: "20+", name: "Projetos \n Custom" }
            ].map((info, i) => (
              <motion.div
                className="about__box"
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + (i * 0.2) }}
              >
                <span className="about__info-title">{info.title}</span>
                <span className="about__info-name" style={{ whiteSpace: 'pre-line' }}>{info.name}</span>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="#contact"
            className="button"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Falar Comigo
          </motion.a>
        </motion.div>
      </div>

    </section>
  );
};


export default About;
