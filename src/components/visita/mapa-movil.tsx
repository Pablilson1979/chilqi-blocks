import { Home, Truck } from "lucide-react";

import type { Movil } from "@/components/visita/content";

/**
 * Posición del móvil sobre la dirección georreferenciada de la solicitud.
 * No se dibuja trazado de ruta: el sistema de origen solo entrega el punto.
 */
export function MapaMovil({ movil, direccion }: { movil: Movil; direccion: string }) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-muted">
      <div
        className="relative h-56 w-full sm:h-64"
        role="img"
        aria-label={`Posición aproximada del ${movil.nombre} respecto de ${direccion}`}
      >
        {/* Trama de calles referencial */}
        <svg className="absolute inset-0 size-full" aria-hidden>
          <defs>
            <pattern id="calles" width="48" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M48 0H0v48"
                fill="none"
                className="stroke-border"
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calles)" />
        </svg>

        {/* Domicilio */}
        <span
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: "72%", top: "34%" }}
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card">
            <Home className="size-5" aria-hidden />
          </span>
          <span className="mt-1 rounded-pill bg-surface px-2 py-0.5 text-xs font-bold text-foreground shadow-card">
            Tu domicilio
          </span>
        </span>

        {/* Móvil */}
        <span
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${movil.x}%`, top: `${movil.y}%` }}
        >
          <span className="relative flex size-11 items-center justify-center rounded-full bg-info text-info-foreground shadow-card">
            <span className="absolute inline-flex size-11 animate-ping rounded-full bg-info/40" />
            <Truck className="size-5" aria-hidden />
          </span>
          <span className="mt-1 rounded-pill bg-surface px-2 py-0.5 text-xs font-bold text-foreground shadow-card">
            {movil.patente}
          </span>
        </span>
      </div>
      <p className="border-t border-border bg-surface px-ch-base py-ch-sm text-xs leading-relaxed text-muted-foreground">
        Mostramos la posición del móvil, no su ruta. Se actualiza cada pocos minutos.
      </p>
    </div>
  );
}

export default MapaMovil;
