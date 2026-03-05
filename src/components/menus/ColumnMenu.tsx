import { useEffect, useRef, useState } from 'react';
import { Type, CheckSquare, Calendar, Link, AtSign, List, Layers, Trash2, GripHorizontal } from 'lucide-react';
import { useStore } from '@/store';
import type { Column, ColumnType } from '@/types/table';

const COLUMN_TYPES: { type: ColumnType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text', icon: <Type size={14} /> },
  { type: 'select', label: 'Select', icon: <List size={14} /> },
  { type: 'multi_select', label: 'Multi Select', icon: <Layers size={14} /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={14} /> },
  { type: 'date', label: 'Date', icon: <Calendar size={14} /> },
  { type: 'url', label: 'URL', icon: <Link size={14} /> },
  { type: 'email', label: 'Email', icon: <AtSign size={14} /> },
];

interface ColumnMenuProps {
  column: Column;
  onClose: () => void;
}

export function ColumnMenu({ column, onClose }: ColumnMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const updateColumn = useStore((s) => s.updateColumn);
  const deleteColumn = useStore((s) => s.deleteColumn);
  const setOpenMenu = useStore((s) => s.setOpenMenu);
  const [nameValue, setNameValue] = useState(column.name);

  const commitName = (v: string) => {
    const trimmed = v.trim();
    if (trimmed && trimmed !== column.name) updateColumn(column.id, { name: trimmed });
  };

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="w-56 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Name editor */}
      <div className="border-b border-gray-200 p-2 dark:border-gray-700">
        <input
          autoFocus
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={(e) => commitName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { commitName(nameValue); onClose(); }
          }}
          className="w-full rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:border-accent dark:border-gray-600 dark:bg-gray-700"
          placeholder="Column name"
        />
      </div>

      {/* Type picker */}
      <div className="p-1">
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Change Type
        </p>
        {COLUMN_TYPES.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => {
              updateColumn(column.id, { type });
              onClose();
            }}
            className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
              column.type === type
                ? 'bg-gray-100 dark:bg-gray-700 font-medium text-gray-900 dark:text-white'
                : 'text-gray-700 dark:text-gray-200'
            }`}
          >
            {icon}
            {label}
            {column.type === type && <span className="ml-auto text-gray-500 dark:text-gray-400">✓</span>}
          </button>
        ))}
      </div>

      {/* Options editor shortcut */}
      {(column.type === 'select' || column.type === 'multi_select') && (
        <div className="border-t border-gray-200 p-1 dark:border-gray-700">
          <button
            onClick={() => {
              setOpenMenu({ type: 'select-editor', columnId: column.id });
            }}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <GripHorizontal size={14} />
            Edit options
          </button>
        </div>
      )}

      {/* Delete — red-bordered danger zone */}
      <div className="border-t-2 border-red-100 p-1 dark:border-red-900/30">
        <p className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-red-400 dark:text-red-500">
          Danger
        </p>
        <button
          onClick={() => {
            deleteColumn(column.id);
            onClose();
          }}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={14} />
          Delete Column
        </button>
      </div>
    </div>
  );
}
