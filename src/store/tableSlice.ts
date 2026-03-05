import type { StateCreator } from 'zustand';
import type { Cell, CellValue, Column, Row, Table } from '@/types/table';
import { orderBetween } from '@/utils/id';
import * as queries from '@/db/queries';

export interface TableSlice {
  activeTableId: string | null;
  tables: Table[];
  columns: Column[];
  rows: Row[];
  cells: Map<string, Cell>;

  loadTable: (tableId: string) => Promise<void>;
  loadAllTables: () => Promise<void>;
  createTable: (name: string) => Promise<void>;
  updateTableName: (tableId: string, name: string) => Promise<void>;
  setCellValue: (rowId: string, columnId: string, value: CellValue) => Promise<void>;
  addRow: () => Promise<void>;
  deleteRow: (rowId: string) => Promise<void>;
  duplicateRow: (rowId: string) => Promise<void>;
  reorderRows: (activeId: string, overId: string) => Promise<void>;
  addColumn: (name: string, type: Column['type']) => Promise<void>;
  updateColumn: (columnId: string, updates: Partial<Column>) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  reorderColumns: (activeId: string, overId: string) => Promise<void>;
  deleteTable: (tableId: string) => Promise<void>;
  importCSV: (name: string, headers: string[], rows: string[][]) => Promise<void>;
}

