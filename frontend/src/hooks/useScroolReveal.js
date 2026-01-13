import { useEffect } from "react";

const useScrollReveal = () => {
  useEffect(() => {
    // Adicionar classe CSS para estado inicial
    const style = document.createElement('style');
    style.textContent = `
      .sr-hidden {
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    const sr = {
      reveal: (selectors, options = {}) => {
        const elements = document.querySelectorAll(selectors);
        const defaultOptions = {
          origin: 'bottom',
          distance: '60px',
          duration: 2500,
          delay: 200,
          interval: 0,
          threshold: 0.1, 
          reset: false,
          easing: 'cubic-bezier(0.5, 0, 0, 1)', 
          ...options
        };

        elements.forEach((el, index) => {
          // Verificar se já foi animado para evitar duplicação
          if (el.classList.contains('sr-revealed')) return;
          
          el.classList.add('sr-hidden');
          
          // Preparar transformação baseada na origem
          let transform = '';
          switch(defaultOptions.origin) {
            case 'top':
              transform = `translateY(-${defaultOptions.distance})`;
              break;
            case 'bottom':
              transform = `translateY(${defaultOptions.distance})`;
              break;
            case 'left':
              transform = `translateX(-${defaultOptions.distance})`;
              break;
            case 'right':
              transform = `translateX(${defaultOptions.distance})`;
              break;
            default:
              transform = `translateY(${defaultOptions.distance})`;
          }
          
          // Aplicar transformação inicial
          el.style.transform = transform;
          el.style.willChange = 'transform, opacity';
          
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  // Calcular delay
                  const delay = defaultOptions.interval 
                    ? defaultOptions.delay + (index * defaultOptions.interval)
                    : defaultOptions.delay;
                  
                  // Agendar animação
                  setTimeout(() => {
                    const element = entry.target;
                    element.classList.remove('sr-hidden');
                    element.style.transition = `
                      opacity ${defaultOptions.duration}ms ${defaultOptions.easing},
                      transform ${defaultOptions.duration}ms ${defaultOptions.easing}
                    `;
                    element.style.transitionDelay = `${delay}ms`;
                    
                    void element.offsetWidth;
                    
                    element.style.opacity = '1';
                    element.style.transform = 'translate(0)';
                    element.classList.add('sr-revealed');
                    
                    // Limpar estilos após animação
                    setTimeout(() => {
                      element.style.transition = '';
                      element.style.transitionDelay = '';
                      element.style.willChange = '';
                    }, defaultOptions.duration + delay);
                    
                    if (!defaultOptions.reset) {
                      observer.unobserve(element);
                    }
                  }, 100); // Pequeno delay para garantir que a transição seja aplicada
                  
                } else if (defaultOptions.reset) {
                  // Resetar se necessário
                  setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = transform;
                    entry.target.classList.add('sr-hidden');
                    entry.target.classList.remove('sr-revealed');
                  }, 300);
                }
              });
            },
            { 
              threshold: defaultOptions.threshold,
              rootMargin: '50px' 
            }
          );

          observer.observe(el);
        });
      }
    };

    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      // Configurações específicas para o Header
      sr.reveal('.section_logo', {
        origin: 'bottom',
        delay: 500,
        duration: 3000
      });

      sr.reveal('.about__title, .section__title', {
        origin: 'left',
        delay: 500,
        duration: 3000
      });

      sr.reveal('.info1, .left', {
        origin: 'left',
        delay: 1400,
        duration: 1800
      });

      sr.reveal('hr, .navbar, .prod__content', {
        origin: 'top',
        delay: 900,
        interval: 180,
        duration: 1500
      });
      
      sr.reveal('.about__img', {
        origin: 'top',
        delay: 1500,
        duration: 1500
      });

      sr.reveal('.info2, .right', {
        origin: 'right',
        delay: 1400,
        duration: 1800
      });

      sr.reveal('.section_button, .about__highlight', {
        origin: 'bottom',
        delay: 2000,
        duration: 1200
      });

    }, 100);

    // Limpeza
    return () => {
      // Remover estilo
      document.head.removeChild(style);
      
      // Remover classes e estilos
      const elements = document.querySelectorAll('.sr-hidden, .sr-revealed');
      elements.forEach(el => {
        el.classList.remove('sr-hidden', 'sr-revealed');
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
        el.style.willChange = '';
        el.style.transitionDelay = '';
      });
    };
  }, []);
};

export default useScrollReveal;