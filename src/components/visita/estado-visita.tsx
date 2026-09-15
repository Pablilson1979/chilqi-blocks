import * as React from "react";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  Clock,
  MapPin,
  PhoneCall,
  RefreshCw,
  Star,
  Truck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/chilquinta/status-message";
import { HitosVisita } from "@/components/visita/hitos-visita";
import { MapaMovil } from "@/components/visita/mapa-movil";
import type { Caso } from "@/components/visita/content";

/**
 * Titular y tiempo destacado según el hito en curso. La etiqueta distingue
 * siempre entre "cuándo llega el móvil" y "cuándo vuelve la luz", y aclara el
 * estado de la estimación: confirmada, ajustada o aún no disponible.
 */
function destacado(caso: Caso) {
  const nota =
    caso.etrEstado === "confirmado"
      ? "Confirmada por el equipo en terreno"
      : caso.etrEstado === "ajustado"
        ? "Ajustada respecto de la anterior"
        : "Referencial, puede cambiar";

  if (caso.noDisponible) {
    return {
      titulo: "Seguimiento no disponible",
      dato: null as string | null,
      sub: null as string | null,
      nota: null as string | null,
    };
  }
  if (caso.suspension) {
    return {
      titulo: "Trabajo suspendido temporalmente",
      dato: caso.ventana ?? null,
      sub: "Nueva ventana estimada de atención",
      nota,
    };
  }
  if (caso.hito === "cierre") {
    return caso.cierre === "casa_cerrada"
      ? { titulo: "No pudimos realizar la visita", dato: null, sub: null, nota: null }
      : {
          titulo: "Tu suministro fue restablecido",
          dato: caso.tiempos.cierre ?? null,
          sub: "Hora en que volvió la luz",
          nota: null,
        };
  }
  if (caso.hito === "trabajando") {
    return {
      titulo: "Trabajando en la reposición",
      dato: caso.etr ?? null,
      sub: "Cuánto falta para que vuelva la luz",
      nota,
    };
  }
  if (caso.hito === "en_lugar") {
    return {
      titulo: "El técnico está en el lugar",
      dato: caso.etr ?? null,
      sub: "Cuánto falta para que vuelva la luz",
      nota: caso.etr ? nota : "Calculando tiempo de reparación",
    };
  }
  if (caso.hito === "en_camino") {
    return {
      titulo: "El móvil va en camino",
      dato: caso.etr ?? null,
      sub: "Cuánto falta para que llegue el móvil",
      nota,
    };
  }
  return {
    titulo: "Tu solicitud está validada",
    dato: caso.ventana ?? null,
    sub: "Cuándo estimamos que llegue el móvil",
    nota: caso.ventana ? nota : "Aún no tenemos una hora estimada de llegada",
  };
}

export interface EstadoVisitaProps {
  caso: Caso;
  onVolver: () => void;
}

