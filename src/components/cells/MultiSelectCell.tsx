import { useEffect, useRef, useState } from 'react';
import type { CellProps } from '@/types/table';
import { Pill } from '@/components/ui/Pill';
import { ChevronDown } from 'lucide-react';

export function MultiSelectCell({ value, isEditing, column, onStartEdit, onCommit, onCancel }: CellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = column.options ?? [];
  const selected = Array.isArray(value) ? (value as string[]) : [];

  useEffect(() => {
    if (isEditing) setOpen(true);
  }, [isEditing]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        onCancel();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, onCancel]);

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onCommit(next);
  };

  const remove = (id: string) => onCommit(selected.filter((s) => s !== id));

  return (
    <div ref={ref} className="relative h-full w-full">
      <div
        className="flex h-full w-full cursor-pointer flex-wrap items-center gap-0.5 px-2 py-0.5"
        onClick={() => { onStartEdit(); setOpen(true); }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { onStartEdit(); setOpen(true); }
          if (e.key === 'Escape') { setOpen(false); onCancel(); }
        }}
      >
        {selected.map((id) => {
          const opt = options.find((o) => o.id === id);
          return opt ? (
            <Pill
              key={id}
              label={opt.label}
              color={opt.color}
              onRemove={() => remove(id)}
            />
          ) : null;
        })}
        {selected.length === 0 && (
          <ChevronDown size={12} className="text-gray-400" />
        )}
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-0.5 min-w-[160px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="flex cursor-pointer items-center gap-2 px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={(e) => { e.stopPropagation(); toggle(opt.id); }}
            >
              <div
                className={`h-3.5 w-3.5 rounded border ${
                  selected.includes(opt.id)
                    ? 'border-accent bg-accent'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              <Pill label={opt.label} color={opt.color} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
