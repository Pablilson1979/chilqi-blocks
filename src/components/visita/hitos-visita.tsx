import { Check, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { HITOS, type Caso } from "@/components/visita/content";

/**
 * Línea de hitos visible al cliente, con el mismo lenguaje visual del
 * seguimiento de reclamos de Chilquinta: círculo verde suave con check para
 * las etapas completadas, círculo naranjo con rayo para la etapa en curso y
 * círculo gris para las pendientes. El estado nunca se comunica solo con
 * color: cada hito lleva icono, título, detalle y una marca de tiempo.
 */
export function HitosVisita({ caso }: { caso: Caso }) {
  // En cierres por domicilio cerrado no hubo reparación: se omite esa etapa.
  const hitos =
    caso.cierre === "casa_cerrada"
      ? HITOS.filter((h) => h.id !== "trabajando")
      : HITOS;
  const actual = hitos.findIndex((h) => h.id === caso.hito);
  const cerrado = caso.hito === "cierre";

  return (
    <ol className="flex flex-col">
      {hitos.map((hito, i) => {
        const hecho = i < actual || (cerrado && i === actual);
        const enCurso = i === actual && !cerrado;
        const fallido = hecho && hito.id === "cierre" && caso.cierre === "casa_cerrada";
        const ultimo = i === hitos.length - 1;
        const titulo = fallido
          ? "Visita no realizada: domicilio cerrado"
          : hito.titulo;
        const hora = caso.tiempos[hito.id];

        // ETR visible desde el paso 2 en adelante: ventana de ruta en espera,
        // llegada estimada en camino y reposición estimada en el lugar y en
        // reparación.
        const etrChip = !enCurso
          ? null
          : hito.id === "espera"
            ? caso.ventana
              ? `Tu técnico irá en ruta entre ${caso.ventana}`
              : null
            : hito.id === "en_camino"
              ? caso.etr
                ? `Llegada estimada: ${caso.etr}`
                : null
              : hito.id === "en_lugar" || hito.id === "trabajando"
                ? caso.etr
                  ? `Reposición estimada: ${caso.etr}`
                  : null
                : null;

        return (
          <li key={hito.id} className="relative flex gap-ch-base">
            {/* Conector vertical */}
            {!ultimo ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-5 top-10 bottom-0 w-0.5 -translate-x-1/2",
                  i < actual ? "bg-success" : "bg-border",
                )}
              />
            ) : null}

            {enCurso ? (
              <img
                src="/icons/hito-activo.svg"
                alt=""
                aria-hidden
                className="relative z-10 size-10 shrink-0"
              />
            ) : (
              <span
                aria-hidden
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
                  fallido
                    ? "bg-warning text-warning-foreground"
                    : hecho
                      ? "bg-success-soft text-success"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {hecho ? (
                  <Check className="size-5" strokeWidth={3} />
                ) : (
                  <span className="size-2.5 rounded-full bg-current opacity-70" />
                )}
              </span>
            )}

            <div className={cn("min-w-0 pb-ch-lg", ultimo && "pb-0")}>
              <p
                className={cn(
                  "text-base font-bold leading-snug",
                  hecho || enCurso ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {titulo}
              </p>
              <p className="mt-0.5 max-w-prose text-sm leading-relaxed text-muted-foreground">
                {hito.detalle}
              </p>

              {etrChip ? (
                <p className="mt-ch-sm inline-flex items-center gap-2 rounded-pill bg-warning-soft px-3 py-1.5 text-sm font-bold text-foreground">
                  <Clock className="size-4" aria-hidden />
                  {etrChip}
                </p>
              ) : null}

              {hora ? (
                <p
                  className={cn(
                    "mt-ch-sm inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-sm font-bold",
                    fallido
                      ? "bg-warning-soft text-foreground"
                      : hecho
                        ? "bg-success-soft text-success"
                        : "bg-warning-soft text-foreground",
                  )}
                >
                  {hecho && !fallido ? (
                    <Check className="size-4" strokeWidth={3} aria-hidden />
                  ) : null}
                  {enCurso ? "En curso desde " : hecho ? "Completado " : ""}
                  {hora}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default HitosVisita;
