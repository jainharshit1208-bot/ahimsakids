/* ============================================================
   interactions.js — Micro-Interactions for Ahimsa Kids
   ============================================================
   1. Like / Save / Share engagement counters
   2. Daily Wisdom auto-rotation (8 s cycle, fade transition)
   3. Kashaya card flip / expand
   4. Sparkle particle effects
   5. Bottom navigation with smooth scroll
   6. Animated stat counters
   ============================================================ */

/* ============================================================
   1. ENGAGEMENT COUNTERS
   ============================================================ */

/**
 * Wire up .feed-card__action buttons.
 * • Increments the nested .count on each click
 * • Adds a brief scale pop animation
 * • Toggles a "liked" class for heart-style buttons
 */
function initEngagement() {
  document.querySelectorAll('.feed-card__action').forEach(action => {
    action.addEventListener('click', () => {
      // Increment counter
      const countEl = action.querySelector('.count');
      if (countEl) {
        let count = parseInt(countEl.textContent, 10) || 0;
        count++;
        countEl.textContent = count;

        // Quick scale-pop feedback
        action.style.transform = 'scale(1.2)';
        setTimeout(() => { action.style.transform = ''; }, 200);
      }

      // Toggle liked state for heart/like buttons
      if (action.dataset.action === 'like') {
        action.classList.toggle('liked');
      }
    });
  });
}


/* ============================================================
   2. DAILY WISDOM AUTO-ROTATION
   ============================================================ */

/** @type {number} Index into wisdomData that is currently visible */
let wisdomIndex = 0;

/** @type {number|null} Interval ID so we can pause/restart if needed */
let wisdomTimer = null;

/**
 * Bilingual wisdom entries.
 * Each object carries English + Hindi versions of the quote,
 * a kid-friendly lesson, and a daily challenge.
 */
const wisdomData = [
  {
    quote:       '"Ahimsa Paramo Dharma" — Non-violence is the highest duty 🙏',
    quoteHi:     '"अहिंसा परमो धर्मः" — अहिंसा सबसे बड़ा धर्म है 🙏',
    lesson:      'Every living being wants to be happy. When we practice non-violence, we help everyone find peace.',
    lessonHi:    'हर जीव सुखी रहना चाहता है। जब हम अहिंसा का पालन करते हैं, तो हम सबको शांति पाने में मदद करते हैं।',
    challenge:   '🌼 Speak gently to everyone today',
    challengeHi: '🌼 आज सबसे मधुर वाणी में बोलें'
  },
  {
    quote:       '"Parasparopagraho Jivanam" — All life is interconnected 🌍',
    quoteHi:     '"परस्परोपग्रहो जीवानाम्" — सभी जीव एक-दूसरे पर निर्भर हैं 🌍',
    lesson:      'Like a beautiful garden, every creature plays an important role in our world.',
    lessonHi:    'एक सुंदर बगीचे की तरह, हर प्राणी हमारी दुनिया में महत्वपूर्ण भूमिका निभाता है।',
    challenge:   '🌱 Help a plant or animal today',
    challengeHi: '🌱 आज किसी पौधे या जानवर की मदद करें'
  },
  {
    quote:       '"Kshama Veerasya Bhooshanam" — Forgiveness is the ornament of the brave 💎',
    quoteHi:     '"क्षमा वीरस्य भूषणम्" — क्षमा वीरों का आभूषण है 💎',
    lesson:      'It takes more strength to forgive than to be angry. Be a hero — forgive today!',
    lessonHi:    'क्रोध करने से ज़्यादा ताकत क्षमा करने में लगती है। आज नायक बनें — क्षमा करें!',
    challenge:   '💛 Forgive someone who upset you',
    challengeHi: '💛 जिसने आपको दुखी किया उसे माफ़ करें'
  },
  {
    quote:       '"Live and Let Live" — Every soul is precious ✨',
    quoteHi:     '"जियो और जीने दो" — हर आत्मा अनमोल है ✨',
    lesson:      'From the tiniest ant to the biggest elephant, every being has a soul that deserves respect.',
    lessonHi:    'सबसे छोटी चींटी से लेकर सबसे बड़े हाथी तक, हर प्राणी में आत्मा है जो सम्मान की हकदार है।',
    challenge:   '🕊️ Be kind to all creatures today',
    challengeHi: '🕊️ आज सभी जीवों के प्रति दयालु रहें'
  },
  {
    quote:       '"Uttam Satya" — Truth is the foundation of all virtues 🌟',
    quoteHi:     '"उत्तम सत्य" — सत्य सभी गुणों की नींव है 🌟',
    lesson:      'When you speak the truth, your heart becomes light and your mind becomes clear.',
    lessonHi:    'जब आप सत्य बोलते हैं, तो आपका हृदय हल्का और मन स्पष्ट हो जाता है।',
    challenge:   '✨ Practice truthfulness in all your words today',
    challengeHi: '✨ आज अपने सभी शब्दों में सत्य का पालन करें'
  }
];

