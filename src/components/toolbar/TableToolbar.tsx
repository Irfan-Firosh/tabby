import { useState } from 'react';
import { Plus, Download, Sun, Moon, Settings, PanelLeft } from 'lucide-react';
import { useStore } from '@/store';
import { ExportMenu } from './ExportMenu';
import type { Theme } from '@/types/settings';

const THEME_CYCLE: Theme[] = ['true-black', 'cream'];

const THEME_ICONS: Record<Theme, React.ReactNode> = {
  'true-black': <Moon size={14} />,
  cream: <Sun size={14} />,
};

interface TableToolbarProps {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function TableToolbar({ sidebarOpen, onToggleSidebar }: TableToolbarProps = {}) {
  const activeTableId = useStore((s) => s.activeTableId);
  const tables = useStore((s) => s.tables);
  const updateTableName = useStore((s) => s.updateTableName);
  const addColumn = useStore((s) => s.addColumn);
  const theme = useStore((s) => s.settings.theme);
  const setTheme = useStore((s) => s.setTheme);
  const [exportOpen, setExportOpen] = useState(false);

  const table = tables.find((t) => t.id === activeTableId);

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(theme);
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-1 py-1.5 dark:border-gray-700">
      <div className="flex items-center gap-1">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 ${sidebarOpen ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
            title="Toggle sidebar"
          >
            <PanelLeft size={14} />
          </button>
        )}
        {table && (
        <input
          key={table.id}
          defaultValue={table.name}
          onBlur={(e) => {
            if (e.target.value !== table.name) {
              updateTableName(table.id, e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          className="rounded px-2 py-0.5 text-base font-semibold text-gray-800 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
        />
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => addColumn('New Column', 'text')}
          className="flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Add column"
        >
          <Plus size={14} />
          Column
        </button>

        <div className="relative">
          <button
            onClick={() => setExportOpen((v) => !v)}
            className="flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Export"
          >
            <Download size={14} />
          </button>
          {exportOpen && <ExportMenu onClose={() => setExportOpen(false)} />}
        </div>

        <button
          onClick={cycleTheme}
          className="flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          title={`Theme: ${theme}`}
        >
          {THEME_ICONS[theme]}
        </button>

        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Settings"
        >
          <Settings size={14} />
        </button>
      </div>
    </div>
  );
}
