export type Theme = 'true-black' | 'cream';
export type Density = 'compact' | 'comfortable' | 'spacious';

export interface Settings {
  theme: Theme;
  density: Density;
  accentColor: string;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'true-black',
  density: 'comfortable',
  accentColor: '#6366f1',
};

export const DENSITY_ROW_HEIGHT: Record<Density, number> = {
  compact: 32,
  comfortable: 40,
  spacious: 52,
};

export const ACCENT_PRESETS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#06b6d4', // Cyan
];
