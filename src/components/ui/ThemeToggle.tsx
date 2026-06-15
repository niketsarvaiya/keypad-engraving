import { Moon, Monitor, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Theme } from '../../store/useStore';

const OPTIONS: { value: Theme; Icon: typeof Moon; title: string }[] = [
  { value: 'light',  Icon: Sun,     title: 'Light mode' },
  { value: 'system', Icon: Monitor, title: 'System' },
  { value: 'dark',   Icon: Moon,    title: 'Dark mode' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useStore();
  return (
    <div className="flex items-center rounded-lg border border-line bg-raised p-0.5 gap-0.5">
      {OPTIONS.map(({ value, Icon, title }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={title}
          className={[
            'flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150',
            theme === value
              ? 'bg-surface text-ink shadow-sm'
              : 'text-ink-3 hover:text-ink-2',
          ].join(' ')}
        >
          <Icon size={13} />
        </button>
      ))}
    </div>
  );
}
