import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const isFile = type === 'file';
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-slate-200 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-w-0 rounded-lg border bg-white text-base shadow-none transition-[border-color,background-color] duration-150 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-white/[0.1] dark:bg-white/[0.035]",
        isFile
          ? "h-9 cursor-pointer p-1 text-xs text-slate-600 dark:text-zinc-300 file:mr-2.5 file:rounded-md file:border-0 file:bg-slate-900 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800 dark:file:bg-white dark:file:text-slate-900 dark:hover:file:bg-slate-100"
          : "h-9 w-full px-3 py-1 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus-visible:border-slate-900 focus-visible:bg-white focus-visible:ring-0 dark:focus-visible:border-white/40 dark:focus-visible:bg-white/[0.06]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
