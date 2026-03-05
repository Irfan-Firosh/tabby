import { Plus } from 'lucide-react';
import { useStore } from '@/store';

export function AddRowButton() {
  const addRow = useStore((s) => s.addRow);
  const columns = useStore((s) => s.columns);

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td colSpan={columns.length + 2}>
        <button
          onClick={addRow}
          className="flex w-full items-center gap-1.5 px-4 py-1.5 text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800/50 dark:hover:text-gray-300 transition-colors"
        >
          <Plus size={14} />
          New row
        </button>
      </td>
    </tr>
  );
}
