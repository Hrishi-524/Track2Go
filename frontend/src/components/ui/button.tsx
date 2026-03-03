import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap",
    "rounded-full", 
    "text-md font-bold", 
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer"
  ].join(" "),
  {
    variants: {
      variant: {
        /** AWS Primary (orange) */
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",

        /** AWS Secondary (outline blue) */
        secondary:
          "bg-background text-secondary border-2 border-bordercolor hover:bg-accent",

        /** AWS Outline (used less often) */
        outline:
          "bg-transparent border border-border text-foreground hover:bg-accent",

        /** Destructive */
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",

        /** Ghost */
        ghost:
          "bg-transparent text-foreground hover:bg-accent",

        /** Link */
        link:
          "bg-transparent text-primary underline-offset-4 hover:underline",
      },

      size: {
        /** AWS default button */
        default: "h-8 px-4",

        sm: "h-7 px-3 text-xs",
        lg: "h-9 px-6",

        icon: "h-8 w-8 p-0",
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
  variant = "default",
  size = "default",
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
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
