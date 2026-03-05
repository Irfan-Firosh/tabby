import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CellProps } from '@/types/table';
import { useStore } from '@/store';
import { SlashCommandPalette } from '@/components/menus/SlashCommandPalette';

export function TextCell({ rowId, columnId, value, isEditing, onStartEdit, onCommit, onCancel }: CellProps) {
  const [draft, setDraft] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement>(null);
  const setSlashQuery = useStore((s) => s.setSlashQuery);
  const slashQuery = useStore((s) => s.slashQuery);

  useEffect(() => {
    if (isEditing) {
      setDraft(String(value ?? ''));
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing, value]);

  const closeSlash = () => setSlashQuery(null);

  if (!isEditing) {
    return (
      <div
        className="h-full w-full cursor-text overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1.5 text-sm"
        onClick={onStartEdit}
        onKeyDown={(e) => e.key === 'Enter' && onStartEdit()}
        tabIndex={0}
      >
        {value as string}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (e.target.value.startsWith('/') && e.target.value.length === 1) {
            setSlashQuery('');
          } else if (e.target.value.startsWith('/') && slashQuery !== null) {
            setSlashQuery(e.target.value.slice(1));
          } else {
            setSlashQuery(null);
          }
        }}
        onBlur={() => {
          setSlashQuery(null);
          onCommit(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setSlashQuery(null);
            onCommit(draft);
          }
          if (e.key === 'Escape') {
            setSlashQuery(null);
            onCancel();
          }
        }}
        className="h-full w-full bg-transparent px-2 py-1.5 text-sm outline-none"
      />

      {slashQuery !== null &&
        createPortal(
          <SlashCommandPalette
            rowId={rowId}
            columnId={columnId}
            anchorRef={inputRef as React.RefObject<HTMLElement | null>}
            onClose={() => {
              closeSlash();
              // Clear the slash prefix from the cell and commit empty
              setDraft('');
              onCommit('');
            }}
          />,
          document.body
        )}
    </div>
  );
}
