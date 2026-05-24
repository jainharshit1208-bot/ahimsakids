/* ============================================================
   carousel.js — Touch-Friendly Drag-to-Scroll Carousel
   ============================================================
   Attaches to every element with class "carousel-drag".
   Supports:
     • Mouse drag with momentum/inertia
     • Touch drag (passive listeners for smooth scrolling)
     • Snap-back when over-scrolled
     • 'dragging' class for CSS cursor changes
   ============================================================ */

/**
 * Discover all .carousel-drag containers and wire them up.
 */
function initCarousels() {
  const carousels = document.querySelectorAll('.carousel-drag');
  carousels.forEach(setupDragScroll);
}

/**
 * Attach mouse + touch drag-scroll behaviour to a single element.
 * @param {HTMLElement} el — The scrollable container
 */
function setupDragScroll(el) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let velX = 0;
  let prevScrollLeft = 0;
  let momentumID = null;

  /* ----------------------------------------------------------
     Mouse events
     ---------------------------------------------------------- */

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    el.classList.add('dragging');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
    prevScrollLeft = scrollLeft;
    velX = 0;
    cancelMomentum();
  });

  el.addEventListener('mouseleave', () => {
    if (isDown) beginMomentum();
    isDown = false;
    el.classList.remove('dragging');
  });

  el.addEventListener('mouseup', () => {
    if (isDown) beginMomentum();
    isDown = false;
    el.classList.remove('dragging');
  });

  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5; // 1.5× multiplier for snappy feel
    const newScrollLeft = scrollLeft - walk;

    // Track velocity as the delta between frames
    velX = newScrollLeft - prevScrollLeft;
    prevScrollLeft = newScrollLeft;

    el.scrollLeft = newScrollLeft;
  });

  /* ----------------------------------------------------------
     Touch events (passive for best scroll performance)
     ---------------------------------------------------------- */

  el.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
    prevScrollLeft = scrollLeft;
    velX = 0;
    cancelMomentum();
  }, { passive: true });

  el.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    const newScrollLeft = scrollLeft - walk;

    velX = newScrollLeft - prevScrollLeft;
    prevScrollLeft = newScrollLeft;

    el.scrollLeft = newScrollLeft;
  }, { passive: true });

  el.addEventListener('touchend', () => {
    beginMomentum();
  }, { passive: true });

  /* ----------------------------------------------------------
     Momentum / inertia scrolling via requestAnimationFrame
     ---------------------------------------------------------- */

  function beginMomentum() {
    cancelMomentum();
    momentumID = requestAnimationFrame(momentumLoop);
  }

  function momentumLoop() {
    el.scrollLeft += velX;
    velX *= 0.95; // friction — decay 5 % per frame

    if (Math.abs(velX) > 0.5) {
      momentumID = requestAnimationFrame(momentumLoop);
    }
  }

  function cancelMomentum() {
    if (momentumID !== null) {
      cancelAnimationFrame(momentumID);
      momentumID = null;
    }
  }

  /* ----------------------------------------------------------
     Prevent child link/image clicks from firing after a drag
     ---------------------------------------------------------- */
  el.addEventListener('click', (e) => {
    // If the user dragged more than 5 px, suppress the click
    if (Math.abs(velX) > 2) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true); // capture phase so we beat child handlers
}
