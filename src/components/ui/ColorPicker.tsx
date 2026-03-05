import { useId } from 'react';
import { ACCENT_PRESETS } from '@/types/settings';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const hexId = useId();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {ACCENT_PRESETS.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            aria-label={`Select color ${color}`}
            aria-pressed={value === color}
            className="h-6 w-6 rounded-full ring-offset-1 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent"
            style={{
              backgroundColor: color,
              outline: value === color ? `2px solid ${color}` : undefined,
              outlineOffset: value === color ? '2px' : undefined,
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor={hexId} className="text-xs text-gray-500">Hex:</label>
        <input
          id={hexId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 rounded border border-gray-300 px-2 py-0.5 text-xs focus:border-accent focus:outline-none dark:border-gray-600 dark:bg-gray-800"
          placeholder="#6366f1"
        />
        <div
          className="h-5 w-5 rounded"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
}
