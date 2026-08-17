import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface OptionButtonProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

/** Opción tipo tarjeta del simulador: verde con check cuando está seleccionada. */
export function OptionButton({ label, selected, onSelect }: OptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "ch-touch flex items-center justify-center gap-3 rounded-input border-2 bg-card px-4 py-4 text-center text-base font-bold transition-colors focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2",
        selected
          ? "border-success bg-success-soft text-foreground"
          : "border-border text-foreground hover:border-success/50",
      )}
    >
      <span className="flex-1">{label}</span>
      <span
        aria-hidden
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          selected ? "bg-success-tint text-success" : "opacity-0",
        )}
      >
        <Check className="size-4" />
      </span>
    </button>
  );
}

export function QuestionGroup({
  number,
  question,
  children,
}: {
  number: number;
  question: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-base font-bold text-foreground">
        {number}.- {question}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
