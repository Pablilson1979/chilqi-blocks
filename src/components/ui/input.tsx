import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Chilquinta Design System 4.0 — Inputs
 * Radio 8px, padding horizontal 16px, alto mínimo 44px.
 * Estados: default, focus, éxito, error, deshabilitado.
 */
const inputVariants = cva(
  "flex h-14 min-h-14 w-full rounded-input border bg-surface px-4 py-2 text-base text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 md:text-sm",
  {
    variants: {
      state: {
        default: "border-input",
        success: "border-success",
        error: "border-destructive",
      },
    },
    defaultVariants: { state: "default" },
  },
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, state, ...props }, ref) => {
    return (
      <input type={type} className={cn(inputVariants({ state }), className)} ref={ref} {...props} />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
