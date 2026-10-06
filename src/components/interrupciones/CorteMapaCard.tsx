import { ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { causaVisible, estadoETR, type Interrupcion } from "@/lib/interrupciones-data";
import { formatFechaRelativa, formatHora, haceCuanto, Tracker } from "./shared";

export default function CorteMapaCard({ i, onVerMapa }: { i: Interrupcion; onVerMapa?: (() => void) | undefined }) {
  const programada = i.tipo === "programado";
  const estado = estadoETR(i);
  const sectoresLista = (i.sectores.length > 0 ? i.sectores : [i.sector]).slice(0, 3);
  const principal = sectoresLista[0] ?? i.sector;
  const resto = sectoresLista.slice(1);

  return (
    <article className="min-w-0 overflow-hidden rounded-card border border-border bg-card">
      {/* Bloque A — Cuándo: la hora dominante */}
      <div className="p-ch-lg lg:p-ch-md lg:pb-ch-sm">
        <p className={`flex items-start gap-2 text-base font-bold uppercase ${programada ? "text-status-scheduled" : "text-primary"}`}>
          <span aria-hidden className="mt-1 size-3 shrink-0 rounded-full bg-current" />
          {programada ? "Desconexión programada" : "Corte no programado"}
        </p>
        <p className="mt-ch-sm text-base font-semibold uppercase text-muted-foreground">
          {programada ? "Fecha y horario" : "Reposición estimada"}
        </p>
        <p className="mt-0.5 break-words text-[28px] font-extrabold leading-tight text-foreground lg:text-2xl">
          {programada
            ? formatHora(i.inicio)
            : estado === "vigente"
              ? formatFechaRelativa(i.etr_max)
              : estado === "vencida"
                ? "Estamos recalculando la hora"
                : "Aún estamos evaluando el corte"}
        </p>
        {programada && <p className="mt-1 text-base text-foreground">Hasta {formatFechaRelativa(i.etr_max)}</p>}
        {!programada && estado !== "vigente" && (
          <p className="mt-1 text-base text-muted-foreground">Última actualización {haceCuanto(i.etr_updated_at)}</p>
        )}
      </div>

      {/* Bloque B — Dónde y por qué: alcance en segundo plano */}
      <div className="space-y-ch-sm border-t border-border p-ch-lg pt-ch-md lg:p-ch-md lg:pt-ch-sm">
        <p className="text-base text-muted-foreground">{causaVisible(i)}</p>
        <p className="text-base text-foreground">
          <span className="font-bold">{i.cant_clientes.toLocaleString("es-CL")}</span> clientes afectados
        </p>
        <div>
          <p className="text-base font-semibold uppercase text-muted-foreground">Sectores</p>
          <ul className="mt-1 space-y-0.5">
            <li className="flex items-start gap-2 text-base font-bold leading-snug text-foreground">
              <MapPin aria-hidden className={`mt-0.5 size-4 shrink-0 ${programada ? "text-status-scheduled" : "text-primary"}`} />
              <span className="min-w-0 break-words">{principal}</span>
            </li>
            {resto.map((s) => (
              <li key={s} className="pl-6 text-base leading-snug text-foreground">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!programada && (
        <div className="border-t border-border p-ch-lg lg:p-ch-md">
          <p className="mb-ch-sm text-base font-semibold uppercase text-muted-foreground">Estado de la reparación</p>
          <Tracker hitos={i.hitos} desktopCompact />
        </div>
      )}
      {onVerMapa && (
        <div className="flex justify-center px-ch-lg pb-ch-lg lg:px-ch-md lg:pb-ch-sm">
          <Button
            variant="secondary"
            className={`text-base ${programada ? "border-status-scheduled text-status-scheduled hover:bg-status-scheduled hover:text-info-foreground" : ""}`}
            onClick={onVerMapa}
          >
            Ver en el mapa <ChevronRight aria-hidden />
          </Button>
        </div>
      )}
    </article>
  );
}
