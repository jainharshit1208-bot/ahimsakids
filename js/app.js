/* ============================================================
   app.js — Main Orchestrator for Ahimsa Kids
   ============================================================
   This file is loaded LAST in the HTML, after:
     1. theme.js
     2. language.js
     3. carousel.js
     4. interactions.js
   All functions from those files are available on the global
   scope (no modules/imports).
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     Core setup
     -------------------------------------------------------- */
  initTheme();          // theme.js     — restore dark/light preference
  initLanguage();       // language.js  — restore Hindi/English preference

  /* --------------------------------------------------------
     UI components
     -------------------------------------------------------- */
  initCarousels();      // carousel.js  — drag-to-scroll carousels
  if (typeof initHeroCarousel === 'function') initHeroCarousel();
  initScrollAnimations();               // scroll-triggered fade-ins
  initHeaderScroll();                   // shrink/elevate header on scroll

  /* --------------------------------------------------------
     Content & engagement
     -------------------------------------------------------- */
  initEngagement();     // interactions.js — like/save/share counters
  initWisdom();         // interactions.js — daily wisdom rotation
  initKashayas();       // interactions.js — kashaya card expand
  initBottomNav();      // interactions.js — bottom nav + scroll-spy
  animateCounters();    // interactions.js — animate stat numbers

  /* --------------------------------------------------------
     Visual polish
     -------------------------------------------------------- */
  createSparkles();     // interactions.js — sparkle particles
  lazyLoadIframes();                      // defer off-screen iframes

  /* --------------------------------------------------------
     Ready!
     -------------------------------------------------------- */
  console.log('🌸 Ahimsa Kids loaded successfully!');
});


/* ============================================================
   SCROLL-TRIGGERED ANIMATIONS
   ============================================================
   Any element with class "animate-on-scroll" gets an "animated"
   class added once it scrolls into view. Pair with CSS:

   .animate-on-scroll {
     opacity: 0; transform: translateY(20px);
     transition: opacity .6s ease, transform .6s ease;
   }
   .animate-on-scroll.animated {
     opacity: 1; transform: translateY(0);
   }
   ============================================================ */

function initScrollAnimations() {
  const targets = document.querySelectorAll('.animate-on-scroll');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // trigger slightly before element is fully in view
  });

  targets.forEach(el => observer.observe(el));
}


/* ============================================================
   HEADER SCROLL EFFECT
   ============================================================
   Adds .header--scrolled when the user scrolls past 50 px.
   Use this in CSS to add a shadow, shrink the logo, etc.
   ============================================================ */

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ============================================================
   LAZY-LOAD IFRAMES
   ============================================================
   Any <iframe data-src="…"> will have its src set only when the
   iframe scrolls near the viewport (200 px lookahead).
   ============================================================ */

function lazyLoadIframes() {
  const iframes = document.querySelectorAll('iframe[data-src]');
  if (!iframes.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        iframe.src = iframe.dataset.src;
        iframe.removeAttribute('data-src'); // clean up
        observer.unobserve(iframe);
      }
    });
  }, {
    rootMargin: '200px' // start loading 200 px before visible
  });

  iframes.forEach(iframe => observer.observe(iframe));
}


/* ============================================================
   GLOBAL CLICK DELEGATION
   ============================================================
   Header buttons use event delegation so they work even if the
   buttons are rendered dynamically.
   ============================================================ */

document.addEventListener('click', (e) => {
  // Theme toggle
  if (e.target.closest('#theme-toggle')) {
    toggleTheme();
  }

  // Language toggle
  if (e.target.closest('#lang-toggle')) {
    toggleLanguage();
  }
});
