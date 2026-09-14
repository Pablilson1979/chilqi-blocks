import { Check, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { HITOS, indiceHito, type Caso } from "@/components/visita/content";

/**
 * Línea de hitos visible al cliente, con el mismo lenguaje visual del
 * seguimiento de reclamos de Chilquinta: círculo verde suave con check para
 * las etapas completadas, círculo naranjo con rayo para la etapa en curso y
 * círculo gris para las pendientes. El estado nunca se comunica solo con
 * color: cada hito lleva icono, título, detalle y una marca de tiempo.
 */
export function HitosVisita({ caso }: { caso: Caso }) {
  const actual = indiceHito(caso.hito);
  const cerrado = caso.hito === "cierre";

  return (
    <ol className="flex flex-col">
      {HITOS.map((hito, i) => {
        const hecho = i < actual || (cerrado && i === actual);
        const enCurso = i === actual && !cerrado;
        const fallido = hecho && hito.id === "cierre" && caso.cierre === "casa_cerrada";
        const ultimo = i === HITOS.length - 1;
        const titulo = fallido
          ? "Visita no realizada: domicilio cerrado"
          : hito.id === "cierre" && caso.cierre === "restablecido"
            ? "Suministro restablecido"
            : hito.titulo;
        const hora = caso.tiempos[hito.id];

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

            <span
              aria-hidden
              className={cn(
                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
                fallido
                  ? "bg-warning text-warning-foreground"
                  : hecho
                    ? "bg-success-soft text-success"
                    : enCurso
                      ? "bg-warning text-warning-foreground"
                      : "bg-muted text-muted-foreground",
              )}
            >
              {hecho ? (
                <Check className="size-5" strokeWidth={3} />
              ) : enCurso ? (
                <Zap className="size-5 fill-current" strokeWidth={2} />
              ) : (
                <span className="size-2.5 rounded-full bg-current opacity-70" />
              )}
            </span>

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
