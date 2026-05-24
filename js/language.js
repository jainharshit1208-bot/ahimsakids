/* ============================================================
   language.js — Hindi / English Language Toggle for Ahimsa Kids
   ============================================================
   Every translatable DOM element carries two data-attributes:
     data-en="English text"   data-hi="हिन्दी पाठ"
   This module swaps .textContent based on the active language.
   Persists choice in localStorage under 'ahimsa-lang'.
   ============================================================ */

/** @type {'en'|'hi'} Current active language */
let currentLang = 'en';

/**
 * Initialize language on page load.
 * Restores saved preference from localStorage, then applies it.
 */
function initLanguage() {
  const saved = localStorage.getItem('ahimsa-lang');
  if (saved === 'en' || saved === 'hi') {
    currentLang = saved;
  }
  applyLanguage();
  updateLangIcon();
}

/**
 * Toggle between English ↔ Hindi.
 */
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  localStorage.setItem('ahimsa-lang', currentLang);
  applyLanguage();
  updateLangIcon();
}

/**
 * Walk the DOM and swap text content on every [data-en] element.
 * Falls back gracefully — if a data-hi attribute is missing the
 * element simply keeps its current text.
 */
function applyLanguage() {
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) {
      el.textContent = text;
    }
  });

  // Also update the <html> lang attribute for screen readers
  document.documentElement.lang = currentLang === 'hi' ? 'hi' : 'en';
}

/**
 * Sync the language-toggle button with the current state.
 * Shows the flag of the language you can switch TO.
 */
function updateLangIcon() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  // Show the flag of the OTHER language (the one you'll switch to)
  btn.textContent = currentLang === 'en' ? '🇮🇳' : '🇬🇧';
  btn.setAttribute(
    'aria-label',
    currentLang === 'en' ? 'Switch to Hindi' : 'Switch to English'
  );
}

/**
 * Helper: returns the current language code ('en' or 'hi').
 * Useful for other modules (e.g. wisdom rotation) that need the
 * active language without touching the DOM.
 */
function getCurrentLang() {
  return currentLang;
}
