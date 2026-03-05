export type ColumnType =
  | 'text'
  | 'select'
  | 'multi_select'
  | 'checkbox'
  | 'date'
  | 'url'
  | 'email';

export interface SelectOption {
  id: string;
  label: string;
  color: string;
}

export interface Column {
  id: string;
  tableId: string;
  name: string;
  type: ColumnType;
  order: number;
  options?: SelectOption[];
  width?: number;
}

export interface Row {
  id: string;
  tableId: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Cell {
  id: string; // `${rowId}_${columnId}` deterministic composite key
  rowId: string;
  columnId: string;
  tableId: string;
  value: CellValue;
}

export type CellValue = string | boolean | string[] | null;

export interface Table {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  order: number;
  createdAt: number;
}

export interface CellProps {
  rowId: string;
  columnId: string;
  value: CellValue;
  isEditing: boolean;
  column: Column;
  onStartEdit: () => void;
  onCommit: (v: CellValue) => void;
  onCancel: () => void;
}
