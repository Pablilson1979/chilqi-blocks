import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Opcion } from "./content";

export function ChoiceGroup<T extends string>({
  question,
  options,
  value,
  onChange,
  columns = 1,
}: {
  question: string;
  options: Opcion<T>[];
  value: T | null;
  onChange: (v: T) => void;
  columns?: 1 | 2;
}) {
  return (
    <fieldset className="flex flex-col gap-ch-md">
      <legend className="mb-1 text-base font-bold text-foreground">{question}</legend>
      <div
        role="radiogroup"
        className={cn("grid gap-ch-md", columns === 2 && "sm:grid-cols-2")}
      >
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.value)}
              className={cn(
                "ch-touch flex w-full cursor-pointer items-center justify-between gap-ch-md rounded-card border-2 p-ch-base text-left transition-colors",
                selected
                  ? "border-success bg-success-soft"
                  : "border-transparent bg-card shadow-card hover:bg-muted/40",
              )}
            >
              <span className="flex flex-col gap-1">
                <span className="text-base font-bold text-foreground">{o.label}</span>
                {o.description ? (
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {o.description}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity",
                  selected ? "bg-success-tint opacity-100" : "opacity-0",
                )}
                aria-hidden="true"
              >
                <Check className="h-5 w-5 text-success" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

