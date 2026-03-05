import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '@/store';
import { ColumnHeader } from './ColumnHeader';

export function TableHeader() {
  const columns = useStore((s) => s.columns);

  return (
    <thead>
      <tr className="border-b border-gray-200 dark:border-gray-700">
        {/* Drag handle column */}
        <th className="w-8 border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/80" />

        <SortableContext
          items={columns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((col) => (
            <ColumnHeader key={col.id} column={col} />
          ))}
        </SortableContext>

        {/* Actions column */}
        <th className="w-16 border-l border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/80" />
      </tr>
    </thead>
  );
}
