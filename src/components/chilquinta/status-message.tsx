import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Chilquinta DS 4.0 — Mensajes de estado.
 * Icono + título + detalle. Nunca se comunica el estado solo con color.
 *
 * Jerarquía cromática: el rojo corporativo queda reservado para acciones
 * principales y errores reales. Confirmaciones (verde), información (azul)
 * y advertencias (ámbar) llevan el peso de la comunicación de estado.
 */
const statusVariants = cva("flex gap-4 rounded-card p-4 md:p-6", {
  variants: {
    tone: {
      success: "",
      info: "",
      warning: "",
      error: "",
    },
    /** soft: fondo teñido + borde de color. plain: tarjeta blanca neutra. */
    variant: {
      soft: "border-2",
      plain: "border border-border bg-card",
    },
  },
  compoundVariants: [
    { variant: "soft", tone: "success", className: "border-success bg-success-soft" },
    { variant: "soft", tone: "info", className: "border-info bg-info-soft" },
    { variant: "soft", tone: "warning", className: "border-warning bg-warning-soft" },
    { variant: "soft", tone: "error", className: "border-destructive bg-destructive-soft" },
  ],
  defaultVariants: { tone: "info", variant: "soft" },
});

const iconTile = {
  success: "bg-success-tint text-success",
  info: "bg-info-tint text-info",
  warning: "bg-warning-tint text-warning",
  error: "bg-destructive-tint text-destructive",
} as const;

const icons = {
  warning: AlertTriangle,
  error: XCircle,
} as const;

export interface StatusMessageProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statusVariants> {
  title: string;
  description?: string;
  /** Línea secundaria de detalle (ej. "Lectura: 006789 | Fecha: 23 de febrero"). */
  detail?: string;
}

export function StatusMessage({
  className,
  tone = "info",
  variant = "soft",
  title,
  description,
  detail,
  children,
  ...props
}: StatusMessageProps) {
  const key = tone ?? "info";
  const Icon = key === "warning" || key === "error" ? icons[key] : null;

  return (
    <div role="status" className={cn(statusVariants({ tone, variant }), className)} {...props}>
      <span
        aria-hidden
        className={cn(
          "flex size-12 shrink-0 items-center justify-center",
          variant === "plain" ? "rounded-input" : "rounded-full",
          iconTile[key],
        )}
      >
        {key === "success" ? (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="40" height="40" rx="20" className="fill-success-tint" />
            <circle cx="19.9998" cy="20" r="19.2234" className="fill-success-tint" />
            <path
              d="M14.7979 19.8115L18.4541 23.4678L25.7665 16.1553"
              className="stroke-success"
              strokeWidth="3.06185"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : key === "info" ? (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="40" height="40" rx="20" className="fill-info-tint" />
            <path
              d="M20 19C19.7348 19 19.4804 19.1054 19.2929 19.2929C19.1054 19.4804 19 19.7348 19 20V24C19 24.2652 19.1054 24.5196 19.2929 24.7071C19.4804 24.8946 19.7348 25 20 25C20.2652 25 20.5196 24.8946 20.7071 24.7071C20.8946 24.5196 21 24.2652 21 24V20C21 19.7348 20.8946 19.4804 20.7071 19.2929C20.5196 19.1054 20.2652 19 20 19ZM20.38 15.08C20.1365 14.98 19.8635 14.98 19.62 15.08C19.4973 15.1276 19.3851 15.199 19.29 15.29C19.2017 15.3872 19.1306 15.4988 19.08 15.62C19.024 15.7387 18.9966 15.8688 19 16C18.9992 16.1316 19.0245 16.2621 19.0742 16.3839C19.124 16.5057 19.1973 16.6166 19.29 16.71C19.3872 16.7983 19.4988 16.8694 19.62 16.92C19.7715 16.9822 19.936 17.0063 20.0989 16.9901C20.2619 16.9739 20.4184 16.9179 20.5547 16.8271C20.691 16.7362 20.8029 16.6133 20.8805 16.4691C20.9582 16.3249 20.9992 16.1638 21 16C20.9963 15.7352 20.8927 15.4816 20.71 15.29C20.6149 15.199 20.5028 15.1276 20.38 15.08ZM20 10C18.0222 10 16.0888 10.5865 14.4443 11.6853C12.7998 12.7841 11.5181 14.3459 10.7612 16.1732C10.0043 18.0004 9.8063 20.0111 10.1922 21.9509C10.578 23.8907 11.5304 25.6725 12.9289 27.0711C14.3275 28.4696 16.1093 29.422 18.0491 29.8078C19.9889 30.1937 21.9996 29.9957 23.8268 29.2388C25.6541 28.4819 27.2159 27.2002 28.3147 25.5557C29.4135 23.9112 30 21.9778 30 20C30 18.6868 29.7413 17.3864 29.2388 16.1732C28.7362 14.9599 27.9997 13.8575 27.0711 12.9289C26.1425 12.0003 25.0401 11.2638 23.8268 10.7612C22.6136 10.2587 21.3132 10 20 10V10ZM20 28C18.4178 28 16.871 27.5308 15.5554 26.6518C14.2398 25.7727 13.2145 24.5233 12.609 23.0615C12.0035 21.5997 11.845 19.9911 12.1537 18.4393C12.4624 16.8874 13.2243 15.462 14.3431 14.3431C15.462 13.2243 16.8874 12.4624 18.4393 12.1537C19.9911 11.845 21.5997 12.0035 23.0615 12.609C24.5233 13.2145 25.7727 14.2398 26.6518 15.5554C27.5308 16.871 28 18.4177 28 20C28 22.1217 27.1571 24.1566 25.6569 25.6568C24.1566 27.1571 22.1217 28 20 28V28Z"
              className="fill-info stroke-info"
              strokeWidth="0.5"
            />
          </svg>
        ) : Icon ? (
          <Icon className="size-6" strokeWidth={2.5} />
        ) : null}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-base font-bold text-foreground">{title}</p>
        {description ? <p className="text-sm text-foreground/80">{description}</p> : null}
        {detail ? <p className="text-sm font-semibold text-muted-foreground">{detail}</p> : null}
        {children}
      </div>
    </div>
  );
}
