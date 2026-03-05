import { getOptionColorClasses } from '@/utils/colors';
import { X } from 'lucide-react';

interface PillProps {
  label: string;
  color: string;
  onRemove?: () => void;
}

export function Pill({ label, color, onRemove }: PillProps) {
  const cls = getOptionColorClasses(color);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${cls.bg} ${cls.text}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="hover:opacity-70"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}
