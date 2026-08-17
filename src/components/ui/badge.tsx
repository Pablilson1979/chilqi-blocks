import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        /** Neutro informativo: uso por defecto, no compite con la alerta. */
        default: "border-transparent bg-info-soft text-info",
        /** Rojo corporativo: solo para destacar marca, nunca para estados. */
        brand: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-border-strong bg-surface text-foreground",
        destructive: "border-transparent bg-destructive-soft text-destructive",
        success: "border-transparent bg-success-soft text-success",
        info: "border-transparent bg-info-soft text-info",
        warning: "border-transparent bg-warning-soft text-foreground",
        outline: "border-border-strong text-foreground",
      },

    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
