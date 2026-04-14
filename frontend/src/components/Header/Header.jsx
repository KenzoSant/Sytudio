import { motion } from "framer-motion";
import "./Header.css";
import { assets } from "../../assets/assets";

const Header = () => {
  return (
    <section className="home section" id="home">
      <div className="video-background">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          disablePictureInPicture
          className="video-element"
        >
          <source src={assets.background} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="home__container container grid">
        <motion.div
          className="home__data"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.6
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span
            className="home__greeting"
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            Bem-vindo ao Futuro do 3D
          </motion.span>

          <motion.h1
            className="home__title"
            variants={{
              hidden: { opacity: 0, y: -80, scale: 0.8 },
              visible: { opacity: 1, y: 0, scale: 1 }
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            SYTUDIO
          </motion.h1>

          <motion.h3
            className="home__education"
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            Transformando Visões em Realidade
          </motion.h3>


          <motion.a
            href="#products"
            className="button button--flex"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explorar Catálogo
          </motion.a>
        </motion.div>

      </div>


    </section>
  );
};

export default Header;