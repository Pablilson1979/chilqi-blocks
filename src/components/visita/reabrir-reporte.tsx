import { DoorClosed, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Caso } from "@/components/visita/content";

export interface ReabrirReporteProps {
  caso: Caso;
}

/**
 * Cierre del reporte: invita al cliente a reportar nuevamente el corte con un
 * texto distinto según el motivo del cierre (casa cerrada o restablecido).
 */
export function ReabrirReporte({ caso }: ReabrirReporteProps) {
  const casaCerrada = caso.cierre === "casa_cerrada";
  const Icon = casaCerrada ? DoorClosed : Zap;

  const titulo = casaCerrada
    ? "El técnico llegó y no había nadie"
    : "¿Sigues sin suministro?";
  const texto = casaCerrada
    ? "Cerramos tu reporte porque no pudimos acceder al domicilio. Si sigues sin luz, reporta nuevamente el corte y asegúrate de que un adulto pueda recibir al técnico."
    : "Si la luz no volvió o se cortó otra vez después de nuestro trabajo, reporta nuevamente el corte para que un técnico vuelva a revisar.";

  return (
    <div className="flex flex-col gap-ch-md rounded-card border-2 border-warning bg-warning-soft p-ch-base">
      <div className="flex items-start gap-ch-md">
        <span
          aria-hidden
          className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-warning-tint text-warning"
        >
          <Icon className="size-5" strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-foreground">{titulo}</p>
          <p className="mt-1 text-base leading-relaxed text-foreground">{texto}</p>
        </div>
      </div>
      <Button size="lg" asChild>
        <a href="#">
          <img src="/icons/emergencia/reportarcorte.svg" alt="" className="size-5 brightness-0 invert" />
          Reportar corte
        </a>
      </Button>
    </div>
  );
}

export default ReabrirReporte;
