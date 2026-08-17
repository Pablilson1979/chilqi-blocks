import * as React from "react";
import { Check, CheckCircle2, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FieldState = "default" | "success" | "error";

export interface FieldProps extends Omit<InputProps, "state" | "id"> {
  /** Etiqueta visible. Obligatoria por accesibilidad. */
  label: string;
  id: string;
  state?: FieldState;
  /** Texto de ayuda o de error. En error se muestra con icono, nunca solo color. */
  message?: string;
}

/**
 * Chilquinta DS 4.0 — Campo de formulario.
 * Etiqueta + input + mensaje. El estado nunca se comunica solo con color:
 * siempre acompaña un icono y un texto.
 */
export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, id, state = "default", message, className, ...props }, ref) => {
    const messageId = message ? `${id}-message` : undefined;

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <Label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </Label>
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            state={state}
            aria-invalid={state === "error" || undefined}
            aria-describedby={messageId}
            className={cn(state !== "default" && "pr-14")}
            {...props}
          />
          {state !== "default" ? (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute right-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full",
                state === "success" && "bg-success/25 text-success",
                state === "error" && "bg-destructive/15 text-destructive",
              )}
            >
              {state === "success" ? (
                <Check className="size-4" strokeWidth={3} />
              ) : (
                <AlertCircle className="size-4" strokeWidth={2.5} />
              )}
            </span>
          ) : null}
        </div>

        {message ? (
          <p
            id={messageId}
            className={cn(
              "flex items-center gap-1.5 text-sm",
              state === "error" && "text-destructive",
              state === "success" && "text-success",
              state === "default" && "text-muted-foreground",
            )}
          >
            {state === "error" ? <AlertCircle className="size-4 shrink-0" aria-hidden /> : null}
            {state === "success" ? <CheckCircle2 className="size-4 shrink-0" aria-hidden /> : null}
            {message}
          </p>
        ) : null}
      </div>
    );
  },
);
Field.displayName = "Field";
