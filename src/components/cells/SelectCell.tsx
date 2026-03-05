import { useEffect, useRef, useState } from 'react';
import type { CellProps } from '@/types/table';
import { Pill } from '@/components/ui/Pill';
import { ChevronDown } from 'lucide-react';

export function SelectCell({ value, isEditing, column, onStartEdit, onCommit, onCancel }: CellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = column.options ?? [];
  const selected = options.find((o) => o.id === value);

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

  return (
    <div ref={ref} className="relative h-full w-full">
      <div
        className="flex h-full w-full cursor-pointer items-center justify-between px-2 py-1"
        onClick={() => { onStartEdit(); setOpen(true); }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { onStartEdit(); setOpen(true); }
          if (e.key === 'Escape') { setOpen(false); onCancel(); }
        }}
      >
        {selected ? (
          <Pill label={selected.label} color={selected.color} />
        ) : (
          <span className="text-xs text-gray-400" />
        )}
        <ChevronDown size={12} className="shrink-0 text-gray-400" />
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-0.5 min-w-[140px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div
            className="px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => { onCommit(null); setOpen(false); }}
          >
            Clear
          </div>
          {options.map((opt) => (
            <div
              key={opt.id}
              className="flex cursor-pointer items-center gap-2 px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => { onCommit(opt.id); setOpen(false); }}
            >
              <Pill label={opt.label} color={opt.color} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
