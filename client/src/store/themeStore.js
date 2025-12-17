import { create } from 'zustand';

// Theme definitions
const themes = {
  default: {
    name: 'Default (Yellow & Black)',
    primary: '#000000',
    secondary: '#FFFC00',
    accent: '#FFFC00',
    bg: '#FFFC00',
    card: '#FFFFFF',
    text: '#000000',
    textLight: '#333333',
    border: '#000000',
    success: '#000000',
    warning: '#FFFC00',
    danger: '#000000',
  },
  dark: {
    name: 'Dark Mode',
    primary: '#FFFFFF',
    secondary: '#FFFC00',
    accent: '#FFFC00',
    bg: '#0A0A0A',
    card: '#1A1A1A',
    text: '#FFFFFF',
    textLight: '#CCCCCC',
    border: '#333333',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  light: {
    name: 'Light Mode',
    primary: '#000000',
    secondary: '#3B82F6',
    accent: '#3B82F6',
    bg: '#FFFFFF',
    card: '#F9FAFB',
    text: '#000000',
    textLight: '#4B5563',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  medical: {
    name: 'Medical Blue',
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#60A5FA',
    bg: '#F0F9FF',
    card: '#FFFFFF',
    text: '#1E293B',
    textLight: '#64748B',
    border: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  purple: {
    name: 'Purple Theme',
    primary: '#7C3AED',
    secondary: '#A78BFA',
    accent: '#C4B5FD',
    bg: '#FAF5FF',
    card: '#FFFFFF',
    text: '#1E1B4B',
    textLight: '#6B7280',
    border: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
};

// Load theme from localStorage
const loadTheme = () => {
  try {
    const stored = localStorage.getItem('theme-storage');
    return stored ? JSON.parse(stored) : { theme: 'default' };
  } catch {
    return { theme: 'default' };
  }
};

// Save theme to localStorage
const saveTheme = (theme) => {
  try {
    localStorage.setItem('theme-storage', JSON.stringify({ theme }));
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
};

// Apply theme to document
const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.default;
  const root = document.documentElement;
  
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-bg', theme.bg);
  root.style.setProperty('--theme-card', theme.card);
  root.style.setProperty('--theme-text', theme.text);
  root.style.setProperty('--theme-text-light', theme.textLight);
  root.style.setProperty('--theme-border', theme.border);
  root.style.setProperty('--theme-success', theme.success);
  root.style.setProperty('--theme-warning', theme.warning);
  root.style.setProperty('--theme-danger', theme.danger);
  root.style.setProperty('--theme-yellow', theme.secondary);
  root.style.setProperty('--theme-black', theme.primary);
  
  // Also update body background
  document.body.style.background = theme.bg;
  document.body.style.color = theme.text;
};

export const useThemeStore = create((set) => {
  const initialState = loadTheme();
  
  // Apply theme on initialization
  applyTheme(initialState.theme);
  
  return {
    currentTheme: initialState.theme,
    themes,
    
    setTheme: (themeName) => {
      if (themes[themeName]) {
        applyTheme(themeName);
        saveTheme(themeName);
        set({ currentTheme: themeName });
      }
    },
    
    getCurrentTheme: () => {
      return themes[initialState.theme] || themes.default;
    },
  };
});

