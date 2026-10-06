import { ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { causaVisible, estadoETR, type Interrupcion } from "@/lib/interrupciones-data";
import { formatFechaRelativa, formatHora, haceCuanto, Tracker } from "./shared";

const LABEL = "text-[12px] font-bold uppercase leading-4 tracking-[0.8px] text-foreground";

export default function CorteMapaCard({ i, onVerMapa }: { i: Interrupcion; onVerMapa?: (() => void) | undefined }) {
  const programada = i.tipo === "programado";
  const estado = estadoETR(i);
  const sectoresLista = (i.sectores.length > 0 ? i.sectores : [i.sector]).slice(0, 3);
  const grande = programada || estado === "vigente";

  return (
    <article className="@container min-w-0 overflow-hidden rounded-[15px] border border-border bg-card">
      <div className="px-[22.6px] pb-6 pt-6">
        <p className={`flex items-center gap-2 text-[12px] font-bold uppercase leading-4 tracking-[0.36px] ${programada ? "text-status-scheduled" : "text-primary"}`}>
          <span aria-hidden className="size-[15px] shrink-0 rounded-full bg-current" />
          {programada ? "Desconexión programada" : "Corte no programado"}
        </p>

        <p className={`mt-6 ${LABEL}`}>{programada ? "Fecha y horario" : "Reposición estimada"}</p>
        <p className={`mt-1 break-words text-foreground ${grande ? "font-extrabold text-[34px] leading-[42px] @min-[380px]:text-[42px] @min-[380px]:leading-[51px]" : "font-bold text-[28px] leading-[34px]"}`}>
          {programada
            ? formatHora(i.inicio)
            : estado === "vigente"
              ? formatFechaRelativa(i.etr_max)
              : estado === "vencida"
                ? "Estamos recalculando la hora"
                : "Aún estamos evaluando el corte"}
        </p>
        {programada && <p className="mt-1 text-[12px] font-semibold text-foreground">Hasta {formatFechaRelativa(i.etr_max)}</p>}
        {!programada && estado !== "vigente" && (
          <p className="mt-1 text-[12px] font-semibold text-muted-foreground">Última actualización {haceCuanto(i.etr_updated_at)}</p>
        )}
        <p className="mt-2 text-base font-bold leading-5 text-foreground">
          {causaVisible(i)} - <span className="font-extrabold">{i.cant_clientes.toLocaleString("es-CL")}</span> clientes afectados
        </p>

        <p className={`mt-6 ${LABEL}`}>Sectores</p>
        <p className="mt-2 flex items-start gap-1.5 text-base font-bold leading-5 text-foreground">
          <MapPin aria-hidden className={`size-5 shrink-0 ${programada ? "text-status-scheduled" : "text-primary"}`} />
          <span className="min-w-0 break-words">{sectoresLista.join(", ")}</span>
        </p>
      </div>

      {!programada && (
        <div className="border-t border-border px-[22.6px] pb-6 pt-6">
          <p className={`mb-4 ${LABEL}`}>Estado de la reparación</p>
          <Tracker hitos={i.hitos} mapReference />
        </div>
      )}
      {onVerMapa && (
        <div className="flex justify-center px-[22.6px] pb-6">
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
