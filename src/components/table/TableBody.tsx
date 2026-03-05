import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '@/store';
import { TableRow } from './TableRow';

export function TableBody() {
  const rows = useStore((s) => s.rows);
  const columns = useStore((s) => s.columns);

  return (
    <tbody>
      <SortableContext
        items={rows.map((r) => r.id)}
        strategy={verticalListSortingStrategy}
      >
        {rows.map((row) => (
          <TableRow key={row.id} row={row} columns={columns} />
        ))}
      </SortableContext>
    </tbody>
  );
}
