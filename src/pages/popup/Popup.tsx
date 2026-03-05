import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { TableRoot } from '@/components/table/TableRoot';
import { TableToolbar } from '@/components/toolbar/TableToolbar';
import { useSettings } from '@/hooks/useSettings';

export function Popup() {
  const loadAllTables = useStore((s) => s.loadAllTables);
  const [loaded, setLoaded] = useState(false);
  useSettings();

  useEffect(() => {
    loadAllTables().then(() => setLoaded(true));
  }, [loadAllTables]);

  return (
    <div className="flex h-[600px] w-[800px] flex-col bg-white dark:bg-gray-900">
      <TableToolbar />
      <div className="flex-1 overflow-auto px-2 pb-2">
        {!loaded ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-pulse text-sm text-gray-400">Loading...</div>
          </div>
        ) : (
          <TableRoot />
        )}
      </div>
    </div>
  );
}
