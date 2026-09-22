/* ==========================================================
   K' FRITOS — main.js
   Requisitos estrictos:
   - Objeto JSON que mapea categorías → imágenes
   - Al cargar o seleccionar "Papas y Arepas" → inyecta "WhatsApp Image 2026-09-08 at 3.21.42 PM.jpg"
   - Al seleccionar "Empanadas" → actualiza a "WhatsApp Image 2026-09-08 at 3.21.42 PM (2).jpg"
   - Mantiene 3 pestañas (Empanadas / Papas y Arepas / Bebidas)
   - Header sticky, drawer, scroll-spy, smooth scroll
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const imgPapas = document.getElementById('img-papas');
  const imgEmpanadas = document.getElementById('img-empanadas');
  const menuVisual = document.getElementById('menu-visual');
  const caption = document.getElementById('visual-caption');
  const sections = document.querySelectorAll('section[id]');

  /* ---------- 1. HEADER SCROLLED ---------- */
  const onScroll = () => {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. MOBILE DRAWER ---------- */
  const toggleDrawer = (force) => {
    const willOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
    drawer.classList.toggle('open', willOpen);
    hamburger.classList.toggle('open', willOpen);
    hamburger.setAttribute('aria-expanded', String(willOpen));
    document.body.style.overflow = willOpen ? 'hidden' : '';
  };
  hamburger.addEventListener('click', () => toggleDrawer());
  drawerLinks.forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !hamburger.contains(e.target)) {
      toggleDrawer(false);
    }
  });

  /* ---------- 3. SCROLL-SPY NAV ---------- */
  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: `-${header.offsetHeight + 20}px 0px -60% 0px`, threshold: 0.1 });
  sections.forEach(s => observerNav.observe(s));

  /* ---------- 4. SMOOTH SCROLL CON OFFSET ---------- */
  const smoothScroll = (targetId) => {
    const target = document.querySelector(targetId);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        smoothScroll(href);
        history.pushState(null, null, href);
      }
    });
  });

  /* ---------- 5. OBJETO JSON ESTRICTO — MAPEO CATEGORÍA → IMAGEN ---------- */
  /**
   * Requisito: "Crea un objeto JSON que mapee las categorías del menú con sus respectivas imágenes"
   * Nombres estrictos tal como pide el enunciado:
   * - Papas y Arepas -> "WhatsApp Image 2026-09-08 at 3.21.42 PM.jpg"
   * - Empanadas      -> "WhatsApp Image 2026-09-08 at 3.21.42 PM (2).jpg"
   */
  const menuImages = {
    "empanadas": "WhatsApp Image 2026-09-08 at 3.21.42 PM (2).jpg",
    "papas-arepas": "WhatsApp Image 2026-09-08 at 3.21.42 PM.jpg",
    "bebidas": "WhatsApp Image 2026-09-08 at 3.21.42 PM.jpg",
    // Alias para compatibilidad con nombres naturales
    "Papas y Arepas": "WhatsApp Image 2026-09-08 at 3.21.42 PM.jpg",
    "Empanadas": "WhatsApp Image 2026-09-08 at 3.21.42 PM (2).jpg"
  };

  const captions = {
    'empanadas': '🥟 Empanadas · Doradas, crujientes y recién fritas',
    'papas-arepas': '🥔 Papas y Arepas · Crujientes por fuera, suaves por dentro',
    'bebidas': '☕ Bebidas · El complemento perfecto para tu antojo'
  };

  let currentCategory = 'papas-arepas'; // default al cargar: Papas y Arepas

  /**
   * Inyección DOM en contenedor destacado (#menu-visual)
   * - Si existe #img-papas y #img-empanadas (estructura con 2 imgs + fade), se actualiza src desde JSON y se alterna .active
   * - Si solo existe contenedor, se inyecta <img> dinámicamente (fallback spec)
   */
  function injectFeaturedImage(category) {
    const src = menuImages[category] || menuImages['papas-arepas'];

    // Caso 1: estructura actual con 2 imgs (fade) — inyectamos src desde JSON y alternamos visibilidad
    if (imgPapas && imgEmpanadas) {
      // Asegurar que los src vengan siempre del JSON (inyección estricta)
      imgPapas.src = menuImages['papas-arepas'];
      imgPapas.alt = 'Papas rellenas y arepas artesanales K\' Fritos';
      imgEmpanadas.src = menuImages['empanadas'];
      imgEmpanadas.alt = 'Empanadas doradas y crujientes K\' Fritos';

      if (category === 'empanadas') {
        imgEmpanadas.classList.add('active');
        imgPapas.classList.remove('active');
      } else {
        // papas-arepas y bebidas comparten imagen de papas
        imgPapas.classList.add('active');
        imgEmpanadas.classList.remove('active');
        // src ya inyectado arriba desde JSON
      }
      // Fallback onerror dentro del DOM inyectado
      [imgPapas, imgEmpanadas].forEach(img => {
        img.onerror = function() {
          if (!this.dataset.fallback) {
            this.dataset.fallback = '1';
            this.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80&auto=format&fit=crop';
          }
        };
      });
    } else if (menuVisual) {
      // Caso 2 fallback: contenedor vacío — inyección completa via innerHTML (spec literal)
      menuVisual.innerHTML = `
        <img class="menu-img active" src="${src}" alt="${captions[category] || ''}" 
             onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80&auto=format&fit=crop'" />
        <div class="visual-caption" id="visual-caption">${captions[category] || captions['papas-arepas']}</div>
      `;
    }

    if (caption) caption.textContent = captions[category] || captions['papas-arepas'];
  }

  function swapImage(category){
    if (category === currentCategory) {
      // Aun si es la misma, re-inyectar para garantizar sync con JSON
      injectFeaturedImage(category);
      return;
    }
    currentCategory = category;

    // Actualizar tabs
    tabBtns.forEach(btn => {
      const isActive = btn.dataset.target === category;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    // Inyección DOM estricta desde JSON
    injectFeaturedImage(category);
  }

  // —— INYECCIÓN INICIAL AL CARGAR LA PÁGINA ———
  // Requisito: "Al cargar la página o seleccionar Papas y Arepas, el DOM inyecte la imagen ...PM.jpg"
  injectFeaturedImage('papas-arepas');
  // Asegurar tab activo inicial
  tabBtns.forEach(btn => {
    const isActive = btn.dataset.target === 'papas-arepas';
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
  // Si por HTML el active era otro, lo corregimos; o si se quiere iniciar en papas, ya está.

  // Click en tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      swapImage(target);

      const sectionMap = {
        'empanadas': '#empanadas',
        'papas-arepas': '#papas-arepas',
        'bebidas': '#bebidas'
      };
      const sel = sectionMap[target];
      if (sel) smoothScroll(sel);
    });
  });

  // Observer para cambio automático al hacer scroll por las categorías
  const categorySections = document.querySelectorAll('.menu-category');
  const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cat = entry.target.dataset.category;
        swapImage(cat);
      }
    });
  }, { rootMargin: '-30% 0px -55% 0px', threshold: 0.15 });
  categorySections.forEach(sec => categoryObserver.observe(sec));

  // Precarga para evitar parpadeo
  Object.values(menuImages).forEach(src => {
    const preload = new Image();
    preload.src = src;
  });

  // Ayuda en consola si faltan archivos locales
  const checkImages = () => {
    [imgPapas, imgEmpanadas].forEach(img => {
      if (!img) return;
      img.addEventListener('error', () => {
        console.warn(`[K' Fritos] No se encontró: ${img.getAttribute('src')} — usando fallback. Coloca el archivo exacto en la carpeta raíz.`);
      });
    });
    const logo = document.querySelector('.logo-wrap img');
    if (logo) {
      logo.addEventListener('error', () => {
        console.warn(`[K' Fritos] Logo no encontrado: 7afc2e27-f4a0-4871-ac7e-0cf953b4983d.jpg — se muestra fallback tipográfico.`);
      });
    }
  };
  checkImages();

  /* ---------- 6. CERRAR DRAWER CON ESC ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) toggleDrawer(false);
  });

  // Exponer para debug / verificación automática
  window.KFritos = { menuImages, injectFeaturedImage, swapImage };
});
