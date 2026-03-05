import { useEffect, useRef, useState } from 'react';
import { Download, Copy, Mail, MessageSquare } from 'lucide-react';
import { useStore } from '@/store';
import { exportToCSV, exportToMarkdown, downloadCSV } from '@/utils/export';

interface SharePanelProps {
  onClose: () => void;
}

export function SharePanel({ onClose }: SharePanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const activeTableId = useStore((s) => s.activeTableId);
  const tables = useStore((s) => s.tables);
  const columns = useStore((s) => s.columns);
  const rows = useStore((s) => s.rows);
  const cells = useStore((s) => s.cells);
  const [copied, setCopied] = useState<string | null>(null);

  const table = tables.find((t) => t.id === activeTableId);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const flashCopied = (key: string) => {
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDownload = () => {
    if (!table) return;
    downloadCSV(table.name, columns, rows, cells);
    onClose();
  };

  const handleCopyCSV = async () => {
    const csv = exportToCSV(columns, rows, cells);
    await navigator.clipboard.writeText(csv);
    flashCopied('csv');
  };

  const handleEmail = () => {
    if (!table) return;
    const csv = exportToCSV(columns, rows, cells);
    const subject = encodeURIComponent(table.name);
    const body = encodeURIComponent(csv);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    onClose();
  };

  const handleDiscord = async () => {
    const md = exportToMarkdown(columns, rows, cells);
    await navigator.clipboard.writeText(md);
    flashCopied('discord');
  };

  if (!table) return null;

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-1 w-48 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-700">
        <p className="truncate text-xs font-semibold text-gray-700 dark:text-gray-200" title={table.name}>
          {table.name}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Share table</p>
      </div>

      <div className="p-1">
        <button
          onClick={handleDownload}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Download size={13} />
          Download .csv
        </button>

        <button
          onClick={handleCopyCSV}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Copy size={13} />
          {copied === 'csv' ? 'Copied!' : 'Copy as CSV'}
        </button>

        <button
          onClick={handleEmail}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Mail size={13} />
          Share via Email
        </button>

        <button
          onClick={handleDiscord}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <MessageSquare size={13} />
          {copied === 'discord' ? 'Copied!' : 'Copy for Discord'}
        </button>
      </div>
    </div>
  );
}
