import { useEffect, useRef, useState } from 'react';
import { Type, CheckSquare, Calendar, Link, AtSign, List, Layers, Plus, Trash2, Download } from 'lucide-react';
import { useStore } from '@/store';
import type { ColumnType } from '@/types/table';

interface Command {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

interface SlashCommandPaletteProps {
  rowId: string;
  columnId: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

export function SlashCommandPalette({ rowId, columnId, anchorRef, onClose }: SlashCommandPaletteProps) {
  const [selected, setSelected] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const slashQuery = useStore((s) => s.slashQuery) ?? '';
  const updateColumn = useStore((s) => s.updateColumn);
  const addColumn = useStore((s) => s.addColumn);
  const deleteRow = useStore((s) => s.deleteRow);
  const columns = useStore((s) => s.columns);
  const column = columns.find((c) => c.id === columnId);

  const commands: Command[] = [
    {
      id: 'text', label: 'Text', description: 'Plain text column', icon: <Type size={14} />,
      action: () => updateColumn(columnId, { type: 'text' }),
    },
    {
      id: 'select', label: 'Select', description: 'Single select', icon: <List size={14} />,
      action: () => updateColumn(columnId, { type: 'select' as ColumnType }),
    },
    {
      id: 'multi_select', label: 'Multi Select', description: 'Multiple options', icon: <Layers size={14} />,
      action: () => updateColumn(columnId, { type: 'multi_select' as ColumnType }),
    },
    {
      id: 'checkbox', label: 'Checkbox', description: 'True/false toggle', icon: <CheckSquare size={14} />,
      action: () => updateColumn(columnId, { type: 'checkbox' as ColumnType }),
    },
    {
      id: 'date', label: 'Date', description: 'Date picker', icon: <Calendar size={14} />,
      action: () => updateColumn(columnId, { type: 'date' as ColumnType }),
    },
    {
      id: 'url', label: 'URL', description: 'Link field', icon: <Link size={14} />,
      action: () => updateColumn(columnId, { type: 'url' as ColumnType }),
    },
    {
      id: 'email', label: 'Email', description: 'Email field', icon: <AtSign size={14} />,
      action: () => updateColumn(columnId, { type: 'email' as ColumnType }),
    },
    {
      id: 'add-col', label: 'Add Column', description: 'Insert new column', icon: <Plus size={14} />,
      action: () => addColumn('New Column', 'text'),
    },
    {
      id: 'del-row', label: 'Delete Row', description: 'Remove this row', icon: <Trash2 size={14} />,
      action: () => deleteRow(rowId),
    },
  ];

  const filtered = commands.filter((c) =>
    slashQuery === ''
      ? true
      : c.label.toLowerCase().includes(slashQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(slashQuery.toLowerCase())
  );

  useEffect(() => setSelected(0), [slashQuery]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selected]) {
          filtered[selected].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [filtered, selected, onClose]);

  // Position below anchor
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
  }, [anchorRef]);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={ref}
      className="fixed z-50 w-64 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      style={{ top: pos.top + 4, left: pos.left }}
    >
      <div className="border-b border-gray-200 px-3 py-1.5 dark:border-gray-700">
        <p className="text-xs text-gray-500">
          {slashQuery ? `Results for "/${slashQuery}"` : 'Slash commands'}
        </p>
      </div>
      <div className="max-h-60 overflow-y-auto py-1">
        {filtered.map((cmd, i) => (
          <button
            key={cmd.id}
            onClick={() => { cmd.action(); onClose(); }}
            className={`flex w-full items-start gap-2 px-3 py-2 text-left transition-colors ${
              i === selected
                ? 'bg-accent/10 text-accent'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="mt-0.5">{cmd.icon}</span>
            <span>
              <span className="block text-sm font-medium">{cmd.label}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">{cmd.description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
