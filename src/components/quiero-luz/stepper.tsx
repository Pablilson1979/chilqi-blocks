import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepperProps {
  steps: string[];
  /** Índice del paso actual (0-based). */
  current: number;
}

/** Stepper horizontal: verde = completado, rojo = paso actual. */
export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex items-start justify-center gap-1 sm:gap-2" aria-label="Progreso">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              <span
                className={cn("h-0.5 flex-1", i === 0 ? "opacity-0" : "bg-border")}
                aria-hidden
              />
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  done && "bg-success text-success-foreground",
                  active && "bg-primary text-primary-foreground",
                  !done && !active && "border-2 border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === steps.length - 1 ? "opacity-0" : "bg-border",
                )}
                aria-hidden
              />
            </div>
            <span
              className={cn(
                "text-center text-xs leading-snug sm:text-sm",
                active ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
