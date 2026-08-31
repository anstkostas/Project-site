/**
 * Set document's theme
 *
 * applyTheme -> Shared UI updates for a given theme (attribute, images, buttons, tooltip).
 *   Used by both the initial page-load state and user-triggered changes so the two can't drift
 *   out of sync with each other.
 * setTheme -> Event handler for a user-triggered theme change. Wraps applyTheme with persistence
 *   and the button rotation animation.
 * (function) -> IIFE that determines the initial theme (saved preference, else system preference)
 *   and applies it on page load.
 *
*/

const sunBtn = document.getElementById("light-mode-btn");
const moonBtn = document.getElementById("dark-mode-btn");
const tooltip = document.querySelector(".data-theme-toggle .tooltip-text");

// Applies a theme across the document: root attribute, logo/profile images, toggle-button
// visibility and tooltip text.
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  document.querySelector(
    ".k-container > img"
  ).src = `./assets/icons/Logo_${theme}.png`;
  document.querySelector(
    ".profile-img-container > img"
  ).src = `./assets/profile_pic_${theme}.png`;

  const isDark = theme === "dark";
  moonBtn.classList.toggle("visible", isDark);
  sunBtn.classList.toggle("visible", !isDark);
  // Tooltip names the theme a click would switch TO, i.e. the opposite of the one just applied.
  tooltip.textContent = isDark ? "Light" : "Dark";
}

// Event handler for a user-triggered theme change. `theme` is the theme to switch TO.
function setTheme(theme) {
  applyTheme(theme);

  // Save current theme state, to keep its value even on page load.
  localStorage.setItem("theme", theme);

  // Update theme-btns click feedback.
  sunBtn.animate([{ transform: "rotate(360deg)" }], { duration: 400 });
  moonBtn.animate([{ transform: "rotate(360deg)" }], { duration: 400 });
}

// Executes on load & checks for saved theme or system preference.
(function () {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  applyTheme(initialTheme);
})();

sunBtn.addEventListener("click", () => setTheme("dark"));
moonBtn.addEventListener("click", () => setTheme("light"));
