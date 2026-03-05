import { useEffect, useRef, useState } from 'react';
import type { CellProps } from '@/types/table';
import { ExternalLink } from 'lucide-react';

export function UrlCell({ value, isEditing, onStartEdit, onCommit, onCancel }: CellProps) {
  const [draft, setDraft] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(String(value ?? ''));
      inputRef.current?.focus();
    }
  }, [isEditing, value]);

  if (!isEditing) {
    const url = String(value ?? '');
    return (
      <div
        className="flex h-full w-full items-center gap-1 px-2 py-1.5"
        onClick={onStartEdit}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onStartEdit()}
      >
        {url ? (
          <>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="truncate text-sm text-blue-500 hover:underline dark:text-blue-400"
            >
              {url}
            </a>
            <ExternalLink size={12} className="shrink-0 text-blue-400" />
          </>
        ) : (
          <span className="cursor-text text-sm text-gray-400">URL</span>
        )}
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      type="url"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onCommit(draft)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit(draft);
        if (e.key === 'Escape') onCancel();
      }}
      className="h-full w-full bg-transparent px-2 py-1.5 text-sm text-blue-500 outline-none"
      placeholder="https://"
    />
  );
}