export const createTableSlice: StateCreator<TableSlice, [], [], TableSlice> = (
  set,
  get
) => ({
  activeTableId: null,
  tables: [],
  columns: [],
  rows: [],
  cells: new Map(),

  loadAllTables: async () => {
    const tables = await queries.loadAllTables();
    set({ tables });
    // Auto-create a default table if none exist
    if (tables.length === 0) {
      const table = await queries.createTable('My Table');
      const col1 = await queries.addColumn(table.id, 'Name', 'text', 1000);
      const col2 = await queries.addColumn(table.id, 'Status', 'select', 2000);
      await queries.addRow(table.id, 1000);
      set({ tables: [table] });
      await get().loadTable(table.id);
    } else {
      await get().loadTable(tables[0].id);
    }
  },

  loadTable: async (tableId: string) => {
    const { table, columns, rows, cells } = await queries.loadTable(tableId);
    if (!table) return;

    const cellMap = new Map<string, Cell>();
    for (const cell of cells) {
      cellMap.set(cell.id, cell);
    }

    set({
      activeTableId: tableId,
      columns: columns.sort((a, b) => a.order - b.order),
      rows: rows.sort((a, b) => a.order - b.order),
      cells: cellMap,
    });
  },

  createTable: async (name: string) => {
    const table = await queries.createTable(name);
    set((s) => ({ tables: [...s.tables, table] }));
    await get().loadTable(table.id);
  },

  updateTableName: async (tableId: string, name: string) => {
    await queries.updateTableName(tableId, name);
    set((s) => ({
      tables: s.tables.map((t) => (t.id === tableId ? { ...t, name } : t)),
    }));
  },

  setCellValue: async (rowId: string, columnId: string, value: CellValue) => {
    const tableId = get().activeTableId;
    if (!tableId) return;
    const cell = await queries.upsertCell(rowId, columnId, tableId, value);
    set((s) => {
      const next = new Map(s.cells);
      next.set(cell.id, cell);
      return { cells: next };
    });
  },

  addRow: async () => {
    const { rows, activeTableId } = get();
    if (!activeTableId) return;
    const lastOrder = rows.length > 0 ? rows[rows.length - 1].order : 0;
    const order = orderBetween(lastOrder);
    const row = await queries.addRow(activeTableId, order);
    set((s) => ({ rows: [...s.rows, row] }));
  },

  deleteRow: async (rowId: string) => {
    const { activeTableId } = get();
    if (!activeTableId) return;
    await queries.deleteRow(rowId, activeTableId);
    set((s) => {
      const next = new Map(s.cells);
      for (const key of next.keys()) {
        if (key.startsWith(rowId + '_')) next.delete(key);
      }
      return { rows: s.rows.filter((r) => r.id !== rowId), cells: next };
    });
  },

  duplicateRow: async (rowId: string) => {
    const { rows, activeTableId } = get();
    if (!activeTableId) return;
    const idx = rows.findIndex((r) => r.id === rowId);
    const nextOrder = rows[idx + 1]?.order;
    const order = orderBetween(rows[idx].order, nextOrder);
    const newRow = await queries.duplicateRow(rowId, activeTableId, order);

    const { cells: allCells, columns } = get();
    const newCells = new Map<string, Cell>(allCells);
    for (const col of columns) {
      const srcKey = `${rowId}_${col.id}`;
      const src = allCells.get(srcKey);
      if (src) {
        const dstKey = `${newRow.id}_${col.id}`;
        newCells.set(dstKey, { ...src, id: dstKey, rowId: newRow.id });
      }
    }

    const newRows = [...rows];
    newRows.splice(idx + 1, 0, newRow);
    set({ rows: newRows, cells: newCells });
  },

  reorderRows: async (activeId: string, overId: string) => {
    const { rows, activeTableId } = get();
    if (!activeTableId || activeId === overId) return;

    const activeIdx = rows.findIndex((r) => r.id === activeId);
    const overIdx = rows.findIndex((r) => r.id === overId);
    if (activeIdx === -1 || overIdx === -1) return;

    const newRows = [...rows];
    newRows.splice(activeIdx, 1);
    newRows.splice(overIdx, 0, rows[activeIdx]);

    const prevOrder = newRows[overIdx - 1]?.order;
    const nextOrder = newRows[overIdx + 1]?.order;
    const newOrder = orderBetween(prevOrder, nextOrder);

    newRows[overIdx] = { ...newRows[overIdx], order: newOrder };
    set({ rows: newRows });
    await queries.reorderRows(activeId, newOrder, activeTableId);
  },

  addColumn: async (name: string, type: Column['type']) => {
    const { columns, activeTableId } = get();
    if (!activeTableId) return;
    const lastOrder = columns.length > 0 ? columns[columns.length - 1].order : 0;
    const order = orderBetween(lastOrder);
    const col = await queries.addColumn(activeTableId, name, type, order);
    set((s) => ({ columns: [...s.columns, col] }));
  },

  updateColumn: async (columnId: string, updates: Partial<Column>) => {
    await queries.updateColumn(columnId, updates);
    set((s) => ({
      columns: s.columns.map((c) => (c.id === columnId ? { ...c, ...updates } : c)),
    }));
  },

  deleteColumn: async (columnId: string) => {
    const { activeTableId } = get();
    if (!activeTableId) return;
    await queries.deleteColumn(columnId, activeTableId);
    set((s) => {
      const next = new Map(s.cells);
      for (const key of next.keys()) {
        if (key.endsWith('_' + columnId)) next.delete(key);
      }
      return { columns: s.columns.filter((c) => c.id !== columnId), cells: next };
    });
  },

  deleteTable: async (tableId: string) => {
    await queries.deleteTable(tableId);
    const remaining = get().tables.filter((t) => t.id !== tableId);
    set({ tables: remaining });
    if (get().activeTableId === tableId) {
      if (remaining.length > 0) {
        await get().loadTable(remaining[0].id);
      } else {
        // Re-create a default table when the last one is deleted
        await get().createTable('My Table');
      }
    }
  },

  importCSV: async (name: string, headers: string[], dataRows: string[][]) => {
    const { table, columns, rows, cells } = await queries.importTable(name, headers, dataRows);
    const cellMap = new Map<string, Cell>(cells.map((c) => [c.id, c]));
    set((s) => ({
      tables: [...s.tables, table],
      activeTableId: table.id,
      columns: columns.sort((a, b) => a.order - b.order),
      rows: rows.sort((a, b) => a.order - b.order),
      cells: cellMap,
    }));
  },

  reorderColumns: async (activeId: string, overId: string) => {
    const { columns } = get();
    if (activeId === overId) return;

    const activeIdx = columns.findIndex((c) => c.id === activeId);
    const overIdx = columns.findIndex((c) => c.id === overId);
    if (activeIdx === -1 || overIdx === -1) return;

    const newCols = [...columns];
    newCols.splice(activeIdx, 1);
    newCols.splice(overIdx, 0, columns[activeIdx]);

    const prevOrder = newCols[overIdx - 1]?.order;
    const nextOrder = newCols[overIdx + 1]?.order;
    const newOrder = orderBetween(prevOrder, nextOrder);

    newCols[overIdx] = { ...newCols[overIdx], order: newOrder };
    set({ columns: newCols });
    await queries.reorderColumns(activeId, newOrder);
  },
});
