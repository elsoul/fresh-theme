import { useEffect } from 'npm:preact@10.24.3/hooks'
import { type Atom, atom, useAtom } from 'jsr:@elsoul/fresh-atom@1.0.0'

/**
 * Atom for theme management, storing either 'dark' or 'light' mode.
 * Initializes theme based on `localStorage` or defaults to 'dark'.
 *
 * @type {Atom<'dark' | 'light'>}
 */
export const themeAtom: Atom<'dark' | 'light'> = atom(
  (globalThis.localStorage?.getItem('theme') as 'dark' | 'light') || 'dark',
)

/**
 * JavaScript code to initialize default dark mode.
 * Sets theme to 'dark' if none is set, or follows system dark mode preference.
 *
 * @type {string}
 */
export const defaultDarkModeScript: string = `
  function applyDefaultTheme(change) {
    if (!("theme" in globalThis.localStorage)) {
      globalThis.localStorage.theme = 'dark';  // Ensure dark mode is set as default
    }

    if (change === 'auto') {
      delete globalThis.localStorage.theme;
    } else if (change === 'on') {
      globalThis.localStorage.theme = 'dark';
    } else if (change === 'off') {
      globalThis.localStorage.theme = 'light';
    }

    globalThis.isDark = globalThis.localStorage.theme === "dark" || 
      (!("theme" in globalThis.localStorage) && globalThis.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList[globalThis.isDark ? 'add' : 'remove']("dark");
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
    if (change === 'auto') delete globalThis.localStorage.theme; 
    else if (change === 'on') globalThis.localStorage.theme = 'dark'; 
    else if (change === 'off') globalThis.localStorage.theme = 'light';

    globalThis.isDark = globalThis.localStorage.theme === "dark" || 
      (globalThis.localStorage.theme !== "light" && globalThis.matchMedia("(prefers-color-scheme: dark)").matches);
    
    document.documentElement.classList[globalThis.isDark ? 'add' : 'remove']("dark");
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
  if (globalThis.localStorage) {
    globalThis.localStorage.setItem('theme', newTheme)
  }
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
    if (globalThis.localStorage) {
      const handleStorageChange = () => {
        const savedTheme = globalThis.localStorage.getItem('theme') as
          | 'dark'
          | 'light'
        setTheme(savedTheme || 'dark')
      }

      globalThis.addEventListener('storage', handleStorageChange)

      return () => {
        globalThis.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [])

  /**
   * Set the theme both locally and in `localStorage`.
   * Adjusts the `dark` class on the `<html>` element based on the selected theme.
   *
   * @param {'dark' | 'light'} newTheme - The theme to set, either 'dark' or 'light'.
   */
  const updateTheme = (newTheme: 'dark' | 'light') => {
    if (globalThis.localStorage) {
      globalThis.localStorage.setItem('theme', newTheme)
    }
    if (globalThis.document) {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    setTheme(newTheme)
  }

  return { theme, setTheme: updateTheme }
}
