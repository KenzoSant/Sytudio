// src/components/ProductImageCarousel/ProductImageCarousel.jsx
import { useEffect, useRef, useState } from "react";
import "./ProductImageCarousel.css";

export default function ProductImageCarousel({ imagemUrl, nome }) {
  const images = Array.isArray(imagemUrl)
    ? imagemUrl
    : imagemUrl
    ? [imagemUrl]
    : [];

  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const fadeTimer = useRef(null);

  useEffect(() => {
    setIdx(0);
    setPrevIdx(0);
    setIsFading(false);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, [images.length]);

  const goTo = (next) => {
    if (images.length <= 1) return;
    if (next === idx) return;

    if (fadeTimer.current) clearTimeout(fadeTimer.current);

    setPrevIdx(idx);
    setIdx(next);
    setIsFading(true);

    fadeTimer.current = setTimeout(() => {
      setPrevIdx(next);
      setIsFading(false);
    }, 350);
  };

  if (images.length === 0) {
    return (
      <div className="no-image">
        <i className="bx bx-image"></i>
        <span>Sem imagem</span>
      </div>
    );
  }

  const currentSrc = images[idx];
  const prevSrc = images[prevIdx];

  return (
    <div className="pic-root">
      <img
        src={currentSrc}
        alt={nome}
        className="pic-img pic-current"
        loading="lazy"
        draggable={false}
      />

      <img
        src={prevSrc}
        alt={nome}
        className={`pic-img pic-prev ${isFading ? "pic-fade-out" : ""}`}
        loading="lazy"
        draggable={false}
      />

      {images.length > 1 && (
        <div className="pic-dots">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`pic-dot ${i === idx ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Imagem ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
