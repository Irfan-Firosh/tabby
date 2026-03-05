import { useEffect, useState } from 'react';
import { Table2, CheckSquare } from 'lucide-react';
import { useStore } from '@/store';
import { TableRoot } from '@/components/table/TableRoot';
import { TableToolbar } from '@/components/toolbar/TableToolbar';
import { TableList } from '@/components/sidebar/TableList';
import { TodoPanel } from '@/components/sidebar/TodoPanel';
import { useSettings } from '@/hooks/useSettings';

type SidebarTab = 'tables' | 'todos';

export function SidePanel() {
  const loadAllTables = useStore((s) => s.loadAllTables);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState<SidebarTab>('tables');
  useSettings();

  useEffect(() => {
    loadAllTables();
  }, [loadAllTables]);

  return (
    <div className="flex h-screen w-full flex-col bg-white dark:bg-gray-900">
      <TableToolbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="flex h-full w-40 shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            {/* Tab bar */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setTab('tables')}
                className={`flex flex-1 items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
                  tab === 'tables'
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                title="Spreadsheets"
              >
                <Table2 size={12} />
                Tables
              </button>
              <button
                onClick={() => setTab('todos')}
                className={`flex flex-1 items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
                  tab === 'todos'
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                title="To-Do list"
              >
                <CheckSquare size={12} />
                To-Do
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {tab === 'tables' ? <TableList /> : <TodoPanel />}
            </div>
          </div>
        )}
        <div className="flex-1 overflow-auto px-2 pb-2 pt-1">
          <TableRoot />
        </div>
      </div>
    </div>
  );
}
