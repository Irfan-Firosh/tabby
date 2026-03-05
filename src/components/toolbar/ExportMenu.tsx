import { useRef, useEffect } from 'react';
import { FileText, Table } from 'lucide-react';
import { useStore } from '@/store';
import { exportToCSV, exportToMarkdown } from '@/utils/export';

interface ExportMenuProps {
  onClose: () => void;
}

export function ExportMenu({ onClose }: ExportMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const columns = useStore((s) => s.columns);
  const rows = useStore((s) => s.rows);
  const cells = useStore((s) => s.cells);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    onClose();
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        onClick={() => copy(exportToMarkdown(columns, rows, cells))}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <FileText size={14} />
        Copy as Markdown
      </button>
      <button
        onClick={() => copy(exportToCSV(columns, rows, cells))}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <Table size={14} />
        Copy as CSV
      </button>
    </div>
  );
}
