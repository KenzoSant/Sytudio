import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "lucide-react";
import "./ProductImageCarousel.css";

export default function ProductImageCarousel({ imagemUrl, nome }) {
  const images = Array.isArray(imagemUrl)
    ? imagemUrl
    : imagemUrl
    ? [imagemUrl]
    : [];

  const [idx, setIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="no-image">
        <Image size={32} />
        <span>Sem imagem</span>
      </div>
    );
  }

  const nextImage = (e) => {
    e.stopPropagation();
    setIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="pic-root">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt={nome}
          className="pic-img"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          loading="lazy"
          draggable={false}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <div className="pic-dots">
          {images.map((_, i) => (
            <div
              key={i}
              className={`pic-dot ${i === idx ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIdx(i);
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
}
