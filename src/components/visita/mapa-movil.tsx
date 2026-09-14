import { Home } from "lucide-react";

import camionetaAsset from "@/assets/camioneta.png.asset.json";
import type { Movil } from "@/components/visita/content";

/**
 * Posición del móvil sobre la dirección georreferenciada de la solicitud.
 * No se dibuja trazado de ruta: el sistema de origen solo entrega el punto.
 */
export function MapaMovil({
  movil,
  direccion,
  actualizado,
}: {
  movil: Movil;
  direccion: string;
  actualizado?: string | undefined;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-muted">
      <div
        className="relative h-56 w-full sm:h-64"
        role="img"
        aria-label={`Posición aproximada del ${movil.nombre} respecto de ${direccion}`}
      >
        {/* Cartografía real de la Quinta Región (prototipo, sin interacción) */}
        <iframe
          title="Mapa de la Quinta Región"
          aria-hidden
          tabIndex={-1}
          loading="lazy"
          className="pointer-events-none absolute inset-0 size-full border-0"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-71.6600%2C-33.1050%2C-71.4700%2C-32.9600&layer=mapnik"
        />


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
          <span className="relative flex items-center justify-center">
            <span className="absolute inline-flex size-14 animate-ping rounded-full bg-info/30" />
            <img
              src={camionetaAsset.url}
              alt=""
              aria-hidden
              className="relative w-20 drop-shadow-md sm:w-24"
            />
          </span>
          <span className="mt-1 rounded-pill bg-surface px-2 py-0.5 text-xs font-bold text-foreground shadow-card">
            {movil.patente}
          </span>
        </span>
      </div>
      <p className="border-t border-border bg-surface px-ch-base py-ch-sm text-xs leading-relaxed text-muted-foreground">
        {actualizado
          ? `Última posición registrada a las ${actualizado}. Mostramos el punto del móvil, no su ruta.`
          : "Mostramos la posición del móvil, no su ruta. Se actualiza cada pocos minutos."}
      </p>
    </div>
  );
}

export default MapaMovil;
