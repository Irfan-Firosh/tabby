import { db } from './schema';
import type { Cell, CellValue, Column, Row, Table, Todo } from '@/types/table';
import { generateId } from '@/utils/id';

// ── Todos ──────────────────────────────────────────────────────────────────

export async function loadTodos(): Promise<Todo[]> {
  return db.todos.orderBy('order').toArray();
}

export async function addTodo(text: string): Promise<Todo> {
  const count = await db.todos.count();
  const todo: Todo = {
    id: generateId(),
    text,
    done: false,
    order: count,
    createdAt: Date.now(),
  };
  await db.todos.add(todo);
  return todo;
}

export async function toggleTodo(id: string, done: boolean): Promise<void> {
  await db.todos.update(id, { done });
}

export async function updateTodoText(id: string, text: string): Promise<void> {
  await db.todos.update(id, { text });
}

export async function deleteTodo(id: string): Promise<void> {
  await db.todos.delete(id);
}

export async function clearDoneTodos(): Promise<void> {
  await db.todos.filter((t) => t.done).delete();
}

export async function loadTable(tableId: string) {
  const [table, columns, rows, cells] = await Promise.all([
    db.tablesStore.get(tableId),
    db.columns.where('tableId').equals(tableId).toArray(),
    db.rows.where('tableId').equals(tableId).toArray(),
    db.cells.where('tableId').equals(tableId).toArray(),
  ]);

  return { table, columns, rows, cells };
}

export async function loadAllTables() {
  return db.tablesStore.orderBy('createdAt').toArray();
}

export async function createTable(name: string): Promise<Table> {
  const now = Date.now();
  const table: Table = {
    id: generateId(),
    name,
    createdAt: now,
    updatedAt: now,
  };
  await db.tablesStore.add(table);
  return table;
}

export async function updateTableName(tableId: string, name: string) {
  await db.tablesStore.update(tableId, { name, updatedAt: Date.now() });
}

export async function upsertCell(
  rowId: string,
  columnId: string,
  tableId: string,
  value: CellValue
) {
  const id = `${rowId}_${columnId}`;
  const cell: Cell = { id, rowId, columnId, tableId, value };
  await db.cells.put(cell);
  return cell;
}

export async function reorderRows(
  rowId: string,
  newOrder: number,
  tableId: string
) {
  const now = Date.now();
  await db.rows.update(rowId, { order: newOrder, updatedAt: now });
  await db.tablesStore.update(tableId, { updatedAt: now });
}

export async function reorderColumns(columnId: string, newOrder: number) {
  await db.columns.update(columnId, { order: newOrder });
}

export async function addRow(tableId: string, order: number): Promise<Row> {
  const now = Date.now();
  const row: Row = {
    id: generateId(),
    tableId,
    order,
    createdAt: now,
    updatedAt: now,
  };
  await db.rows.add(row);
  return row;
}

export async function deleteRow(rowId: string, tableId: string) {
  await db.transaction('rw', [db.rows, db.cells], async () => {
    await db.rows.delete(rowId);
    await db.cells.where('rowId').equals(rowId).delete();
  });
  await db.tablesStore.update(tableId, { updatedAt: Date.now() });
}

export async function duplicateRow(rowId: string, tableId: string, order: number): Promise<Row> {
  const now = Date.now();
  const newRowId = generateId();
  const newRow: Row = {
    id: newRowId,
    tableId,
    order,
    createdAt: now,
    updatedAt: now,
  };

  const cells = await db.cells.where('rowId').equals(rowId).toArray();
  const newCells: Cell[] = cells.map((c) => ({
    ...c,
    id: `${newRowId}_${c.columnId}`,
    rowId: newRowId,
  }));

  await db.transaction('rw', [db.rows, db.cells], async () => {
    await db.rows.add(newRow);
    await db.cells.bulkPut(newCells);
  });

  return newRow;
}

export async function addColumn(
  tableId: string,
  name: string,
  type: Column['type'],
  order: number
): Promise<Column> {
  const column: Column = {
    id: generateId(),
    tableId,
    name,
    type,
    order,
    width: 160,
  };
  await db.columns.add(column);
  return column;
}

export async function updateColumn(columnId: string, updates: Partial<Column>) {
  await db.columns.update(columnId, updates);
}

export async function deleteTable(tableId: string) {
  await db.transaction('rw', [db.tablesStore, db.columns, db.rows, db.cells], async () => {
    await db.tablesStore.delete(tableId);
    await db.columns.where('tableId').equals(tableId).delete();
    await db.rows.where('tableId').equals(tableId).delete();
    await db.cells.where('tableId').equals(tableId).delete();
  });
}

export async function deleteColumn(columnId: string, tableId: string) {
  await db.transaction('rw', [db.columns, db.cells], async () => {
    await db.columns.delete(columnId);
    await db.cells.where('columnId').equals(columnId).delete();
  });
  await db.tablesStore.update(tableId, { updatedAt: Date.now() });
}

export async function importTable(
  name: string,
  headers: string[],
  dataRows: string[][]
): Promise<{ table: Table; columns: Column[]; rows: Row[]; cells: Cell[] }> {
  const now = Date.now();
  const tableId = generateId();
  const table: Table = { id: tableId, name, createdAt: now, updatedAt: now };

  const cols: Column[] = headers.map((h, i) => ({
    id: generateId(),
    tableId,
    name: h || `Column ${i + 1}`,
    type: 'text' as Column['type'],
    order: (i + 1) * 1000,
    width: 160,
  }));

  const rows: Row[] = dataRows.map((_, i) => ({
    id: generateId(),
    tableId,
    order: (i + 1) * 1000,
    createdAt: now,
    updatedAt: now,
  }));

  const cells: Cell[] = [];
  for (let ri = 0; ri < dataRows.length; ri++) {
    for (let ci = 0; ci < cols.length; ci++) {
      const val = dataRows[ri][ci] ?? '';
      if (val !== '') {
        const cellId = `${rows[ri].id}_${cols[ci].id}`;
        cells.push({ id: cellId, rowId: rows[ri].id, columnId: cols[ci].id, tableId, value: val });
      }
    }
  }

  await db.transaction('rw', [db.tablesStore, db.columns, db.rows, db.cells], async () => {
    await db.tablesStore.add(table);
    await db.columns.bulkAdd(cols);
    await db.rows.bulkAdd(rows);
    if (cells.length > 0) await db.cells.bulkAdd(cells);
  });

  return { table, columns: cols, rows, cells };
}
