import { useEffect } from 'react';
import { APP_CONFIG } from '@/config/app.config';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const root = document.documentElement;
    const colors = APP_CONFIG.COLORS;

    // Inject CSS variables
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-dark', colors.primaryDark);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-dark', colors.accentDark);
    root.style.setProperty('--surface-50', colors.surface[50]);
    root.style.setProperty('--surface-100', colors.surface[100]);
    root.style.setProperty('--surface-200', colors.surface[200]);
    root.style.setProperty('--shadow-glass-color', colors.shadow);
  }, []);

  return <>{children}</>;
};
