import { ReactNode, useEffect, useState } from 'react';

const THEME_KEY = 'exos-theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    const resolved = stored ?? 'light';
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  const applyTheme = (t: 'light' | 'dark') => {
    const html = document.documentElement;
    if (t === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-40" data-testid="theme-provider-context">
        <input
          type="hidden"
          value={theme}
          onChange={() => toggleTheme()}
          data-testid="theme-context-value"
        />
      </div>
    </>
  );
}
