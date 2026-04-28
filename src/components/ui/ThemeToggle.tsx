import { Moon, Monitor, Sun } from 'lucide-react';
import { useStore, type Theme } from '../../store/useStore';

const OPTIONS: { id: Theme; Icon: typeof Moon; label: string }[] = [
  { id: 'dark',   Icon: Moon,    label: 'Dark' },
  { id: 'system', Icon: Monitor, label: 'System' },
  { id: 'light',  Icon: Sun,     label: 'Light' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useStore();

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)]">
      {OPTIONS.map(({ id, Icon, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          title={label}
          className={`flex items-center justify-center w-7 h-6 rounded-md transition-all ${
            theme === id
              ? 'bg-[rgba(99,102,241,0.2)] text-[#6366f1]'
              : 'text-[#565a72] hover:text-[#8b8fa8]'
          }`}
        >
          <Icon size={12} />
        </button>
      ))}
    </div>
  );
}
