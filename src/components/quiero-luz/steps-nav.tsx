import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const PASOS = ["Necesidad", "Uso", "Equipamiento", "Contexto"];

export function StepsNav({ current }: { current: number }) {
  return (
    <ol
      className="mx-auto flex w-full max-w-[840px] items-start"
      aria-label="Progreso de la orientación"
    >
      {PASOS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1",
                  i === 0 ? "opacity-0" : done ? "bg-success" : "bg-border",
                )}
              />
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  done && "bg-success text-success-foreground",
                  active && "bg-warning text-warning-foreground",
                  !done && !active && "bg-border",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : null}
                <span className="sr-only">
                  {done ? "Paso completado" : active ? "Paso actual" : "Paso pendiente"}
                </span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1",
                  i === PASOS.length - 1 ? "opacity-0" : done ? "bg-success" : "bg-border",
                )}
              />
            </div>
            <span
              className={cn(
                "text-center text-sm",
                active ? "font-bold text-foreground" : done ? "text-foreground" : "text-muted-foreground",
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
