import { Head } from '@inertiajs/react';
import { CheckCircle2, Monitor, Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance as AppearanceType } from '@/hooks/use-appearance';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { appearance, updateAppearance } = useAppearance();

    const themes: {
        value: AppearanceType;
        title: string;
        description: string;
        icon: typeof Sun;
        previewBg: string;
    }[] = [
        {
            value: 'light',
            title: 'Mode Terang (Light)',
            description: 'Latar belakang putih bersih.',
            icon: Sun,
            previewBg: 'bg-[#fafafc] border-slate-200 text-slate-900',
        },
        {
            value: 'dark',
            title: 'Mode Gelap (Dark)',
            description: 'Kontras nyaman di mata malam hari.',
            icon: Moon,
            previewBg: 'bg-[#0c0d10] border-white/10 text-white',
        },
        {
            value: 'system',
            title: 'Otomatis (Sistem)',
            description: 'Mengikuti tema perangkat OS Anda.',
            icon: Monitor,
            previewBg:
                'bg-gradient-to-r from-[#fafafc] to-[#0c0d10] border-slate-300 text-slate-900',
        },
    ];

    return (
        <>
            <Head title="Pengaturan Tampilan & Tema" />

            <div className="space-y-5">
                <div className="space-y-0.5 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Tema &amp; Preferensi Visual
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Sesuaikan tema antarmuka workspace advokat agar nyaman
                        digunakan dalam bekerja.
                    </p>
                </div>

                {/* 3 Visual Interactive Theme Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {themes.map((theme) => {
                        const isSelected = appearance === theme.value;
                        const Icon = theme.icon;

                        return (
                            <button
                                key={theme.value}
                                type="button"
                                onClick={() => updateAppearance(theme.value)}
                                className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50/30 shadow-2xs ring-1 ring-blue-600 dark:bg-blue-950/20'
                                        : 'border-slate-200/70 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-white/10 dark:bg-[#14161b] dark:hover:border-white/20'
                                }`}
                            >
                                <div className="space-y-2.5">
                                    {/* Preview Box */}
                                    <div
                                        className={`flex h-16 w-full items-center justify-center rounded-lg border p-2 shadow-2xs transition-transform group-hover:scale-[1.02] ${theme.previewBg}`}
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-full bg-white/90 shadow-2xs backdrop-blur-xs dark:bg-zinc-800/90">
                                            <Icon
                                                className={`size-4 ${
                                                    theme.value === 'light'
                                                        ? 'text-amber-500'
                                                        : theme.value === 'dark'
                                                          ? 'text-blue-400'
                                                          : 'text-purple-500'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                                {theme.title}
                                            </span>
                                            {isSelected && (
                                                <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                            {theme.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Tampilan',
            href: editAppearance(),
        },
    ],
};
