import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { HITOS, indiceHito, type Caso } from "@/components/visita/content";

/**
 * Línea de hitos visible al cliente. Verde = recorrido, ámbar = en curso,
 * gris = pendiente. El estado nunca se comunica solo con color: cada hito
 * lleva icono, título y hora.
 */
export function HitosVisita({ caso }: { caso: Caso }) {
  const actual = indiceHito(caso.hito);
  const cerrado = caso.hito === "cierre";

  return (
    <ol className="flex flex-col">
      {HITOS.map((hito, i) => {
        const hecho = i < actual || (cerrado && i === actual);
        const enCurso = i === actual && !cerrado;
        const titulo =
          hito.id === "cierre" && caso.cierre === "casa_cerrada"
            ? "Visita no realizada: domicilio cerrado"
            : hito.id === "cierre" && caso.cierre === "restablecido"
              ? "Suministro restablecido"
              : hito.titulo;

        return (
          <li key={hito.id} className="flex gap-ch-base">
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2",
                  hecho && caso.cierre === "casa_cerrada" && hito.id === "cierre"
                    ? "border-warning bg-warning text-warning-foreground"
                    : hecho
                      ? "border-success bg-success text-success-foreground"
                      : enCurso
                        ? "border-warning bg-warning-soft text-warning"
                        : "border-border bg-muted text-muted-foreground",
                )}
              >
                {hecho ? (
                  <Check className="size-5" strokeWidth={3} />
                ) : enCurso ? (
                  <Loader2 className="size-5 animate-spin" strokeWidth={3} />
                ) : (
                  <span className="size-2.5 rounded-full bg-current" />
                )}
              </span>
              {i < HITOS.length - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    "my-1 w-0.5 flex-1",
                    i < actual ? "bg-success" : "bg-border",
                  )}
                />
              ) : null}
            </div>

            <div className={cn("pb-ch-lg", i === HITOS.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "text-base font-bold",
                  hecho || enCurso ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {titulo}
                {enCurso ? (
                  <span className="ml-2 rounded-pill bg-warning-soft px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-foreground">
                    en curso
                  </span>
                ) : null}
              </p>
              {caso.tiempos[hito.id] ? (
                <p className="text-sm font-semibold text-muted-foreground">
                  {caso.tiempos[hito.id]}
                </p>
              ) : null}
              {enCurso ? (
                <p className="mt-1 max-w-prose text-sm leading-relaxed text-foreground">
                  {hito.detalle}
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
