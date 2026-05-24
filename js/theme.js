/* ============================================================
   theme.js — Dark/Light Mode Toggle for Ahimsa Kids
   ============================================================
   Reads/writes 'ahimsa-theme' in localStorage.
   Toggles data-theme="dark" on <html> to activate CSS variables.
   Updates the toggle button icon (☀️ / 🌙).
   ============================================================ */

/**
 * Initialize the theme on page load.
 * Checks localStorage for a saved preference; defaults to light.
 */
function initTheme() {
  const saved = localStorage.getItem('ahimsa-theme');

  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    // Ensure we start clean in light mode
    document.documentElement.removeAttribute('data-theme');
  }

  updateThemeIcon();
}

/**
 * Toggle between light ↔ dark themes.
 * Persists the choice to localStorage so it survives reloads.
 */
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('ahimsa-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('ahimsa-theme', 'dark');
  }

  updateThemeIcon();
}

/**
 * Sync the toggle-button emoji with the current theme state.
 * ☀️ shown in dark mode (click to go light), 🌙 in light mode.
 */
function updateThemeIcon() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}
