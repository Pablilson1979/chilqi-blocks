import * as React from "react";
import { ChevronDown, CircleCheck, DoorClosed, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Caso } from "@/components/visita/content";

const MOTIVOS = ["No tengo luz", "La luz va y vuelve", "Bajó la intensidad", "Poste o cable dañado"];

export interface ReabrirReporteProps {
  caso: Caso;
}

/**
 * Cierre del reporte: desplegable que permite reportar nuevamente el corte
 * aquí mismo, sin repetir el flujo completo. Texto según el motivo del cierre.
 */
export function ReabrirReporte({ caso }: ReabrirReporteProps) {
  const casaCerrada = caso.cierre === "casa_cerrada";
  const Icon = casaCerrada ? DoorClosed : Zap;
  const [abierto, setAbierto] = React.useState(false);
  const [motivo, setMotivo] = React.useState<string | null>(null);
  const [fono, setFono] = React.useState((caso.telefono ?? "").replace(/\D/g, ""));
  const [desc, setDesc] = React.useState("");
  const [enviado, setEnviado] = React.useState(false);

  const titulo = casaCerrada ? "El técnico llegó y no había nadie" : "¿Sigues sin suministro?";
  const texto = casaCerrada
    ? "Si sigues sin luz, reporta nuevamente el corte y asegúrate de que un adulto pueda recibir al técnico."
    : "Si la luz no volvió o se cortó otra vez, repórtalo aquí mismo para que un técnico vuelva a revisar.";
  const puede = Boolean(motivo) && fono.length >= 8;

  if (enviado) {
    return (
      <div className="flex items-start gap-ch-md rounded-card border-2 border-success bg-success-soft p-ch-base">
        <CircleCheck className="mt-0.5 size-6 shrink-0 text-success" aria-hidden />
        <div>
          <p className="text-base font-bold text-foreground">Recibimos tu nuevo reporte</p>
          <p className="mt-1 text-base text-foreground">
            Quedó vinculado a tu solicitud N° {caso.orden}. Te avisaremos del avance al +56 {fono}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border-2 border-warning bg-warning-soft">
      <button
        type="button"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-start gap-ch-md p-ch-base text-left"
      >
        <span aria-hidden className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-warning-tint text-warning">
          <Icon className="size-5" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-foreground">{titulo}</span>
          <span className="mt-1 block text-base leading-relaxed text-foreground">{texto}</span>
        </span>
        <span aria-hidden className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-card shadow-card">
          <ChevronDown className={cn("size-5 text-foreground transition-transform", abierto && "rotate-180")} />
        </span>
      </button>

      {abierto ? (
        <form
          className="flex flex-col gap-ch-base border-t border-warning/40 bg-card p-ch-base"
          onSubmit={(e) => {
            e.preventDefault();
            if (puede) setEnviado(true);
          }}
        >
          <fieldset>
            <legend className="text-base font-bold text-foreground">¿Qué está pasando?</legend>
            <div className="mt-ch-sm grid grid-cols-1 gap-ch-sm sm:grid-cols-2">
              {MOTIVOS.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={motivo === m}
                  onClick={() => setMotivo(m)}
                  className={cn(
                    "ch-touch flex items-center justify-between gap-ch-sm rounded-card border px-ch-base py-3 text-left text-base font-semibold transition-colors",
                    motivo === m
                      ? "border-success bg-success-soft text-success"
                      : "border-border-strong bg-surface text-foreground hover:border-primary",
                  )}
                >
                  <span>{m}</span>
                  {motivo === m ? (
                    <CircleCheck className="size-5 shrink-0" aria-hidden />
                  ) : null}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-ch-sm">
            <span className="text-base font-bold text-foreground">Ingresa tu celular y te avisamos del avance</span>
            <span className="flex items-center gap-ch-sm rounded-pill border border-border-strong bg-surface px-ch-base">
              <span className="text-base font-semibold text-muted-foreground">+56</span>
              <input
                inputMode="numeric"
                value={fono}
                onChange={(e) => setFono(e.target.value.replace(/\D/g, "").slice(0, 9))}
                placeholder="9 1234 5678"
                className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none"
              />
            </span>
          </label>

          <label className="flex flex-col gap-ch-sm">
            <span className="text-base font-bold text-foreground">Describe el problema (opcional)</span>
            <textarea
              value={desc}
              maxLength={250}
              rows={3}
              onChange={(e) => setDesc(e.target.value)}
              className="rounded-card border border-border-strong bg-surface p-ch-md text-base outline-none focus:border-primary"
            />
            <span className="self-end text-sm text-muted-foreground">{desc.length}/250</span>
          </label>

          <p className="text-base font-semibold text-foreground">
            Recuerda que debe haber alguien en el lugar para dar acceso.
          </p>

          <Button type="submit" size="lg" disabled={!puede} className="w-full">
            <img src="/icons/emergencia/reportarcorte.svg" alt="" className="size-5 brightness-0 invert" />
            Enviar reporte para esta dirección
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export default ReabrirReporte;
