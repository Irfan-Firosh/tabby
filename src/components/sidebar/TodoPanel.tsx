import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { useStore } from '@/store';

export function TodoPanel() {
  const todos = useStore((s) => s.todos);
  const loadTodos = useStore((s) => s.loadTodos);
  const addTodo = useStore((s) => s.addTodo);
  const toggleTodo = useStore((s) => s.toggleTodo);
  const updateTodoText = useStore((s) => s.updateTodoText);
  const deleteTodo = useStore((s) => s.deleteTodo);
  const clearDoneTodos = useStore((s) => s.clearDoneTodos);

  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    if (editingId) editRef.current?.focus();
  }, [editingId]);

  const pending = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input);
    setInput('');
    inputRef.current?.focus();
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const commitEdit = () => {
    if (editingId) {
      updateTodoText(editingId, editText);
      setEditingId(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Add input */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-2 py-2 dark:border-gray-700">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a task..."
          className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-600"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:text-accent disabled:opacity-30"
          title="Add task"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {todos.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <Sparkles size={20} className="text-gray-300 dark:text-gray-600" />
            <p className="text-xs text-gray-400 dark:text-gray-600">
              All clear! Add something to do.
            </p>
          </div>
        )}

        {/* Pending */}
        {pending.map((todo) => (
          <div
            key={todo.id}
            className="group flex items-start gap-1.5 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className="mt-0.5 shrink-0 text-gray-400 transition-colors hover:text-accent"
              title="Mark done"
            >
              <Circle size={13} />
            </button>

            {editingId === todo.id ? (
              <input
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit();
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="flex-1 bg-transparent text-xs text-gray-700 outline-none dark:text-gray-200"
              />
            ) : (
              <span
                className="flex-1 cursor-text text-xs text-gray-700 dark:text-gray-200"
                onDoubleClick={() => startEdit(todo.id, todo.text)}
                title="Double-click to edit"
              >
                {todo.text}
              </span>
            )}

            <button
              onClick={() => deleteTodo(todo.id)}
              className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:text-red-500"
              title="Delete"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}

        {/* Done */}
        {done.length > 0 && (
          <>
            <div className="flex items-center justify-between px-2 py-1 mt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                Done · {done.length}
              </p>
              <button
                onClick={clearDoneTodos}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors dark:text-gray-600"
                title="Clear completed"
              >
                Clear
              </button>
            </div>
            {done.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-start gap-1.5 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="mt-0.5 shrink-0 text-accent transition-colors hover:text-gray-400"
                  title="Mark undone"
                >
                  <CheckCircle2 size={13} />
                </button>
                <span className="flex-1 text-xs text-gray-400 line-through dark:text-gray-600">
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
