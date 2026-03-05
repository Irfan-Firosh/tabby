import type { Cell, Column, Row } from '@/types/table';

export function downloadCSV(name: string, columns: Column[], rows: Row[], cells: Map<string, Cell>) {
  const csv = exportToCSV(columns, rows, cells);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function getCellDisplay(cell: Cell | undefined, column: Column): string {
  if (!cell || cell.value === null || cell.value === undefined) return '';
  if (column.type === 'checkbox') return cell.value ? '✓' : '';
  if (Array.isArray(cell.value)) {
    // Resolve option IDs to their labels for select/multi_select columns
    const options = column.options ?? [];
    return cell.value
      .map((id) => options.find((o) => o.id === id)?.label ?? id)
      .join(', ');
  }
  if ((column.type === 'select') && typeof cell.value === 'string') {
    const options = column.options ?? [];
    return options.find((o) => o.id === cell.value)?.label ?? (cell.value as string);
  }
  return String(cell.value);
}

export function exportToCSV(
  columns: Column[],
  rows: Row[],
  cellMap: Map<string, Cell>
): string {
  const sortedCols = [...columns].sort((a, b) => a.order - b.order);
  const sortedRows = [...rows].sort((a, b) => a.order - b.order);

  const escape = (v: string) =>
    v.includes(',') || v.includes('"') || v.includes('\n')
      ? `"${v.replace(/"/g, '""')}"`
      : v;

  const header = sortedCols.map((c) => escape(c.name)).join(',');
  const body = sortedRows.map((row) =>
    sortedCols
      .map((col) => {
        const cell = cellMap.get(`${row.id}_${col.id}`);
        return escape(getCellDisplay(cell, col));
      })
      .join(',')
  );

  return [header, ...body].join('\n');
}

export function exportToMarkdown(
  columns: Column[],
  rows: Row[],
  cellMap: Map<string, Cell>
): string {
  const sortedCols = [...columns].sort((a, b) => a.order - b.order);
  const sortedRows = [...rows].sort((a, b) => a.order - b.order);

  const header = `| ${sortedCols.map((c) => c.name).join(' | ')} |`;
  const divider = `| ${sortedCols.map(() => '---').join(' | ')} |`;
  const body = sortedRows.map((row) => {
    const cells = sortedCols.map((col) => {
      const cell = cellMap.get(`${row.id}_${col.id}`);
      return getCellDisplay(cell, col).replace(/\|/g, '\\|');
    });
    return `| ${cells.join(' | ')} |`;
  });

  return [header, divider, ...body].join('\n');
}
