import { useEffect, useState } from "react";
import "./ScrollUp.css";

const ScrollUp = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scrollup ${show ? "show" : ""}`}
      onClick={scrollToTop}
    >
      <i className='bx bx-arrow-up-stroke scrollup__icon'></i>
    </button>
  );
};

export default ScrollUp;
