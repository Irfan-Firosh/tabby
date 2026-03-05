import { useEffect, useRef, useState } from 'react';
import type { CellProps } from '@/types/table';

export function EmailCell({ value, isEditing, onStartEdit, onCommit, onCancel }: CellProps) {
  const [draft, setDraft] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(String(value ?? ''));
      inputRef.current?.focus();
    }
  }, [isEditing, value]);

  if (!isEditing) {
    const email = String(value ?? '');
    return (
      <div
        className="h-full w-full cursor-pointer px-2 py-1.5"
        onClick={onStartEdit}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onStartEdit()}
      >
        {email ? (
          <a
            href={`mailto:${email}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-blue-500 hover:underline dark:text-blue-400"
          >
            {email}
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      type="email"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onCommit(draft)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit(draft);
        if (e.key === 'Escape') onCancel();
      }}
      className="h-full w-full bg-transparent px-2 py-1.5 text-sm outline-none"
      placeholder="email@example.com"
    />
  );
}
