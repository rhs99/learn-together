import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.style.colorScheme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    // Apply background color to body element
    if (theme === 'dark') {
      document.body.style.background = 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)';
      document.body.style.backgroundColor = '#0F172A';
    } else {
      document.body.style.background = 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)';
      document.body.style.backgroundColor = '#F8FAFC';
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
