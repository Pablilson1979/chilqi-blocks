import * as React from "react";
import { Check, Clock, ExternalLink, History, Info, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/chilquinta/field";
import {
  SEGUIMIENTO_CORTE,
  SOLICITUDES_DEMO,
  TU_CONEXION_URL,
  buscarSolicitud,
  type SolicitudDemo,
} from "./content";

/**
 * Seguimiento simple: con el número de solicitud identificamos si se gestiona
 * en Tu Conexión (sistema nuevo) o en el sistema anterior.
 */
export function Seguimiento() {
  const [numero, setNumero] = React.useState("");
  const [consulta, setConsulta] = React.useState<SolicitudDemo | null>(null);

  const valido = numero.replace(/\D/g, "").length >= 4;

  function consultar(valor = numero) {
    const resultado = buscarSolicitud(valor);
    setConsulta(resultado === "no-encontrada" ? null : resultado);
  }

  function probar(demo: SolicitudDemo) {
    setNumero(demo.numero);
    consultar(demo.numero);
  }

  return (
    <div className="flex flex-col gap-ch-xl">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-card bg-info-soft text-info">
          <History className="size-6" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
            Seguimiento
          </p>
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
            Revisa dónde se gestiona tu solicitud
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Ingresa el número recibido al finalizar el trámite. Identificaremos la plataforma
            correspondiente.
          </p>
        </div>
      </div>

      <div className="grid items-start gap-ch-lg lg:grid-cols-2">
        <Card className="flex flex-col gap-4 p-6 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field
              id="ql-seguimiento"
              label="Número de solicitud"
              placeholder="Ej. 123456"
              inputMode="numeric"
              className="flex-1"
              value={numero}
              onChange={(e) => {
                setNumero(e.target.value);
                setConsulta(null);
              }}
            />
            <Button disabled={!valido} onClick={() => consultar()}>
              <Search />
              Consultar estado
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Si ingresaste tu solicitud a partir del {SEGUIMIENTO_CORTE.fechaLabel}, el seguimiento se
            realiza en Tu Conexión.
          </p>
          <div className="flex flex-col gap-2 border-t pt-4">
            <p className="text-sm font-bold text-foreground">Probar con un ejemplo</p>
            <div className="flex flex-wrap gap-2">
              {SOLICITUDES_DEMO.map((demo) => (
                <button
                  key={demo.numero}
                  type="button"
                  onClick={() => probar(demo)}
                  className="ch-touch rounded-pill border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {demo.numero} ·{" "}
                  {demo.plataforma === "nueva" ? "en Tu Conexión" : "sistema anterior"}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {consulta ? (
          <Card className="flex flex-col gap-4 p-6 lg:p-8">
            <span className="self-start rounded-pill bg-info-soft px-3 py-1 text-sm font-bold text-info">
              {consulta.plataforma === "nueva" ? "Tu Conexión" : "Sistema anterior"}
            </span>
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              {consulta.plataforma === "nueva"
                ? consulta.etapaActual
                : "Solicitud del sistema anterior"}
            </h2>
            <p className="text-muted-foreground">{consulta.siguientePaso}</p>
            <dl className="grid gap-4 gap-x-8 border-t pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">Número de solicitud</dt>
                <dd className="text-base font-bold text-foreground">{consulta.numero}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Fecha de ingreso</dt>
                <dd className="text-base font-bold text-foreground">{consulta.ingreso}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Requerimiento</dt>
                <dd className="text-base font-bold text-foreground">{consulta.tipo}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Dirección</dt>
                <dd className="text-base font-bold text-foreground">{consulta.direccion}</dd>
              </div>
            </dl>

            {consulta.etapas.length ? (
              <ol className="flex flex-col gap-3 border-t pt-4">
                {consulta.etapas.map((etapa) => (
                  <li key={etapa.titulo} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={
                        etapa.estado === "completada"
                          ? "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-success/20 text-success"
                          : etapa.estado === "en-curso"
                            ? "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-info-soft text-info"
                            : "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                      }
                    >
                      {etapa.estado === "completada" ? (
                        <Check className="size-4" strokeWidth={3} />
                      ) : (
                        <Clock className="size-4" />
                      )}
                    </span>
                    <div>
                      <p className="text-base font-bold text-foreground">
                        {etapa.titulo}
                        <span className="ml-2 text-sm font-bold text-muted-foreground">
                          {etapa.estado === "completada"
                            ? "Completada"
                            : etapa.estado === "en-curso"
                              ? "En curso"
                              : "Pendiente"}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">{etapa.detalle}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex items-start gap-3 rounded-card bg-info-soft p-4">
                <Info className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
                <p className="text-sm text-muted-foreground">
                  El detalle por etapas sólo está disponible para solicitudes ingresadas en Tu
                  Conexión.
                </p>
              </div>
            )}

            <Button asChild className="self-start">
              <a href={TU_CONEXION_URL} target="_blank" rel="noreferrer">
                {consulta.plataforma === "nueva"
                  ? "Continuar en Tu Conexión"
                  : "Ir a la plataforma anterior"}
                <ExternalLink />
              </a>
            </Button>
          </Card>
        ) : (
          <div className="flex items-start gap-3 rounded-card bg-info-soft p-4">
            <Info className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Ingresa tu número de solicitud para saber en qué plataforma continuar el seguimiento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
