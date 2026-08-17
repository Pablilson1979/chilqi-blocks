import * as React from "react";
import { ChevronRight, FileText, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

/**
 * Chilquinta DS 4.0 — Tarjetas de patrón.
 * Radio de card (12px), sombra de card y solo tokens semánticos.
 *
 * El rojo corporativo se reserva para la acción principal; la selección,
 * el progreso y los iconos informativos usan el azul institucional para
 * no leerse como alerta.
 */

export interface SelectionCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string;
  selected?: boolean;
  icon?: React.ReactNode;
}

/** Tarjeta de selección (ej. Baja Tensión / Media-Alta Tensión). */
export function SelectionCard({
  title,
  description,
  selected = false,
  icon,
  className,
  ...props
}: SelectionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-4 rounded-card border-2 bg-card p-6 text-left transition-colors focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2",
        selected
          ? "border-success bg-success-soft shadow-card-hover"
          : "border-border hover:border-success/50 shadow-card",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-input transition-colors [&_svg]:size-6",
            selected ? "bg-success text-success-foreground" : "bg-info-soft text-info",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="flex flex-1 flex-col gap-1">
        <span className="text-base font-bold text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-1 flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
          selected ? "text-success" : "border-border-strong",
        )}
      >
        {selected ? (
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
        ) : null}
      </span>

    </button>
  );
}

export interface RequestStatusCardProps {
  title: string;
  orderId: string;
  description: string;
  stepLabel: string;
  progress: number;
  className?: string;
}

/** Tarjeta de estado de solicitud con avance por etapas. */
export function RequestStatusCard({
  title,
  orderId,
  description,
  stepLabel,
  progress,
  className,
}: RequestStatusCardProps) {
  return (
    <Card className={cn("flex flex-col gap-4 p-6", className)}>
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-input bg-info-soft text-info"
        >
          <FileText className="size-6" />
        </span>
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">Orden {orderId}</p>
        </div>
        <Badge variant="info" className="ml-auto">
          En curso
        </Badge>
      </div>
      <p className="text-sm text-foreground/80">{description}</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-semibold text-foreground">
          <span>{stepLabel}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} aria-label={stepLabel} />
      </div>
    </Card>
  );
}

export interface FeatureCardProps {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel: string;
  href?: string;
  className?: string;
}

/** Tarjeta con imagen (gestión inmobiliaria, noticias). */
export function FeatureCard({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  actionLabel,
  href = "#",
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn("flex flex-col overflow-hidden", className)}>
      <img src={image} alt={imageAlt} loading="lazy" className="h-44 w-full object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-6">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        <a
          href={href}
          className="ch-touch mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-primary hover:text-primary-hover hover:underline"
        >
          {actionLabel}
          <ChevronRight className="size-4" aria-hidden />
        </a>
      </div>
    </Card>
  );
}

export interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  tone?: "info" | "success" | "warning" | "neutral";
  className?: string;
  children?: React.ReactNode;
}

const infoTone = {
  info: "bg-info-soft text-info",
  success: "bg-success-tint text-success",
  warning: "bg-warning-tint text-warning",
  neutral: "bg-muted text-muted-foreground",
} as const;

/** Tarjeta informativa: tile de icono + contenido (patrón "Card Info"). */
export function InfoCard({
  icon,
  title,
  description,
  tone = "info",
  className,
  children,
}: InfoCardProps) {
  return (
    <Card className={cn("flex gap-4 p-6", className)}>
      <span
        aria-hidden
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-input [&_svg]:size-6",
          infoTone[tone],
        )}
      >
        {icon}
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {children}
      </div>
    </Card>
  );
}

export { Plus };

export interface CorporateCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  href?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Card corporativa: acento rojo Chilquinta contenido (barra lateral + tile suave).
 * Pensada para convivir con la InfoCard azul: la roja marca la acción o el
 * mensaje de marca, la azul actúa como pausa informativa entre ellas.
 */
export function CorporateCard({
  eyebrow,
  title,
  description,
  actionLabel,
  href = "#",
  icon,
  className,
}: CorporateCardProps) {
  return (
    <Card
      className={cn(
        "relative flex gap-4 overflow-hidden border-l-4 border-l-primary p-6",
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-input bg-primary/10 text-primary [&_svg]:size-6"
        >
          {icon}
        </span>
      ) : null}
      <div className="flex flex-1 flex-col gap-1">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        ) : null}
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {actionLabel ? (
          <a
            href={href}
            className="ch-touch mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            {actionLabel}
            <ChevronRight className="size-4" aria-hidden />
          </a>
        ) : null}
      </div>
    </Card>
  );
}
