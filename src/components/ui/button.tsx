import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Chilquinta Design System 4.0 — Botones
 * Primario (sólido), Secundario (outline), Terciario (text link).
 * Radio pill 30px, padding 24px/12px, área táctil mínima 44px.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-sm font-semibold cursor-pointer transition-colors focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover",
        secondary:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        tertiary:
          "rounded-md bg-transparent px-2 text-primary underline-offset-4 hover:text-primary-hover hover:underline",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "rounded-md text-foreground hover:bg-accent",
        link: "rounded-md text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-6 py-3",
        sm: "min-h-9 px-4 py-2 text-sm",
        lg: "min-h-12 px-8 py-3 text-base",
        icon: "size-11 rounded-full px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