/**
 * Start the wisdom rotation on an 8-second interval.
 * Immediately renders the first card.
 */
function initWisdom() {
  updateWisdom();
  wisdomTimer = setInterval(() => {
    wisdomIndex = (wisdomIndex + 1) % wisdomData.length;
    updateWisdom();
  }, 8000);
}

/**
 * Render the current wisdom entry into the DOM.
 * Uses a 300 ms fade-out → swap → fade-in transition.
 */
function updateWisdom() {
  const card = document.querySelector('.wisdom__card');
  if (!card) return;

  const data = wisdomData[wisdomIndex];
  const lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : (localStorage.getItem('ahimsa-lang') || 'en');

  // Fade out
  card.style.opacity = '0';
  card.style.transform = 'translateY(10px)';

  setTimeout(() => {
    const quoteEl     = card.querySelector('.wisdom__quote');
    const lessonEl    = card.querySelector('.wisdom__lesson');
    const challengeEl = card.querySelector('.wisdom__challenge');

    if (quoteEl)     quoteEl.textContent     = lang === 'hi' ? data.quoteHi     : data.quote;
    if (lessonEl)    lessonEl.textContent    = lang === 'hi' ? data.lessonHi    : data.lesson;
    if (challengeEl) challengeEl.textContent = lang === 'hi' ? data.challengeHi : data.challenge;

    // Update dot indicators
    document.querySelectorAll('.wisdom__dot').forEach((dot, i) => {
      dot.classList.toggle('wisdom__dot--active', i === wisdomIndex);
    });

    // Fade in
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 300);
}


/* ============================================================
   3. KASHAYA CARD FLIP / EXPAND
   ============================================================ */

/**
 * Toggle "expanded" state on the four Kashaya cards
 * (Anger, Ego, Deceit, Greed) when clicked.
 */
function initKashayas() {
  document.querySelectorAll('.kashaya-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('kashaya-card--expanded');
    });

    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('kashaya-card--expanded');
      }
    });
  });
}


/* ============================================================
   4. SPARKLE PARTICLE EFFECTS
   ============================================================ */

/**
 * Sprinkle 3 random sparkle emojis into every .section container.
 * Each sparkle gets randomised position, size, and animation timing.
 */
function createSparkles() {
  const sparkleEmojis = ['✨', '🌟', '⭐', '💫'];
  const sections = document.querySelectorAll('.section');

  sections.forEach(section => {
    // Ensure position context for absolute sparkles
    const pos = getComputedStyle(section).position;
    if (pos === 'static') {
      section.style.position = 'relative';
    }

    for (let i = 0; i < 3; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle sparkle-anim';
      sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
      sparkle.setAttribute('aria-hidden', 'true'); // decorative only

      // Randomise placement & timing
      sparkle.style.position = 'absolute';
      sparkle.style.top = (Math.random() * 100) + '%';
      sparkle.style.left = (Math.random() * 100) + '%';
      sparkle.style.fontSize = (12 + Math.random() * 12) + 'px';
      sparkle.style.animationDelay = (Math.random() * 3) + 's';
      sparkle.style.animationDuration = (2 + Math.random() * 3) + 's';
      sparkle.style.pointerEvents = 'none'; // don't steal clicks

      section.appendChild(sparkle);
    }
  });
}


/* ============================================================
   5. BOTTOM NAVIGATION
   ============================================================ */

/**
 * Activate bottom-nav items on click and smooth-scroll to the
 * target section identified by data-section="sectionId".
 */
function initBottomNav() {
  const navItems = document.querySelectorAll('.bottom-nav__item');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Move active state
      navItems.forEach(n => n.classList.remove('bottom-nav__item--active'));
      item.classList.add('bottom-nav__item--active');

      // Smooth-scroll to linked section with offset for sticky header
      const target = item.dataset.section;
      if (target) {
        const section = document.getElementById(target);
        if (section) {
          // 80px offset accounts for the fixed header
          const y = section.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });

    // Keyboard accessibility for bottom nav
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Wire up Hero CTA button if it exists
  const heroCta = document.getElementById('hero-cta');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      const learnSection = document.getElementById('watch');
      if (learnSection) {
        const y = learnSection.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }

  // Update active nav item on scroll (scroll-spy)
  initScrollSpy(navItems);
}

