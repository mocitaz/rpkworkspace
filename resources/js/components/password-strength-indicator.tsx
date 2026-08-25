import { Check, CheckCircle2, Circle, ShieldCheck, ShieldAlert } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export interface PasswordCriteria {
    id: string;
    label: string;
    met: boolean;
}

export function evaluatePassword(password: string): {
    score: number;
    criteria: PasswordCriteria[];
    strengthLabel: string;
    strengthColor: string;
} {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const criteria: PasswordCriteria[] = [
        { id: 'min_length', label: 'Min. 8 karakter', met: hasMinLength },
        { id: 'uppercase', label: 'Huruf besar (A-Z)', met: hasUppercase },
        { id: 'lowercase', label: 'Huruf kecil (a-z)', met: hasLowercase },
        { id: 'number', label: 'Angka (0-9)', met: hasNumber },
        { id: 'symbol', label: 'Simbol / Karakter khusus (!@#$)', met: hasSymbol },
    ];

    const score = criteria.filter((c) => c.met).length;

    let strengthLabel = 'Belum Diisi';
    let strengthColor = 'bg-slate-200 dark:bg-zinc-700';

    if (password.length > 0) {
        if (score <= 1) {
            strengthLabel = 'Sangat Lemah';
            strengthColor = 'bg-rose-500';
        } else if (score === 2) {
            strengthLabel = 'Lemah';
            strengthColor = 'bg-amber-500';
        } else if (score === 3) {
            strengthLabel = 'Cukup';
            strengthColor = 'bg-yellow-500';
        } else if (score === 4) {
            strengthLabel = 'Kuat';
            strengthColor = 'bg-blue-500';
        } else if (score === 5) {
            strengthLabel = 'Sangat Kuat';
            strengthColor = 'bg-emerald-500';
        }
    }

    return { score, criteria, strengthLabel, strengthColor };
}

export function PasswordStrengthIndicator({
    password = '',
    className,
}: {
    password?: string;
    className?: string;
}) {
    const { score, criteria, strengthLabel } = evaluatePassword(password);
    const hasInput = password.length > 0;

    return (
        <div
            className={cn(
                'space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 text-xs transition-all dark:border-white/10 dark:bg-white/[0.02]',
                className
            )}
        >
            {/* Strength Score Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                    <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Kekuatan Kata Sandi</span>
                </div>
                <span
                    className={cn(
                        'text-[10px] font-bold uppercase tracking-wider',
                        !hasInput && 'text-slate-400 dark:text-zinc-500',
                        hasInput && score <= 2 && 'text-rose-600 dark:text-rose-400',
                        hasInput && score === 3 && 'text-amber-600 dark:text-amber-400',
                        hasInput && score === 4 && 'text-blue-600 dark:text-blue-400',
                        hasInput && score === 5 && 'text-emerald-600 dark:text-emerald-400'
                    )}
                >
                    {hasInput ? strengthLabel : 'Syarat Keamanan'}
                </span>
            </div>

            {/* 5-segment Strength Bar */}
            <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((level) => {
                    const isFilled = hasInput && score >= level;
                    return (
                        <div
                            key={level}
                            className={cn(
                                'h-1.5 rounded-full transition-all duration-300',
                                isFilled
                                    ? score <= 2
                                        ? 'bg-rose-500'
                                        : score === 3
                                          ? 'bg-amber-500'
                                          : score === 4
                                            ? 'bg-blue-500'
                                            : 'bg-emerald-500'
                                    : 'bg-slate-200 dark:bg-white/10'
                            )}
                        />
                    );
                })}
            </div>

            {/* Criteria Checklist Grid */}
            <div className="grid grid-cols-1 gap-1.5 pt-1 sm:grid-cols-2">
                {criteria.map((c) => (
                    <div
                        key={c.id}
                        className={cn(
                            'flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] transition-all',
                            c.met
                                ? 'border-emerald-200 bg-emerald-50/80 font-medium text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300'
                                : 'border-slate-200/70 bg-white/80 text-slate-500 dark:border-white/5 dark:bg-[#121418] dark:text-zinc-400'
                        )}
                    >
                        <span
                            className={cn(
                                'flex size-3.5 shrink-0 items-center justify-center rounded-full text-[9px]',
                                c.met
                                    ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                                    : 'bg-slate-200 text-slate-400 dark:bg-white/10 dark:text-zinc-500'
                            )}
                        >
                            {c.met ? <Check className="size-2.5 stroke-[3]" /> : <Circle className="size-1.5 fill-current" />}
                        </span>
                        <span className="truncate">{c.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
