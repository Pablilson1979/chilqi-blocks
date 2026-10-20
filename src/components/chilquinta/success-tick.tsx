import { cn } from "@/lib/utils";

/** Ticket verde de estado positivo (DS Chilquinta): círculo #B4E7DC con check #0AA06E. */
export function SuccessTick({ className, label }: { className?: string; label?: string }) {
  return (
    <span className={cn("inline-flex size-7 shrink-0 items-center justify-center", className)}>
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
        <ellipse cx="13.58" cy="13.58" rx="13.58" ry="13.58" className="fill-success-tint" />
        <path d="M9.906 13.447l2.583 2.583 5.167-5.166" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="stroke-success" />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
