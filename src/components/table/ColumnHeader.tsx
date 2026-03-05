import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Type, CheckSquare, Calendar, Link, AtSign, List, Layers } from 'lucide-react';
import type { Column } from '@/types/table';
import { useStore } from '@/store';
import { ColumnMenu } from '@/components/menus/ColumnMenu';
import { SelectOptionEditor } from '@/components/menus/SelectOptionEditor';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  text: <Type size={12} />,
  select: <List size={12} />,
  multi_select: <Layers size={12} />,
  checkbox: <CheckSquare size={12} />,
  date: <Calendar size={12} />,
  url: <Link size={12} />,
  email: <AtSign size={12} />,
};

interface ColumnHeaderProps {
  column: Column;
}

export function ColumnHeader({ column }: ColumnHeaderProps) {
  const thRef = useRef<HTMLTableCellElement | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: column.id, data: { type: 'column' } });

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const openMenu = useStore((s) => s.openMenu);
  const closeMenu = useStore((s) => s.closeMenu);
  const [resizing, setResizing] = useState(false);
  const updateColumn = useStore((s) => s.updateColumn);
  const startXRef = useRef(0);
  const startWidthRef = useRef(column.width ?? 160);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: column.width ?? 160,
    minWidth: 80,
  };

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (thRef.current) {
      const rect = thRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 2, left: rect.left });
    }
    setMenuOpen((v) => !v);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startXRef.current = e.clientX;
    startWidthRef.current = column.width ?? 160;
    setResizing(true);

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startXRef.current;
      const newWidth = Math.max(80, startWidthRef.current + delta);
      updateColumn(column.id, { width: newWidth });
    };
    const onUp = () => {
      setResizing(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const isSelectEditor =
    openMenu?.type === 'select-editor' && openMenu.columnId === column.id;

  // Recompute position whenever SelectOptionEditor opens (may not have gone through handleOpenMenu)
  useEffect(() => {
    if (isSelectEditor && thRef.current) {
      const rect = thRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 2, left: rect.left });
    }
  }, [isSelectEditor]);

  return (
    <th
      ref={useCallback((node: HTMLTableCellElement | null) => { thRef.current = node; setNodeRef(node); }, [setNodeRef])}
      style={style}
      className="group relative border-r border-gray-200 bg-gray-50 p-0 text-left hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-700/60 last:border-r-0"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-pointer items-center gap-1.5 px-2 py-1.5 select-none"
      >
        <span className="text-gray-400">{TYPE_ICONS[column.type]}</span>
        <span className="flex-1 truncate text-xs font-medium text-gray-700 dark:text-gray-200">
          {column.name}
        </span>
        <button
          onClick={handleOpenMenu}
          className="shrink-0 rounded p-0.5 opacity-30 transition-opacity hover:opacity-100 group-hover:opacity-60"
          title="Column options"
        >
          <MoreHorizontal size={12} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {menuOpen && createPortal(
        <div style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}>
          <ColumnMenu column={column} onClose={() => setMenuOpen(false)} />
        </div>,
        document.body
      )}

      {isSelectEditor && createPortal(
        <div style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}>
          <SelectOptionEditor columnId={column.id} onClose={closeMenu} />
        </div>,
        document.body
      )}

      {/* Resize handle */}
      <div
        className={`absolute right-0 top-0 h-full w-2 cursor-col-resize transition-colors hover:bg-accent/60 ${resizing ? 'bg-accent/60' : ''}`}
        onMouseDown={handleResizeStart}
      />
    </th>
  );
}
