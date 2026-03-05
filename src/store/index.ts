import { create } from 'zustand';
import { createTableSlice, type TableSlice } from './tableSlice';
import { createUiSlice, type UiSlice } from './uiSlice';
import { createSettingsSlice, type SettingsSlice } from './settingsSlice';
import { createTodoSlice, type TodoSlice } from './todoSlice';

export type AppStore = TableSlice & UiSlice & SettingsSlice & TodoSlice;

export const useStore = create<AppStore>()((...args) => ({
  ...createTableSlice(...args),
  ...createUiSlice(...args),
  ...createSettingsSlice(...args),
  ...createTodoSlice(...args),
}));
