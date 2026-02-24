import { ReactNode, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('m-theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      applyTheme('light');
    }
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
    localStorage.setItem('m-theme', newTheme);
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
      <script>
        {`window.__toggleTheme = () => {
          const html = document.documentElement;
          const current = html.classList.contains('dark') ? 'dark' : 'light';
          const next = current === 'dark' ? 'light' : 'dark';
          html.classList.toggle('dark');
          localStorage.setItem('m-theme', next);
        }`}
      </script>
    </>
  );
}
