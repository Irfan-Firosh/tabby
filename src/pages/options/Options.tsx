import { useSettings } from '@/hooks/useSettings';
import { useStore } from '@/store';
import { ColorPicker } from '@/components/ui/ColorPicker';
import type { Settings } from '@/types/settings';

export function Options() {
  useSettings();
  const settings = useStore((s) => s.settings);
  const setTheme = useStore((s) => s.setTheme);
  const setDensity = useStore((s) => s.setDensity);
  const setAccentColor = useStore((s) => s.setAccentColor);

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Tabby Settings
        </h1>

        <div className="space-y-6">
          {/* Theme */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Theme
            </h2>
            <div className="flex gap-3">
              {(['true-black', 'cream'] as Settings['theme'][]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`rounded-md border px-4 py-2 text-sm capitalize transition-colors ${
                    settings.theme === t
                      ? 'border-accent bg-accent/10 text-accent font-medium'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-200'
                  }`}
                >
                  {t === 'true-black' ? 'Black' : 'Cream'}
                </button>
              ))}
            </div>
          </section>

          {/* Density */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Row Density
            </h2>
            <div className="flex gap-3">
              {(['compact', 'comfortable', 'spacious'] as Settings['density'][]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`rounded-md border px-4 py-2 text-sm capitalize transition-colors ${
                    settings.density === d
                      ? 'border-accent bg-accent/10 text-accent font-medium'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>

          {/* Accent Color */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Accent Color
            </h2>
            <ColorPicker value={settings.accentColor} onChange={setAccentColor} />
          </section>
        </div>
      </div>
    </div>
  );
}
