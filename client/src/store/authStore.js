import { create } from 'zustand';

// Simple persistence helper
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    return stored ? JSON.parse(stored) : { user: null, token: null, isAuthenticated: false };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem('auth-storage', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save auth state:', e);
  }
};

export const useAuthStore = create((set) => {
  const initialState = loadFromStorage();
  
  return {
    ...initialState,
    
    login: (user, token) => {
      const newState = { user, token, isAuthenticated: true };
      saveToStorage(newState);
      set(newState);
    },
    
    logout: () => {
      const newState = { user: null, token: null, isAuthenticated: false };
      saveToStorage(newState);
      set(newState);
    },
  };
});

