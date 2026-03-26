import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Menu } from "lucide-react";
import { assets } from "../../assets/assets";
import "./Navbar.css";

const Navbar = () => {
    /*=============== SHOW MENU ===============*/
    const [toggle, setToggle] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            /*=============== CHANGE BACKGROUND HEADER ===============*/
            if (window.scrollY >= 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            /*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
            const sections = document.querySelectorAll("section[id]");
            const scrollY = window.pageYOffset;

            sections.forEach((current) => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 58;
                const sectionId = current.getAttribute("id");

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    setActiveSection(sectionId);
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { id: "home", label: "Início" },
        { id: "about", label: "Sobre Nós" },
        { id: "products", label: "Catálogo" },
        { id: "contact", label: "Contato" },
    ];

    return (
        <motion.header
            className={scrolled ? "header scroll-header" : "header"}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
            <nav className="nav container">
                <a href="/" className="nav__logo">
                    <img src={assets.logo} alt="Logo" className="nav__logo-img" />
                </a>


                <div className={toggle ? "nav__menu show-menu" : "nav__menu"} id="nav-menu">
                    <ul className="nav__list grid">
                        {navLinks.map((link) => (
                            <li className="nav__item" key={link.id}>
                                <a
                                    href={`#${link.id}`}
                                    className={`nav__link ${activeSection === link.id ? "active-link" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setToggle(false);
                                        if (window.lenis) {
                                            window.lenis.scrollTo(`#${link.id}`, {
                                                offset: link.id === "contact" ? 0 : -50,
                                                duration: 1.5,
                                            });
                                        }
                                    }}
                                >
                                    {link.label}
                                </a>

                            </li>
                        ))}
                    </ul>

                    <button className="nav__close" id="nav-close" onClick={() => setToggle(false)} aria-label="Fechar menu">
                      <X size={24} />
                    </button>
                </div>

                <button className={`nav__toggle ${toggle ? "hide-toggle" : ""}`} id="nav-toggle" onClick={() => setToggle(true)} aria-label="Abrir menu">
                    <Menu size={24} />
                </button>
            </nav>
        </motion.header>
    );
};


export default Navbar;