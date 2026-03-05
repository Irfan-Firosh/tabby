import type { StateCreator } from 'zustand';
import type { Settings } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';

export interface SettingsSlice {
  settings: Settings;
  setTheme: (theme: Settings['theme']) => void;
  setDensity: (density: Settings['density']) => void;
  setAccentColor: (color: string) => void;
  loadSettings: () => Promise<void>;
}

function saveToStorage(settings: Settings) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.set({ settings });
  }
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  settings: DEFAULT_SETTINGS,

  loadSettings: async () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise<void>((resolve) => {
        chrome.storage.sync.get(['settings'], (result) => {
          if (result.settings) {
            set({ settings: { ...DEFAULT_SETTINGS, ...result.settings } });
          }
          resolve();
        });
      });
    }
  },

  setTheme: (theme) =>
    set((s) => {
      const settings = { ...s.settings, theme };
      saveToStorage(settings);
      return { settings };
    }),

  setDensity: (density) =>
    set((s) => {
      const settings = { ...s.settings, density };
      saveToStorage(settings);
      return { settings };
    }),

  setAccentColor: (accentColor) =>
    set((s) => {
      const settings = { ...s.settings, accentColor };
      saveToStorage(settings);
      return { settings };
    }),
});
