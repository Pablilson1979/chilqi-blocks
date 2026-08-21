import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Opcion } from "./content";

export function ChoiceGroup<T extends string>({
  question,
  number,
  options,
  value,
  onChange,
  columns = 2,
}: {
  question: string;
  number?: number;
  options: Opcion<T>[];
  value: T | null;
  onChange: (v: T) => void;
  columns?: 1 | 2;
}) {
  return (
    <fieldset className="flex flex-col gap-ch-md">
      <legend className="mb-2 text-base font-bold text-foreground">
        {number ? `${number}.- ` : null}
        {question}
      </legend>
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
                "ch-touch relative flex min-h-[84px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-card border-2 px-12 py-ch-base text-center transition-colors",
                selected
                  ? "border-success bg-success-soft"
                  : "border-border bg-card hover:border-success/50 hover:bg-muted/30",
              )}
            >
              <span className="text-base font-bold text-foreground">{o.label}</span>
              {o.description ? (
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {o.description}
                </span>
              ) : null}
              <span
                className={cn(
                  "absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-opacity",
                  selected ? "bg-success-tint opacity-100" : "opacity-0",
                )}
                aria-hidden="true"
              >
                <Check className="h-4 w-4 text-success" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
