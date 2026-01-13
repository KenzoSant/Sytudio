import { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom"; 
import { assets } from '../../assets/assets';
import useScrollReveal from "../../hooks/useScroolReveal";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); 

    useScrollReveal();

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (isMenuOpen) {
                closeMenu();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMenuOpen]);

    const scrollToSection = (section, e = null) => {
        if (e) {
            e.preventDefault(); 
        }
        
        closeMenu();
        
        if (location.pathname !== '/') {
            window.location.href = `/#${section}`;
            return;
        }

        setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
                const yOffset = -80;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    const handleLogoClick = (e) => {
        closeMenu();
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const sections = ['home', 'about', 'products', 'contact'];

    return (
        <>
            <div 
                className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} 
                onClick={closeMenu}
            />
            
            <div className={`navbar ${scrolled ? "scrolled" : ""} container`}>
                <Link 
                    to="/" 
                    onClick={handleLogoClick}
                    style={{ display: 'block' }}
                >
                    <img src={assets.logo} alt="Logo" className='logo' />
                </Link>
                
                {/* Botão hamburguer (fora do navbar-container) */}
                <button 
                    className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Menu desktop */}
                <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    {sections.map((section) => (
                        <li key={section}>
                            <Link 
                                to={`/#${section}`} 
                                onClick={(e) => scrollToSection(section, e)}
                            >
                                {section.toUpperCase()}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Navbar;