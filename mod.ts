import { useEffect } from 'preact/hooks'
import { atom, useAtom } from 'fresh-atom'

/**
 * Atom for theme management, storing either 'dark' or 'light' mode.
 * Initializes theme based on `localStorage` or defaults to 'dark'.
 *
 * @type {Atom<'dark' | 'light'>}
 */
export const themeAtom = atom<'dark' | 'light'>(
  (localStorage.getItem('theme') as 'dark' | 'light') || 'dark',
)

/**
 * JavaScript code to initialize default dark mode.
 * Sets theme to 'dark' if none is set, or follows system dark mode preference.
 *
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
 * Sets theme to 'light' if none is set, or follows system dark mode preference.
 *
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
 * Updates the theme to either 'dark' or 'light' mode and saves the choice in `localStorage`.
 * This function also adjusts the `dark` class on the `<html>` element to apply the theme.
 *
 * @param {'dark' | 'light'} newTheme - The theme to set, either 'dark' or 'light'.
 */
export function setTheme(newTheme: 'dark' | 'light'): void {
  localStorage.setItem('theme', newTheme)
  if (globalThis.document) {
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }
}

/**
 * Type definition for the return value of the `useTheme` hook.
 *
 * @typedef {Object} UseThemeReturn
 * @property {'dark' | 'light'} theme - The current theme.
 * @property {(newTheme: 'dark' | 'light') => void} setTheme - Function to update the theme.
 */
type UseThemeReturn = {
  theme: 'dark' | 'light'
  setTheme: (newTheme: 'dark' | 'light') => void
}

/**
 * Custom hook to manage the theme (light or dark) using `fresh-atom`.
 * Provides a function to set the theme and returns the current theme value.
 * Listens for `localStorage` changes to sync theme across tabs.
 *
 * @returns {UseThemeReturn} An object containing the current theme and a function to set the theme.
 */
export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useAtom(themeAtom)

  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light'
      setTheme(savedTheme || 'dark')
    }

    globalThis.addEventListener('storage', handleStorageChange)

    return () => {
      globalThis.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  /**
   * Set the theme both locally and in `localStorage`.
   * Adjusts the `dark` class on the `<html>` element based on the selected theme.
   *
   * @param {'dark' | 'light'} newTheme - The theme to set, either 'dark' or 'light'.
   */
  const updateTheme = (newTheme: 'dark' | 'light') => {
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    setTheme(newTheme)
  }

  return { theme, setTheme: updateTheme }
}
