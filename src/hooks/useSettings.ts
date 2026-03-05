import { useEffect } from 'react';
import { useStore } from '@/store';
import type { Settings } from '@/types/settings';
import { DENSITY_ROW_HEIGHT } from '@/types/settings';

export function useSettings() {
  const loadSettings = useStore((s) => s.loadSettings);
  const settings = useStore((s) => s.settings);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Apply theme class to <html>
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark', 'true-black', 'cream');
    if (settings.theme === 'true-black') {
      html.classList.add('dark', 'true-black');
    } else {
      html.classList.add('cream');
    }
  }, [settings.theme]);

  // Apply density CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--row-height',
      `${DENSITY_ROW_HEIGHT[settings.density]}px`
    );
  }, [settings.density]);

  // Apply accent color CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', settings.accentColor);
  }, [settings.accentColor]);
}