/**
 * Lightweight scroll-spy: highlights the bottom-nav item whose
 * target section is currently in view.
 * @param {NodeListOf<Element>} navItems
 */
function initScrollSpy(navItems) {
  if (!navItems.length) return;

  const sectionMap = new Map();
  navItems.forEach(item => {
    const id = item.dataset.section;
    if (id) {
      const section = document.getElementById(id);
      if (section) sectionMap.set(item, section);
    }
  });

  if (!sectionMap.size) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(n => n.classList.remove('bottom-nav__item--active'));
        // Find the nav item that owns this section
        sectionMap.forEach((sec, nav) => {
          if (sec === entry.target) {
            nav.classList.add('bottom-nav__item--active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sectionMap.forEach(section => observer.observe(section));
}


/* ============================================================
   6. ANIMATED STAT COUNTERS
   ============================================================ */

/**
 * Animate numeric counters from 0 → data-count value.
 * Uses IntersectionObserver so counters only animate when visible.
 */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/**
 * Animate a single counter element from 0 to its target.
 * @param {HTMLElement} el
 */
function runCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target) || target <= 0) {
    el.textContent = '0';
    return;
  }

  const totalFrames = 50;
  const increment = target / totalFrames;
  let current = 0;
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    current += increment;

    if (frame >= totalFrames) {
      current = target;
      clearInterval(timer);
    }

    el.textContent = Math.floor(current).toLocaleString();
  }, 30);
}


/* ============================================================
   7. HERO CAROUSEL
   ============================================================ */

const HERO_DATA = [
  {
    bg: '#FFBC99',
    ghost: 'AHIMSA',
    title: 'LEARN AHIMSA 🌱',
    titleHi: 'अहिंसा सीखें 🌱',
  },
  {
    bg: '#98FF98',
    ghost: 'TIRTHANKARAS',
    title: 'MEET THE TIRTHANKARAS ✨',
    titleHi: 'तीर्थंकरों से मिलें ✨',
  },
  {
    bg: '#FF69B4',
    ghost: 'KASHAYAS',
    title: 'UNDERSTAND KASHAYAS 🔥',
    titleHi: 'कषाय को समझें 🔥',
  },
  {
    bg: '#E8E4F3',
    ghost: 'JAIN STORIES',
    title: 'WATCH JAIN STORIES 📚',
    titleHi: 'जैन कहानियाँ देखें 📚',
  }
];

let heroActiveIndex = 0;
let isHeroAnimating = false;

function initHeroCarousel() {
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  if (!prevBtn || !nextBtn) return;

  // Initialize roles
  updateHeroRoles();

  prevBtn.addEventListener('click', () => navigateHero('prev'));
  nextBtn.addEventListener('click', () => navigateHero('next'));
}

function navigateHero(direction) {
  if (isHeroAnimating) return;
  isHeroAnimating = true;

  if (direction === 'next') {
    heroActiveIndex = (heroActiveIndex + 1) % 4;
  } else {
    heroActiveIndex = (heroActiveIndex + 3) % 4;
  }

  updateHeroRoles();

  // 650ms lock to match cubic-bezier CSS transition
  setTimeout(() => {
    isHeroAnimating = false;
  }, 650);
}

function updateHeroRoles() {
  const slides = document.querySelectorAll('.hero-slide');
  const carousel = document.querySelector('.hero-carousel');
  const ghostText = document.getElementById('hero-ghost-text');
  const title = document.getElementById('hero-title');
  
  if (!slides.length || !carousel) return;

  const center = heroActiveIndex;
  const left = (heroActiveIndex + 3) % 4;
  const right = (heroActiveIndex + 1) % 4;
  const back = (heroActiveIndex + 2) % 4;

  slides.forEach((slide) => {
    const idx = parseInt(slide.dataset.index, 10);
    // Remove all roles
    slide.classList.remove('is-center', 'is-left', 'is-right', 'is-back');

    // Add new role
    if (idx === center) slide.classList.add('is-center');
    else if (idx === left) slide.classList.add('is-left');
    else if (idx === right) slide.classList.add('is-right');
    else if (idx === back) slide.classList.add('is-back');
  });

  // Update backgrounds and text
  const data = HERO_DATA[heroActiveIndex];
  carousel.style.backgroundColor = data.bg;
  
  if (ghostText) {
    ghostText.textContent = data.ghost;
  }
  
  if (title) {
    const lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : (localStorage.getItem('ahimsa-lang') || 'en');
    title.textContent = lang === 'hi' ? data.titleHi : data.title;
    
    // Also store bilingual data on element for language toggler
    title.dataset.en = data.title;
    title.dataset.hi = data.titleHi;
  }
}

