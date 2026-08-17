import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const PASOS = ["Necesidad", "Uso", "Equipamiento", "Contexto"];

export function StepsNav({ current }: { current: number }) {
  return (
    <ol className="flex items-start" aria-label="Progreso de la orientación">
      {PASOS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              <span
                aria-hidden
                className={cn("h-0.5 flex-1", i === 0 ? "opacity-0" : done ? "bg-success" : "bg-border")}
              />
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                  done && "border-success bg-card text-success",
                  active && "border-info bg-info text-info-foreground",
                  !done && !active && "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              <span
                aria-hidden
                className={cn(
                  "h-0.5 flex-1",
                  i === PASOS.length - 1 ? "opacity-0" : done ? "bg-success" : "bg-border",
                )}
              />
            </div>
            <span
              className={cn(
                "text-center text-xs font-semibold sm:text-sm",
                active ? "text-foreground" : "text-muted-foreground",
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