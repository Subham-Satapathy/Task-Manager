// utils/authUtils.ts
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token; // Return true if token exists, false otherwise
  };
  