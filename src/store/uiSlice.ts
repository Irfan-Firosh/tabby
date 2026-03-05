import type { StateCreator } from 'zustand';

export type OpenMenu =
  | { type: 'column'; columnId: string }
  | { type: 'row'; rowId: string }
  | { type: 'select-editor'; columnId: string }
  | { type: 'export' }
  | null;

export interface UiSlice {
  editingCell: { rowId: string; columnId: string } | null;
  openMenu: OpenMenu;
  draggedRowId: string | null;
  draggedColumnId: string | null;
  slashQuery: string | null;

  startEditing: (rowId: string, columnId: string) => void;
  stopEditing: () => void;
  setOpenMenu: (menu: OpenMenu) => void;
  closeMenu: () => void;
  setDraggedRow: (id: string | null) => void;
  setDraggedColumn: (id: string | null) => void;
  setSlashQuery: (query: string | null) => void;
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  editingCell: null,
  openMenu: null,
  draggedRowId: null,
  draggedColumnId: null,
  slashQuery: null,

  startEditing: (rowId, columnId) =>
    set({ editingCell: { rowId, columnId } }),

  stopEditing: () =>
    set({ editingCell: null, slashQuery: null }),

  setOpenMenu: (menu) => set({ openMenu: menu }),
  closeMenu: () => set({ openMenu: null }),
  setDraggedRow: (id) => set({ draggedRowId: id }),
  setDraggedColumn: (id) => set({ draggedColumnId: id }),
  setSlashQuery: (query) => set({ slashQuery: query }),
});
