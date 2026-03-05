import { Check } from 'lucide-react';
import type { CellProps } from '@/types/table';

export function CheckboxCell({ value, onCommit }: CellProps) {
  const checked = Boolean(value);

  return (
    <div className="flex h-full w-full items-center px-2">
      <button
        onClick={() => onCommit(!checked)}
        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
          checked
            ? 'border-accent bg-accent text-white'
            : 'border-gray-300 hover:border-accent dark:border-gray-600'
        }`}
      >
        {checked && <Check size={10} strokeWidth={3} />}
      </button>
    </div>
  );
}
