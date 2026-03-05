import { useStore } from '@/store';
import type { Column } from '@/types/table';
import { TextCell } from '@/components/cells/TextCell';
import { CheckboxCell } from '@/components/cells/CheckboxCell';
import { DateCell } from '@/components/cells/DateCell';
import { UrlCell } from '@/components/cells/UrlCell';
import { SelectCell } from '@/components/cells/SelectCell';
import { MultiSelectCell } from '@/components/cells/MultiSelectCell';
import { EmailCell } from '@/components/cells/EmailCell';
import type { CellProps } from '@/types/table';

interface TableCellWrapperProps {
  rowId: string;
  column: Column;
}

export function TableCell({ rowId, column }: TableCellWrapperProps) {
  const cellKey = `${rowId}_${column.id}`;
  const cell = useStore((s) => s.cells.get(cellKey));
  const editingCell = useStore((s) => s.editingCell);
  const startEditing = useStore((s) => s.startEditing);
  const stopEditing = useStore((s) => s.stopEditing);
  const setCellValue = useStore((s) => s.setCellValue);

  const isEditing =
    editingCell?.rowId === rowId && editingCell?.columnId === column.id;

  const props: CellProps = {
    rowId,
    columnId: column.id,
    value: cell?.value ?? null,
    isEditing,
    column,
    onStartEdit: () => startEditing(rowId, column.id),
    onCommit: (v) => {
      setCellValue(rowId, column.id, v);
      stopEditing();
    },
    onCancel: () => stopEditing(),
  };

  const CellComponent = {
    text: TextCell,
    select: SelectCell,
    multi_select: MultiSelectCell,
    checkbox: CheckboxCell,
    date: DateCell,
    url: UrlCell,
    email: EmailCell,
  }[column.type] ?? TextCell;

  return (
    <td
      className="relative border-r border-gray-200 dark:border-gray-700 last:border-r-0"
      style={{ width: column.width ?? 160, minWidth: 80 }}
    >
      <div
        className={`h-[var(--row-height)] overflow-hidden transition-colors ${
          isEditing
            ? 'ring-2 ring-accent ring-inset'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <CellComponent {...props} />
      </div>
    </td>
  );
}
