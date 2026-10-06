import { ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { causaVisible, estadoETR, type Interrupcion } from "@/lib/interrupciones-data";
import { formatFechaRelativa, formatHora, haceCuanto, Tracker } from "./shared";

export default function CorteMapaCard({ i, onVerMapa }: { i: Interrupcion; onVerMapa?: (() => void) | undefined }) {
  const programada = i.tipo === "programado";
  const estado = estadoETR(i);
  const sectoresLista = (i.sectores.length > 0 ? i.sectores : [i.sector]).slice(0, 3);

  return (
    <article className="@container min-w-0 overflow-hidden rounded-[15px] border border-border bg-card">
      {/* Bloque A — Cuándo: la hora dominante */}
      <div className="px-[22px] pb-9 pt-8">
        <p className={`flex items-start gap-2 text-lg font-bold uppercase leading-6 ${programada ? "text-status-scheduled" : "text-primary"}`}>
          <span aria-hidden className="mt-1 size-[15px] shrink-0 rounded-full bg-current" />
          {programada ? "Desconexión programada" : "Corte no programado"}
        </p>
        <p className="mt-6 text-base font-semibold uppercase leading-5 text-foreground">
          {programada ? "Fecha y horario" : "Reposición estimada"}
        </p>
        <p className={`mt-0.5 break-words font-extrabold leading-[1.15] text-foreground ${programada || estado === "vigente" ? "text-[32px] @min-[380px]:text-[42px]" : "text-[28px]"}`}>
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
        <p className="mt-2 text-base font-bold leading-snug text-foreground">
          {causaVisible(i)} - {i.cant_clientes.toLocaleString("es-CL")} clientes afectados
        </p>
        <div className="mt-6">
          <p className="text-base font-semibold uppercase leading-5 text-foreground">Sectores</p>
          <p className="mt-1.5 flex items-start gap-2 text-base font-bold leading-snug text-foreground">
            <MapPin aria-hidden className={`size-[19px] shrink-0 ${programada ? "text-status-scheduled" : "text-primary"}`} />
            <span className="min-w-0 break-words">{sectoresLista.join(", ")}</span>
          </p>
        </div>
      </div>

      {!programada && (
        <div className="border-t border-border px-[22px] pb-9 pt-10">
          <p className="mb-3 text-base font-semibold uppercase text-muted-foreground">Estado de la reparación</p>
          <Tracker hitos={i.hitos} mapReference />
        </div>
      )}
      {onVerMapa && (
        <div className="flex justify-center px-[22px] pb-8">
          <Button
            variant="secondary"
            className={`min-h-11 gap-1 border-2 px-6 text-base font-bold ${programada ? "border-status-scheduled text-status-scheduled hover:bg-status-scheduled hover:text-info-foreground" : ""}`}
            onClick={onVerMapa}
          >
            Ver en el mapa <ChevronRight aria-hidden />
          </Button>
        </div>
      )}
    </article>
  );
}
