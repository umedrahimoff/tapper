/**
 * Safe localStorage utilities for SSR compatibility
 */

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }
    try {
      return localStorage.getItem(key)
    } catch (error) {
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      // localStorage setItem failed, continue
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }
    try {
      localStorage.removeItem(key)
    } catch (error) {
      // localStorage removeItem failed, continue
    }
  }
}
