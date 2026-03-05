import Dexie, { Table } from 'dexie';
import type { Cell, Column, Row, Table as TableModel, Todo } from '@/types/table';

export class TabbyDB extends Dexie {
  tablesStore!: Table<TableModel, string>;
  columns!: Table<Column, string>;
  rows!: Table<Row, string>;
  cells!: Table<Cell, string>;
  todos!: Table<Todo, string>;

  constructor() {
    super('AuraTables'); // keep original name — renaming would wipe existing user data

    this.version(1).stores({
      tablesStore: 'id, name, createdAt',
      columns: 'id, tableId, order',
      rows: 'id, tableId, order, createdAt',
      cells: 'id, rowId, columnId, tableId',
    });

    this.version(2).stores({
      tablesStore: 'id, name, createdAt',
      columns: 'id, tableId, order',
      rows: 'id, tableId, order, createdAt',
      cells: 'id, rowId, columnId, tableId',
      todos: 'id, done, order, createdAt',
    });
  }
}

export const db = new TabbyDB();
