import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeToggle({ className = '' }: { className?: string }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <button
            type="button"
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            aria-label="Ubah Tema Tampilan"
            className={`flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white ${className}`}
        >
            {isDark ? (
                <Sun className="size-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
                <Moon className="size-4 text-slate-500 transition-transform duration-300 hover:-rotate-12 dark:text-zinc-400" />
            )}
        </button>
    );
}