export function EstadoVisita({ caso, onVolver }: EstadoVisitaProps) {
  const [avisos, setAvisos] = React.useState(true);
  const [sinLuz, setSinLuz] = React.useState(false);
  const [voto, setVoto] = React.useState<number | null>(null);
  const info = destacado(caso);
  const mostrarMapa = Boolean(caso.movil) && !caso.noDisponible && caso.hito !== "cierre";

  return (
    <div className="flex flex-col gap-ch-lg">
      {/* Encabezado destacado: lo que el cliente vino a buscar */}
      <section className="overflow-hidden rounded-[1.5rem] bg-card shadow-card">
        <div className="flex flex-col gap-ch-base p-ch-lg sm:p-ch-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Orden N° {caso.orden}
            </p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground lg:text-3xl">
              {info.titulo}
            </h1>
            <p className="mt-ch-sm flex items-start gap-2 text-sm font-semibold text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {caso.direccion}, {caso.comuna}
              </span>
            </p>
          </div>

          {info.dato ? (
            <div className="shrink-0 rounded-card bg-primary-soft px-ch-lg py-ch-base text-center lg:min-w-[260px]">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground">
                {info.sub}
              </p>
              <p className="mt-1 flex items-center justify-center gap-2 text-2xl font-bold text-primary lg:text-3xl">
                <Clock className="size-6" aria-hidden />
                {info.dato}
              </p>
              {info.nota ? (
                <p className="mt-ch-sm text-xs font-semibold leading-relaxed text-foreground">
                  {info.nota}
                </p>
              ) : null}
            </div>
          ) : info.nota ? (
            <div className="shrink-0 rounded-card bg-muted/60 px-ch-lg py-ch-base text-center lg:min-w-[260px]">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground">
                {info.sub ?? "Tiempo estimado"}
              </p>
              <p className="mt-1 text-base font-bold leading-snug text-foreground">
                {info.nota}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {caso.noDisponible ? (
        <>
          <StatusMessage
            tone="info"
            title="Este corte no tiene seguimiento en línea"
            description={caso.noDisponible}
          />
          <div className="flex flex-wrap gap-ch-md">
            <Button size="lg" asChild>
              <a href="tel:6006005000">
                <PhoneCall aria-hidden />
                Llamar al 600 600 5000
              </a>
            </Button>
            <Button variant="secondary" size="lg" onClick={onVolver}>
              Consultar otra orden
            </Button>
          </div>
        </>
      ) : (
        <div className="grid items-start gap-ch-lg lg:grid-cols-[minmax(0,1fr)_440px]">
          {/* Columna principal: avance */}
          <section className="rounded-[1.5rem] bg-card p-ch-lg shadow-card sm:p-ch-xl lg:mr-[100px]">
            <h2 className="text-lg font-bold text-foreground">Avance de tu visita</h2>
            <p className="mb-ch-lg mt-1 text-sm text-muted-foreground">
              Actualizamos cada etapa a medida que ocurre en terreno.
            </p>
            <HitosVisita caso={caso} />
          </section>

          {/* Columna lateral: el mapa primero, con protagonismo */}
          <div className="flex flex-col gap-ch-lg">
            {mostrarMapa && caso.movil ? (
              <section className="overflow-hidden rounded-[1.5rem] bg-card shadow-card">
                <h2 className="mb-ch-md flex items-center gap-2 px-ch-base pt-ch-base text-base font-bold text-foreground">
                  <Truck className="size-5 text-primary" aria-hidden />
                  {caso.movil.nombre} · patente {caso.movil.patente}
                </h2>
                <MapaMovil
                  movil={caso.movil}
                  direccion={caso.direccion}
                  actualizado={caso.ubicacionActualizada}
                />
              </section>
            ) : null}

            {caso.hito === "en_camino" ? (
              <StatusMessage
                tone="warning"
                title="Que alguien mayor de edad reciba al técnico"
                description="El técnico necesita acceso al medidor y contacto en el domicilio. Mantén el teléfono a mano: si al llegar no hay nadie, la visita se cierra sin reposición y tendrás que reagendarla."
              />
            ) : null}

            {caso.suspension ? (
              <StatusMessage
                tone="warning"
                title="Trabajo suspendido"
                description={caso.suspension}
              />
            ) : null}

            {caso.reasignado ? (
              <StatusMessage
                tone="info"
                title="Tu ventana se ajustó"
                description="Atendimos primero una emergencia de mayor prioridad en el sector, por eso tu horario estimado se corrió. Tu orden mantiene su lugar en la cola."
              />
            ) : null}


            {caso.hito === "espera" && caso.enCola ? (
              <section className="rounded-card bg-muted/40 p-ch-base">
                <p className="text-sm font-bold text-foreground">
                  {caso.enCola} {caso.enCola === 1 ? "orden" : "órdenes"} antes de la tuya
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  La ventana estimada considera el trabajo pendiente de la cuadrilla y los
                  tiempos de traslado.
                </p>
              </section>
            ) : null}

            {caso.cierre === "casa_cerrada" ? (
              <>
                <StatusMessage
                  tone="warning"
                  title="El técnico llegó y no había nadie"
                  description="Por normativa, el técnico debe verificar la dirección en terreno. Al no poder acceder, la orden se cerró sin reposición y la visita debe reagendarse."
                />
                <Button size="lg">
                  <CalendarClock aria-hidden />
                  Reagendar mi visita
                </Button>
              </>
            ) : null}

            {caso.cierre === "restablecido" ? (
              <section className="rounded-[1.5rem] bg-card p-ch-lg shadow-card">
                <h2 className="text-base font-bold text-foreground">
                  ¿Cómo evalúas esta atención?
                </h2>
                <div className="mt-ch-md flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} de 5`}
                      onClick={() => setVoto(n)}
                      className="ch-touch flex items-center justify-center rounded-full"
                    >
                      <Star
                        className={cn(
                          "size-8",
                          voto !== null && n <= voto
                            ? "fill-warning text-warning"
                            : "text-border-strong",
                        )}
                        aria-hidden
                      />
                    </button>
                  ))}
                </div>
                {voto ? (
                  <p className="mt-ch-md text-sm font-semibold text-success">
                    Gracias, registramos tu evaluación.
                  </p>
                ) : null}
              </section>
            ) : null}

            <section className="rounded-[1.5rem] bg-card p-ch-lg shadow-card">
              <h2 className="text-base font-bold text-foreground">¿Necesitas algo más?</h2>
              <div className="mt-ch-md flex flex-col gap-ch-md">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setSinLuz(true)}
                  disabled={sinLuz}
                >
                  <AlertTriangle aria-hidden />
                  Sigo sin suministro
                </Button>
                {sinLuz ? (
                  <p className="text-sm font-semibold text-success">
                    Recibimos tu aviso. Revisaremos tu caso y volveremos a evaluar la orden.
                  </p>
                ) : null}

                <label className="flex cursor-pointer items-start gap-ch-md rounded-card bg-muted/40 p-ch-base">
                  <input
                    type="checkbox"
                    checked={avisos}
                    onChange={(e) => setAvisos(e.target.checked)}
                    className="mt-0.5 size-5 shrink-0 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    <span className="flex items-center gap-2 font-bold">
                      <BellRing className="size-4 text-primary" aria-hidden />
                      Avisarme cuando cambie de etapa
                    </span>
                    Te enviaremos un mensaje al llegar el móvil y al restablecer el
                    suministro.
                  </span>
                </label>

                <Button variant="tertiary" size="lg" onClick={onVolver}>
                  <RefreshCw aria-hidden />
                  Consultar otra orden
                </Button>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default EstadoVisita;
