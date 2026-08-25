import {
    Check,
    CheckCircle2,
    Circle,
    KeyRound,
    Lock,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export interface PasswordCriteria {
    id: string;
    label: string;
    shortTag: string;
    met: boolean;
}

export function evaluatePassword(password: string): {
    score: number;
    criteria: PasswordCriteria[];
    strengthLabel: string;
    strengthColor: string;
    strengthTone: 'none' | 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
} {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const criteria: PasswordCriteria[] = [
        { id: 'min_length', label: 'Min. 8 karakter', shortTag: '8+ Char', met: hasMinLength },
        { id: 'uppercase', label: 'Huruf besar (A-Z)', shortTag: 'A-Z', met: hasUppercase },
        { id: 'lowercase', label: 'Huruf kecil (a-z)', shortTag: 'a-z', met: hasLowercase },
        { id: 'number', label: 'Angka (0-9)', shortTag: '0-9', met: hasNumber },
        { id: 'symbol', label: 'Simbol khusus (!@#$)', shortTag: '@#$', met: hasSymbol },
    ];

    const score = criteria.filter((c) => c.met).length;

    let strengthLabel = 'Belum Diisi';
    let strengthColor = 'bg-slate-200 dark:bg-zinc-700';
    let strengthTone: 'none' | 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong' = 'none';

    if (password.length > 0) {
        if (score <= 1) {
            strengthLabel = 'Sangat Lemah';
            strengthColor = 'bg-rose-500';
            strengthTone = 'very-weak';
        } else if (score === 2) {
            strengthLabel = 'Lemah';
            strengthColor = 'bg-amber-500';
            strengthTone = 'weak';
        } else if (score === 3) {
            strengthLabel = 'Cukup';
            strengthColor = 'bg-yellow-500';
            strengthTone = 'fair';
        } else if (score === 4) {
            strengthLabel = 'Kuat';
            strengthColor = 'bg-blue-500';
            strengthTone = 'strong';
        } else if (score === 5) {
            strengthLabel = 'Sangat Kuat';
            strengthColor = 'bg-emerald-500';
            strengthTone = 'very-strong';
        }
    }

    return { score, criteria, strengthLabel, strengthColor, strengthTone };
}

export function PasswordStrengthIndicator({
    password = '',
    className,
}: {
    password?: string;
    className?: string;
}) {
    const { score, criteria, strengthLabel, strengthTone } = evaluatePassword(password);
    const hasInput = password.length > 0;

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/90 via-white/80 to-slate-50/50 p-3.5 shadow-xs transition-all duration-300 dark:border-white/[0.08] dark:from-[#13161c] dark:via-[#0e1015] dark:to-[#0a0c10]',
                className
            )}
        >
            {/* Top Row: Title, Security Icon & Strength Badge */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <div
                        className={cn(
                            'flex size-8 items-center justify-center rounded-xl border transition-colors duration-200',
                            !hasInput && 'border-slate-200/80 bg-slate-100/80 text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400',
                            strengthTone === 'very-weak' && 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400',
                            strengthTone === 'weak' && 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400',
                            strengthTone === 'fair' && 'border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900/50 dark:bg-yellow-950/40 dark:text-yellow-400',
                            strengthTone === 'strong' && 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400',
                            strengthTone === 'very-strong' && 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400'
                        )}
                    >
                        {score >= 4 ? (
                            <ShieldCheck className="size-4 stroke-[2.2]" />
                        ) : score >= 1 ? (
                            <Shield className="size-4 stroke-[2]" />
                        ) : (
                            <Lock className="size-4 stroke-[2]" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                                Kekuatan Kata Sandi
                            </span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-400">
                            {hasInput
                                ? `${score} dari 5 syarat keamanan terpenuhi`
                                : 'Gunakan kombinasi yang aman'}
                        </p>
                    </div>
                </div>

                {/* Badge Status */}
                <div
                    className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide transition-all duration-200',
                        !hasInput && 'border-slate-200 bg-slate-100/70 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400',
                        strengthTone === 'very-weak' && 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/50 dark:text-rose-300',
                        strengthTone === 'weak' && 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/50 dark:text-amber-300',
                        strengthTone === 'fair' && 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800/40 dark:bg-yellow-950/50 dark:text-yellow-300',
                        strengthTone === 'strong' && 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/40 dark:bg-blue-950/50 dark:text-blue-300',
                        strengthTone === 'very-strong' && 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/50 dark:text-emerald-300'
                    )}
                >
                    <span
                        className={cn(
                            'size-1.5 rounded-full',
                            !hasInput && 'bg-slate-400 dark:bg-zinc-500',
                            strengthTone === 'very-weak' && 'bg-rose-500',
                            strengthTone === 'weak' && 'bg-amber-500',
                            strengthTone === 'fair' && 'bg-yellow-500',
                            strengthTone === 'strong' && 'bg-blue-500',
                            strengthTone === 'very-strong' && 'bg-emerald-500'
                        )}
                    />
                    <span>{hasInput ? strengthLabel : 'Belum Diisi'}</span>
                </div>
            </div>

            {/* 5-segment Neon Progress Track */}
            <div className="my-2.5 grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => {
                    const isFilled = hasInput && score >= level;
                    return (
                        <div
                            key={level}
                            className="relative h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.08]"
                        >
                            <div
                                className={cn(
                                    'absolute inset-0 transition-all duration-500 ease-out',
                                    isFilled
                                        ? strengthTone === 'very-weak'
                                            ? 'bg-gradient-to-r from-rose-500 to-rose-600'
                                            : strengthTone === 'weak'
                                              ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                                              : strengthTone === 'fair'
                                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                                                : strengthTone === 'strong'
                                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                                                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                        : 'opacity-0'
                                )}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Criteria Grid Chips */}
            <div className="grid grid-cols-1 gap-1.5 pt-0.5 sm:grid-cols-2 lg:grid-cols-3">
                {criteria.map((c, idx) => {
                    const isFifth = idx === 4;
                    return (
                        <div
                            key={c.id}
                            className={cn(
                                'flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-[11px] transition-all duration-200',
                                isFifth && 'sm:col-span-2 lg:col-span-1',
                                c.met
                                    ? 'border-emerald-200/90 bg-emerald-50/90 font-medium text-emerald-900 shadow-2xs dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-200'
                                    : 'border-slate-200/70 bg-white/70 text-slate-500 hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#12151b] dark:text-zinc-400'
                            )}
                        >
                            <div className="flex items-center gap-1.5 truncate">
                                <span
                                    className={cn(
                                        'flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] transition-all duration-300',
                                        c.met
                                            ? 'bg-emerald-600 text-white shadow-xs dark:bg-emerald-500'
                                            : 'bg-slate-200/80 text-slate-400 dark:bg-white/10 dark:text-zinc-500'
                                    )}
                                >
                                    {c.met ? (
                                        <Check className="size-2.5 stroke-[3]" />
                                    ) : (
                                        <Circle className="size-1.5 fill-current" />
                                    )}
                                </span>
                                <span className="truncate">{c.label}</span>
                            </div>

                            <span
                                className={cn(
                                    'rounded px-1 py-0.5 text-[9px] font-mono font-bold tracking-tight',
                                    c.met
                                        ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                                        : 'bg-slate-100 text-slate-400 dark:bg-white/[0.04] dark:text-zinc-500'
                                )}
                            >
                                {c.shortTag}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
