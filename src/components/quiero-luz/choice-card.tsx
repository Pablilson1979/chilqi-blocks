import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Opcion } from "./content";

export function ChoiceCard({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description?: string | undefined;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "ch-touch flex w-full items-start gap-3 rounded-input border-2 p-4 text-left transition-colors",
        selected
          ? "border-success bg-success-soft"
          : "border-border bg-card hover:border-border-strong",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-success bg-success text-success-foreground" : "border-border-strong",
        )}
      >
        {selected ? <Check className="size-4" strokeWidth={3} /> : null}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-base font-bold text-foreground">{label}</span>
        {description ? (
          <span className="text-sm text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </button>
  );
}

export function ChoiceGroup<T extends string>({
  question,
  options,
  value,
  onChange,
  columns = 2,
}: {
  question: string;
  options: Opcion<T>[];
  value: T | null;
  onChange: (v: T) => void;
  columns?: 1 | 2;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-base font-bold text-foreground">{question}</legend>
      <div className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2")}>
        {options.map((o) => (
          <ChoiceCard
            key={o.value}
            label={o.label}
            description={o.description}
            selected={value === o.value}
            onSelect={() => onChange(o.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}