import { useRef, useState } from 'react';
import { Plus, Upload, Trash2, Table2, Share2 } from 'lucide-react';
import { useStore } from '@/store';
import { parseCSV } from '@/utils/csv';
import { SharePanel } from './SharePanel';

export function TableList() {
  const tables = useStore((s) => s.tables);
  const activeTableId = useStore((s) => s.activeTableId);
  const loadTable = useStore((s) => s.loadTable);
  const createTable = useStore((s) => s.createTable);
  const deleteTable = useStore((s) => s.deleteTable);
  const importCSV = useStore((s) => s.importCSV);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shareOpen, setShareOpen] = useState(false);

  // Sort by most recently updated
  const sorted = [...tables].sort((a, b) => b.updatedAt - a.updatedAt);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.replace(/\.csv$/i, '');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { headers, rows } = parseCSV(text);
      if (headers.length > 0) importCSV(name, headers, rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {sorted.map((table) => (
          <div
            key={table.id}
            className={`group flex cursor-pointer items-center gap-1.5 px-3 py-1.5 transition-colors ${
              table.id === activeTableId
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => loadTable(table.id)}
          >
            <Table2
              size={12}
              className={
                table.id === activeTableId
                  ? 'shrink-0 text-gray-700 dark:text-gray-200'
                  : 'shrink-0 text-gray-400 dark:text-gray-500'
              }
            />
            <span
              className={`flex-1 truncate text-xs ${
                table.id === activeTableId
                  ? 'font-medium text-gray-800 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              title={table.name}
            >
              {table.name}
            </span>
            {tables.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteTable(table.id); }}
                className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:text-red-500"
                title="Delete"
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="relative border-t border-gray-200 p-2 dark:border-gray-700 space-y-0.5">
        {shareOpen && <SharePanel onClose={() => setShareOpen(false)} />}
        <button
          onClick={() => createTable('New Table')}
          className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <Plus size={12} />
          New table
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <Upload size={12} />
          Import CSV
        </button>
        <button
          onClick={() => setShareOpen((v) => !v)}
          className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <Share2 size={12} />
          Share
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleImport}
        />
      </div>
    </div>
  );
}
