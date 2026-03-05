import type { StateCreator } from 'zustand';
import type { Todo } from '@/types/table';
import * as queries from '@/db/queries';

export interface TodoSlice {
  todos: Todo[];
  loadTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  updateTodoText: (id: string, text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearDoneTodos: () => Promise<void>;
}

export const createTodoSlice: StateCreator<TodoSlice, [], [], TodoSlice> = (set, get) => ({
  todos: [],

  loadTodos: async () => {
    const todos = await queries.loadTodos();
    set({ todos });
  },

  addTodo: async (text) => {
    if (!text.trim()) return;
    const todo = await queries.addTodo(text.trim());
    set((s) => ({ todos: [...s.todos, todo] }));
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;
    await queries.toggleTodo(id, !todo.done);
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  },

  updateTodoText: async (id, text) => {
    if (!text.trim()) return;
    await queries.updateTodoText(id, text.trim());
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, text: text.trim() } : t)),
    }));
  },

  deleteTodo: async (id) => {
    await queries.deleteTodo(id);
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
  },

  clearDoneTodos: async () => {
    await queries.clearDoneTodos();
    set((s) => ({ todos: s.todos.filter((t) => !t.done) }));
  },
});
