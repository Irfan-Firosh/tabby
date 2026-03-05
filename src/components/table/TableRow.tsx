import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { useStore } from '@/store';
import type { Column, Row } from '@/types/table';
import { TableCell } from './TableCell';

interface TableRowProps {
  row: Row;
  columns: Column[];
}

export function TableRow({ row, columns }: TableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.id, data: { type: 'row' } });

  const deleteRow = useStore((s) => s.deleteRow);
  const duplicateRow = useStore((s) => s.duplicateRow);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="group relative border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
    >
      {/* Drag handle + row actions */}
      <td className="w-8 border-r border-gray-200 dark:border-gray-700">
        <div className="flex h-[var(--row-height)] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5"
          >
            <GripVertical size={14} />
          </button>
        </div>
      </td>

      {columns.map((col) => (
        <TableCell key={col.id} rowId={row.id} column={col} />
      ))}

      {/* Row actions */}
      <td className="w-16 border-l border-gray-200 dark:border-gray-700">
        <div className="flex h-[var(--row-height)] items-center gap-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => duplicateRow(row.id)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            title="Duplicate row"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={() => deleteRow(row.id)}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            title="Delete row"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
}
