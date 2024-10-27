/**
 * Theme module for setting up light or dark modes in a Fresh app.
 * Provides a default dark mode script, a default light mode script,
 * and a function to toggle and persist the theme on the client side.
 */

/**
 * JavaScript code to initialize default dark mode.
 * This script checks for the `localStorage` theme setting.
 * If none is set, it defaults to dark mode or follows the system's dark mode preference.
 * @type {string}
 */
export const defaultDarkModeScript: string = `
  function applyDefaultTheme(change) {
    if (!("theme" in localStorage)) {
      localStorage.theme = 'dark';  // Ensure dark mode is set as default
    }

    if (change === 'auto') {
      delete localStorage.theme;
    } else if (change === 'on') {
      localStorage.theme = 'dark';
    } else if (change === 'off') {
      localStorage.theme = 'light';
    }

    window.isDark = localStorage.theme === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList[window.isDark ? 'add' : 'remove']("dark");
  }
  applyDefaultTheme();
`

/**
 * JavaScript code to initialize default light mode.
 * This script checks for the `localStorage` theme setting.
 * If none is set, it defaults to light mode or follows the system's dark mode preference.
 * @type {string}
 */
export const defaultLightModeScript: string = `
  function applyDefaultTheme(change) {
    if (change === 'auto') delete localStorage.theme; 
    else if (change === 'on') localStorage.theme = 'dark'; 
    else if (change === 'off') localStorage.theme = 'light';

    window.isDark = localStorage.theme === "dark" || 
      (localStorage.theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    document.documentElement.classList[window.isDark ? 'add' : 'remove']("dark");
  }
  applyDefaultTheme();
`

/**
 * Sets the theme to either 'dark' or 'light' mode and saves the choice in localStorage.
 * When a user toggles the theme, this function updates the theme in localStorage
 * and adjusts the `dark` class on the `<html>` element.
 *
 * @param {'dark' | 'light'} newTheme - The theme to set, either 'dark' or 'light'.
 */
export function setTheme(newTheme: 'dark' | 'light'): void {
  localStorage.setItem('theme', newTheme)
}
