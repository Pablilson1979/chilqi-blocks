import * as React from "react";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusMessage } from "@/components/chilquinta/status-message";
import type { Caso } from "@/components/visita/content";

/** Qué pasa con el suministro, con el mismo lenguaje de "Reportar corte". */
const MOTIVOS = [
  {
    value: "nunca_volvio",
    label: "Nunca volvió la luz",
    description: "Sigo sin suministro desde el corte",
    Icon: Zap,
  },
  {
    value: "volvio_y_corto",
    label: "Volvió y se cortó de nuevo",
    description: "El corte se repitió después del cierre",
    Icon: AlertTriangle,
  },
  {
    value: "intensidad",
    label: "Volvió, pero muy débil",
    description: "Luces bajas o que van y vuelven",
    Icon: Clock,
  },
] as const;

type Motivo = (typeof MOTIVOS)[number]["value"];

const FRANJAS = ["Hoy · 18:00 a 21:00", "Mañana · 09:00 a 13:00", "Mañana · 14:00 a 18:00"];

/** Tarjeta de opción, coherente con el paso "¿Qué está pasando?". */
function OpcionMotivo({
  label,
  description,
  Icon,
  selected,
  onSelect,
}: {
  label: string;
  description: string;
  Icon: React.ElementType;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "ch-touch relative flex w-full items-center gap-ch-md rounded-card border-2 p-ch-base text-left transition-colors",
        selected
          ? "border-success bg-success-soft"
          : "border-border bg-card hover:border-success/50 hover:bg-muted/30",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full",
          selected ? "bg-success-tint text-success" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-foreground">{label}</span>
        <span className="block text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      {selected ? (
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-tint"
        >
          <Check className="size-4 text-success" strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}

export interface ReabrirReporteProps {
  caso: Caso;
}

/**
 * Reapertura en un paso desde la misma pantalla de seguimiento.
 * Reutiliza dirección, N° de cliente y teléfono del reporte original para no
 * repetir el flujo completo de "Reportar corte".
 */
export function ReabrirReporte({ caso }: ReabrirReporteProps) {
  const reagendar = caso.cierre === "casa_cerrada";
  const [abierto, setAbierto] = React.useState(false);
  const [motivo, setMotivo] = React.useState<Motivo | null>(null);
  const [franja, setFranja] = React.useState<string | null>(null);
  const [fono, setFono] = React.useState(caso.telefono ?? "");
  const [nota, setNota] = React.useState("");
  const [listo, setListo] = React.useState(false);

  // Segunda vez: no abrimos otra orden automática, pasamos a un canal humano.
  if (caso.reaperturaPrevia) {
    return (
      <div className="flex flex-col gap-ch-md">
        <StatusMessage
          tone="warning"
          title="Ya reabrimos este reporte una vez"
          description="Para no volver a cerrarlo sin solución, este caso necesita revisión de una persona de nuestro equipo. Contáctanos y lo vemos contigo ahora."
          detail={`Órdenes asociadas: ${caso.ordenPrevia ?? "—"} y ${caso.orden}`}
        />
        <Button size="lg" asChild>
          <a href="tel:6006005000">
            <PhoneCall aria-hidden />
            Llamar al 600 600 5000
          </a>
        </Button>
        <Button variant="secondary" size="lg" asChild>
          <a href="https://wa.me/56600600500" target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden />
            Escribir por WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  if (listo) {
    const nuevaOrden = `${caso.orden}-2`;
    return (
      <section className="rounded-card border-2 border-success bg-success-soft p-ch-base">
        <div className="flex flex-col items-center text-center">
          <span
            aria-hidden
            className="flex size-14 items-center justify-center rounded-full bg-success-tint"
          >
            <Check className="size-7 text-success" strokeWidth={3} />
          </span>
          <p className="mt-ch-md text-lg font-bold text-foreground">
            {reagendar ? "Visita reagendada" : "Reabrimos tu reporte"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            {reagendar
              ? `Te esperamos el ${franja}. Recuerda que un adulto debe recibir al técnico.`
              : "Tu caso vuelve a la cuadrilla de tu sector con prioridad por reapertura."}
          </p>
          <p className="mt-ch-md text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Número de orden
          </p>
          <p className="text-2xl font-bold text-primary">{nuevaOrden}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Vinculada a tu reporte anterior {caso.orden}
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="rounded-card border-2 border-warning bg-warning-soft">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="flex w-full items-start gap-ch-md p-ch-base text-left"
      >
        <span
          aria-hidden
          className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-warning-tint text-warning"
        >
          <AlertTriangle className="size-5" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-foreground">
            {reagendar ? "Necesito una nueva visita" : "Sigo sin suministro"}
          </span>
          <span className="block text-sm leading-relaxed text-foreground">
            {reagendar
              ? "Elige cuándo hay alguien en tu domicilio y reagendamos sin repetir el reporte."
              : `Puedes reabrir este reporte hasta las ${caso.reabrirHasta ?? "20:45"}, sin volver a ingresar tus datos.`}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "mt-0.5 size-7 shrink-0 text-primary transition-transform",
            abierto && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {abierto ? (
        <div className="flex flex-col gap-ch-md border-t-2 border-warning/40 p-ch-base">
          {/* Dirección registrada: mismo patrón que "¿Es esta la dirección sin luz?" */}
          <div className="flex items-start gap-ch-md rounded-card border-2 border-primary bg-primary-soft p-ch-base">
            <span
              aria-hidden
              className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary"
            >
              <MapPin className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                Dirección registrada
              </p>
              <p className="text-base font-bold text-foreground">{caso.direccion}</p>
              <p className="text-sm text-muted-foreground">{caso.comuna}</p>
              <p className="text-sm font-bold text-foreground">
                N° de cliente {caso.cliente}
              </p>
            </div>
          </div>

          {reagendar ? (
            <fieldset className="flex flex-col gap-ch-md">
              <legend className="mb-1 text-base font-bold text-foreground">
                ¿Cuándo hay alguien en tu domicilio?
              </legend>
              <div role="radiogroup" className="flex flex-col gap-ch-md">
                {FRANJAS.map((f) => (
                  <OpcionMotivo
                    key={f}
                    label={f}
                    description="Ventana estimada de llegada del técnico"
                    Icon={CalendarClock}
                    selected={franja === f}
                    onSelect={() => setFranja(f)}
                  />
                ))}
              </div>
            </fieldset>
          ) : (
            <fieldset className="flex flex-col gap-ch-md">
              <legend className="mb-1 text-base font-bold text-foreground">
                ¿Qué está pasando ahora?
              </legend>
              <div role="radiogroup" className="flex flex-col gap-ch-md">
                {MOTIVOS.map((m) => (
                  <OpcionMotivo
                    key={m.value}
                    label={m.label}
                    description={m.description}
                    Icon={m.Icon}
                    selected={motivo === m.value}
                    onSelect={() => setMotivo(m.value)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {/* Teléfono prellenado, con el mismo prefijo del flujo Reportar corte */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="reabrir-fono" className="text-sm font-semibold text-foreground">
              Teléfono para avisarte del avance
            </Label>
            <div className="flex items-stretch gap-2">
              <span className="flex shrink-0 items-center gap-2 rounded-input bg-muted px-4 text-base font-bold text-foreground">
                <PhoneCall className="size-4" aria-hidden />
                +56
              </span>
              <Input
                id="reabrir-fono"
                type="tel"
                inputMode="tel"
                placeholder="9 1234 5678"
                value={fono}
                onChange={(e) => setFono(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reabrir-nota" className="text-sm font-semibold text-foreground">
              ¿Algo que ayude al técnico? (opcional)
            </Label>
            <Textarea
              id="reabrir-nota"
              rows={3}
              maxLength={250}
              placeholder="Ej: el medidor está en el pasillo del segundo piso."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
            <p className="self-end text-sm text-muted-foreground">{nota.length}/250</p>
          </div>

          <div className="flex items-center gap-ch-md rounded-card border border-info bg-info-soft p-ch-base">
            <ShieldCheck className="size-5 shrink-0 text-info" aria-hidden />
            <p className="text-sm leading-relaxed text-foreground">
              Recuerda que debe haber alguien mayor de edad en el lugar para dar acceso.
            </p>
          </div>

          <Button
            size="lg"
            disabled={reagendar ? !franja : !motivo}
            onClick={() => setListo(true)}
          >
            {reagendar ? "Confirmar nueva visita" : "Reabrir mi reporte"}
          </Button>
          <Button variant="tertiary" size="lg" onClick={() => setAbierto(false)}>
            Volver
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default ReabrirReporte;
