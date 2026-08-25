import * as React from 'react';
import { FileUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
    value?: File | null;
    onFileSelect?: (file: File | null) => void;
    clearable?: boolean;
    buttonText?: string;
    placeholder?: string;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
    (
        {
            className,
            onChange,
            onFileSelect,
            value,
            disabled,
            accept,
            required,
            name,
            id,
            buttonText = 'Pilih Berkas',
            placeholder = 'Belum ada berkas dipilih...',
            clearable = true,
            ...props
        },
        forwardedRef
    ) => {
        const internalRef = React.useRef<HTMLInputElement>(null);
        const ref = (forwardedRef as React.RefObject<HTMLInputElement>) || internalRef;
        const [selectedFile, setSelectedFile] = React.useState<File | null>(value || null);
        const [isDragOver, setIsDragOver] = React.useState(false);

        React.useEffect(() => {
            if (value !== undefined) {
                setSelectedFile(value);
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;
            setSelectedFile(file);
            if (onFileSelect) {
                onFileSelect(file);
            }
            if (onChange) {
                onChange(e);
            }
        };

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (ref && 'current' in ref && ref.current) {
                ref.current.value = '';
            }
            setSelectedFile(null);
            if (onFileSelect) {
                onFileSelect(null);
            }
            if (onChange && ref && 'current' in ref && ref.current) {
                const event = {
                    target: ref.current,
                    currentTarget: ref.current,
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
            }
        };

        const formatSize = (bytes: number) => {
            if (!bytes || bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        };

        return (
            <div
                onClick={() => {
                    if (!disabled && ref && 'current' in ref && ref.current) {
                        ref.current.click();
                    }
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (disabled) return;
                    const file = e.dataTransfer.files?.[0] || null;
                    if (file) {
                        if (ref && 'current' in ref && ref.current) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            ref.current.files = dataTransfer.files;
                        }
                        setSelectedFile(file);
                        if (onFileSelect) onFileSelect(file);
                        if (onChange && ref && 'current' in ref && ref.current) {
                            const event = {
                                target: ref.current,
                                currentTarget: ref.current,
                            } as unknown as React.ChangeEvent<HTMLInputElement>;
                            onChange(event);
                        }
                    }
                }}
                className={cn(
                    'group relative flex min-h-[38px] w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 px-2.5 py-1.5 text-xs transition-all hover:border-slate-300 hover:bg-slate-100/70 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 dark:border-white/10 dark:bg-[#121418] dark:hover:border-white/20 dark:hover:bg-[#16181e]',
                    isDragOver && 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/20',
                    disabled && 'pointer-events-none cursor-not-allowed opacity-50',
                    className
                )}
            >
                <input
                    ref={ref}
                    type="file"
                    id={id}
                    name={name}
                    accept={accept}
                    required={required}
                    disabled={disabled}
                    onChange={handleChange}
                    className="sr-only"
                    tabIndex={-1}
                    {...props}
                />

                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs transition-colors group-hover:bg-slate-50 dark:border-white/10 dark:bg-[#1c1f26] dark:text-zinc-200 dark:group-hover:bg-[#222731]">
                        <FileUp className="size-3.5 text-blue-600 dark:text-blue-400" />
                        {buttonText}
                    </span>

                    {selectedFile ? (
                        <div className="flex min-w-0 items-center gap-1.5">
                            <span className="truncate font-medium text-slate-900 dark:text-white">
                                {selectedFile.name}
                            </span>
                            <span className="shrink-0 rounded bg-slate-200/70 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                                {formatSize(selectedFile.size)}
                            </span>
                        </div>
                    ) : (
                        <span className="truncate text-slate-400 dark:text-zinc-500">
                            {placeholder}
                        </span>
                    )}
                </div>

                {selectedFile && clearable && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        title="Hapus berkas terpilih"
                        className="flex size-5 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-zinc-200 cursor-pointer"
                    >
                        <X className="size-3.5" />
                    </button>
                )}
            </div>
        );
    }
);

FileInput.displayName = 'FileInput';
