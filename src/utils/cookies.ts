// Utility functions for managing cookies

export const cookieUtils = {
  // Set a cookie with optional expiration
  set: (name: string, value: string, days = 15) => {
    if (typeof document === 'undefined') return; // Server-side safety

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  },

  // Get a cookie value
  get: (name: string): string | null => {
    if (typeof document === 'undefined') return null; // Server-side safety

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Delete a cookie
  delete: (name: string) => {
    if (typeof document === 'undefined') return; // Server-side safety

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

  // Check if cookies are available
  isAvailable: (): boolean => {
    return typeof document !== 'undefined';
  }
};
