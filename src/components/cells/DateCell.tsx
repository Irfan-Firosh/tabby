import { useEffect, useRef, useState } from 'react';
import type { CellProps } from '@/types/table';

export function DateCell({ value, isEditing, onStartEdit, onCommit, onCancel }: CellProps) {
  const [draft, setDraft] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(String(value ?? ''));
      inputRef.current?.focus();
    }
  }, [isEditing, value]);

  const displayValue = value ? new Date(String(value)).toLocaleDateString() : '';

  if (!isEditing) {
    return (
      <div
        className="h-full w-full cursor-pointer px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400"
        onClick={onStartEdit}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onStartEdit()}
      >
        {displayValue}
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      type="date"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onCommit(draft)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit(draft);
        if (e.key === 'Escape') onCancel();
      }}
      className="h-full w-full bg-transparent px-2 py-1.5 text-sm outline-none"
    />
  );
}
