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
        "ch-touch flex w-full items-start gap-ch-md rounded-card border p-ch-base text-left transition-colors",
        "focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2",
        selected
          ? "border-primary bg-primary-soft"
          : "border-border bg-card hover:border-primary-tint hover:bg-primary-soft/40",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong",
        )}
      >
        {selected ? <Check className="size-4" strokeWidth={3} /> : null}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-base font-bold text-foreground">{label}</span>
        {description ? (
          <span className="text-sm leading-relaxed text-muted-foreground">{description}</span>
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
      <div className={cn("grid gap-ch-md", columns === 2 && "sm:grid-cols-2")}>
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
