import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
        primary:
          "bg-blue-600 text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500",
        destructive:
          "bg-rose-600 text-white shadow-2xs hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500",
        destructiveOutline:
          "border border-rose-200/80 bg-rose-50/50 text-rose-700 hover:bg-rose-100/70 hover:border-rose-300 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40",
        outline:
          "border border-slate-200/80 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300 dark:hover:bg-white/[0.04] dark:hover:text-white",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200/80 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700",
        ghost:
          "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
      },
      size: {
        default: "h-8.5 px-3.5 py-1.5",
        sm: "h-7.5 rounded-lg px-2.5 text-[11px]",
        lg: "h-10 px-5 text-sm",
        icon: "size-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
