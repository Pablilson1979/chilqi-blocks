import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      <RadioGroup
        value={value ?? ""}
        onValueChange={(v) => onChange(v as T)}
        className={cn("gap-ch-md", columns === 2 && "sm:grid-cols-2")}
      >
        {options.map((o) => {
          const selected = value === o.value;
          const id = `${question}-${o.value}`;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={cn(
                "ch-touch flex cursor-pointer items-start gap-ch-md rounded-card border bg-card p-ch-base transition-colors",
                selected
                  ? "border-warning bg-warning-soft/60"
                  : "border-border hover:border-border-strong hover:bg-muted/40",
              )}
            >
              <RadioGroupItem id={id} value={o.value} className="mt-1 h-5 w-5" />
              <span className="flex flex-col gap-1">
                <span className="text-base font-bold text-foreground">{o.label}</span>
                {o.description ? (
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {o.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}
