import { useRef, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/store';
import { Pill } from '@/components/ui/Pill';
import { OPTION_COLORS } from '@/utils/colors';
import { generateId } from '@/utils/id';
import type { SelectOption } from '@/types/table';

interface SelectOptionEditorProps {
  columnId: string;
  onClose: () => void;
}

export function SelectOptionEditor({ columnId, onClose }: SelectOptionEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const columns = useStore((s) => s.columns);
  const updateColumn = useStore((s) => s.updateColumn);
  const column = columns.find((c) => c.id === columnId)!;
  const options = column?.options ?? [];

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

  const updateOptions = (opts: SelectOption[]) =>
    updateColumn(columnId, { options: opts });

  const addOption = () => {
    const newOpt: SelectOption = {
      id: generateId(),
      label: 'Option',
      color: 'gray',
    };
    updateOptions([...options, newOpt]);
  };

  const updateOption = (id: string, patch: Partial<SelectOption>) => {
    updateOptions(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const deleteOption = (id: string) => {
    updateOptions(options.filter((o) => o.id !== id));
  };

  return (
    <div
      ref={ref}
      className="w-64 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Options</p>
      </div>

      <div className="max-h-64 overflow-y-auto p-2">
        {options.map((opt) => (
          <div key={opt.id} className="mb-2 rounded border border-gray-200 p-2 dark:border-gray-700">
            <div className="mb-1.5 flex items-center gap-2">
              <Pill label={opt.label} color={opt.color} />
              <button
                onClick={() => deleteOption(opt.id)}
                className="ml-auto text-gray-400 hover:text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <input
              value={opt.label}
              onChange={(e) => updateOption(opt.id, { label: e.target.value })}
              className="mb-1.5 w-full rounded border border-gray-200 px-2 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-700"
              placeholder="Label"
            />
            <div className="flex flex-wrap gap-1">
              {OPTION_COLORS.map(({ value: color, bg }) => (
                <button
                  key={color}
                  onClick={() => updateOption(opt.id, { color })}
                  className={`h-4 w-4 rounded ${bg} ${
                    opt.color === color ? 'ring-1 ring-offset-1 ring-gray-500' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-2 dark:border-gray-700">
        <button
          onClick={addOption}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Plus size={14} />
          Add option
        </button>
      </div>
    </div>
  );
}
