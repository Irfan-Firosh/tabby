import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useStore } from '@/store';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { AddRowButton } from './AddRowButton';

export function TableRoot() {
  const reorderRows = useStore((s) => s.reorderRows);
  const reorderColumns = useStore((s) => s.reorderColumns);
  const setDraggedRow = useStore((s) => s.setDraggedRow);
  const setDraggedColumn = useStore((s) => s.setDraggedColumn);
  const draggedRowId = useStore((s) => s.draggedRowId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'row') {
      setDraggedRow(active.id as string);
    } else if (active.data.current?.type === 'column') {
      setDraggedColumn(active.id as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedRow(null);
    setDraggedColumn(null);

    if (!over || active.id === over.id) return;

    if (active.data.current?.type === 'row') {
      reorderRows(active.id as string, over.id as string);
    } else if (active.data.current?.type === 'column') {
      reorderColumns(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse table-fixed">
          <TableHeader />
          <TableBody />
          <tfoot>
            <AddRowButton />
          </tfoot>
        </table>
      </div>

      <DragOverlay>
        {draggedRowId && (
          <div className="rounded bg-white/90 shadow-lg border border-accent/30 px-4 py-2 text-sm text-gray-600 dark:bg-gray-800/90 dark:text-gray-300">
            Moving row...
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
