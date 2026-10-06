import { ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { causaVisible, estadoETR, type Interrupcion } from "@/lib/interrupciones-data";
import { formatFechaRelativa, formatHora, haceCuanto, Tracker } from "./shared";

export default function CorteMapaCard({ i, onVerMapa }: { i: Interrupcion; onVerMapa?: (() => void) | undefined }) {
  const programada = i.tipo === "programado";
  const estado = estadoETR(i);
  return (
    <article className="min-w-0 overflow-hidden rounded-card border border-border bg-card">
      <div className="space-y-ch-lg p-ch-lg">
        <p className={`flex items-start gap-2 text-base font-bold uppercase ${programada ? "text-status-scheduled" : "text-primary"}`}>
          <span aria-hidden className="mt-1 size-3 shrink-0 rounded-full bg-current" />
          {programada ? "Desconexión programada" : "Corte no programado"}
        </p>
        <div>
          <p className="text-base font-semibold uppercase text-foreground">{programada ? "Fecha y horario" : "Reposición estimada"}</p>
          <p className="mt-1 break-words text-[28px] font-extrabold leading-tight text-foreground">
            {programada ? formatHora(i.inicio) : estado === "vigente" ? formatFechaRelativa(i.etr_max) : estado === "vencida" ? "Estamos recalculando la hora" : "Aún estamos evaluando el corte"}
          </p>
          {programada && <p className="mt-2 text-base font-semibold text-foreground">Hasta {formatFechaRelativa(i.etr_max)}</p>}
          {!programada && estado !== "vigente" && <p className="mt-2 text-base text-muted-foreground">Última actualización {haceCuanto(i.etr_updated_at)}</p>}
          <div className="mt-ch-md text-base font-bold leading-snug text-foreground">
            <p>{causaVisible(i)}</p>
            <p>{i.cant_clientes.toLocaleString("es-CL")} clientes afectados</p>
          </div>
        </div>
        <div>
          <p className="mb-2 text-base font-semibold uppercase text-foreground">Sectores</p>
          <p className="flex items-start gap-2 text-base font-bold leading-snug text-foreground">
            <MapPin aria-hidden className={`size-5 shrink-0 ${programada ? "text-status-scheduled" : "text-primary"}`} />
            <span className="min-w-0 break-words">{i.sector}</span>
          </p>
        </div>
      </div>
      {!programada && <div className="border-t border-border p-ch-lg">
        <p className="mb-ch-base text-base font-semibold uppercase text-muted-foreground">Estado de la reparación</p>
        <Tracker hitos={i.hitos} mapAppearance />
      </div>}
      {onVerMapa && <div className="flex justify-center px-ch-lg pb-ch-lg">
        <Button variant="secondary" className={`text-base ${programada ? "border-status-scheduled text-status-scheduled hover:bg-status-scheduled hover:text-info-foreground" : ""}`} onClick={onVerMapa}>
          Ver en el mapa <ChevronRight aria-hidden />
        </Button>
      </div>}
    </article>
  );
}