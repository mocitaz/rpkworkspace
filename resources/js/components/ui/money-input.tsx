import * as React from 'react';
import { formatRupiahInput, parseRupiahInput } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface MoneyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'defaultValue'> {
    value?: number | string;
    defaultValue?: number | string;
    onValueChange?: (numericValue: number) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, numericValue: number) => void;
    prefixText?: string;
    allowZero?: boolean;
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
    (
        {
            className,
            value,
            defaultValue,
            onValueChange,
            onChange,
            name,
            id,
            placeholder = '0',
            disabled,
            required,
            prefixText,
            allowZero = true,
            ...props
        },
        ref,
    ) => {
        const isControlled = value !== undefined;
        const [internalValue, setInternalValue] = React.useState<string>(() => {
            const initial = isControlled ? value : (defaultValue ?? '');
            if (initial === 0 && !allowZero) return '';
            return formatRupiahInput(initial);
        });

        const displayValue = isControlled
            ? (value === 0 && !allowZero ? '' : formatRupiahInput(value))
            : internalValue;

        const rawNumericValue = parseRupiahInput(displayValue);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawInput = e.target.value;
            const formatted = formatRupiahInput(rawInput);
            const num = parseRupiahInput(rawInput);

            if (!isControlled) {
                setInternalValue(formatted);
            }

            if (onValueChange) {
                onValueChange(num);
            }

            if (onChange) {
                onChange(e, num);
            }
        };

        return (
            <div className="relative w-full">
                {prefixText && (
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-xs font-semibold text-slate-400 dark:text-zinc-500">
                        {prefixText}
                    </span>
                )}
                <input
                    ref={ref}
                    type="text"
                    inputMode="numeric"
                    id={id}
                    value={displayValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={cn(
                        'flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-800 shadow-2xs outline-hidden transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500',
                        prefixText && 'pl-9',
                        className,
                    )}
                    {...props}
                />
                {name && (
                    <input
                        type="hidden"
                        name={name}
                        value={rawNumericValue}
                    />
                )}
            </div>
        );
    },
);

MoneyInput.displayName = 'MoneyInput';
