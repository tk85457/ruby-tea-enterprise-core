'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'heritage' | 'ivory';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('heritage');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('ruby-tea-personality') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'ivory') {
        document.documentElement.classList.add('theme-ivory');
      }
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'heritage' ? 'ivory' : 'heritage';
    setTheme(newTheme);
    localStorage.setItem('ruby-tea-personality', newTheme);

    if (newTheme === 'ivory') {
      document.documentElement.classList.add('theme-ivory');
    } else {
      document.documentElement.classList.remove('theme-ivory');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
