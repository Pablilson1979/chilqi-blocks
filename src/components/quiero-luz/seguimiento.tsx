import * as React from "react";
import { ExternalLink, History, Info, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/chilquinta/field";
import { SEGUIMIENTO_CORTE, TU_CONEXION_URL } from "./content";

type Consulta = { numero: string; nueva: boolean } | null;

/**
 * Seguimiento simple: con el número de solicitud identificamos si se gestiona
 * en Tu Conexión (sistema nuevo) o en el sistema anterior.
 */
export function Seguimiento() {
  const [numero, setNumero] = React.useState("");
  const [consulta, setConsulta] = React.useState<Consulta>(null);

  const valido = numero.replace(/\D/g, "").length >= 4;

  function consultar() {
    const correlativo = Number(numero.replace(/\D/g, ""));
    setConsulta({ numero: numero.trim(), nueva: correlativo >= SEGUIMIENTO_CORTE.correlativoDesde });
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
            <Button disabled={!valido} onClick={consultar}>
              <Search />
              Consultar estado
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Si ingresaste tu solicitud a partir del {SEGUIMIENTO_CORTE.fechaLabel}, el seguimiento se
            realiza en Tu Conexión.
          </p>
        </Card>

        {consulta ? (
          <Card className="flex flex-col gap-4 p-6 lg:p-8">
            <span className="self-start rounded-pill bg-info-soft px-3 py-1 text-sm font-bold text-info">
              {consulta.nueva ? "Tu Conexión" : "Sistema anterior"}
            </span>
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              {consulta.nueva
                ? "Esta solicitud se gestiona en la nueva plataforma"
                : "Solicitud del sistema anterior"}
            </h2>
            <p className="text-muted-foreground">
              {consulta.nueva
                ? "Ingresa a Tu Conexión para revisar su avance, corregir antecedentes o continuar con la siguiente etapa."
                : "Encontramos una solicitud gestionada mediante el sistema anterior de venta de servicios."}
            </p>
            <dl className="grid gap-x-8 border-t pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">Número de solicitud</dt>
                <dd className="text-base font-bold text-foreground">{consulta.numero}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Plataforma</dt>
                <dd className="text-base font-bold text-foreground">
                  {consulta.nueva ? "Tu Conexión" : "Venta de servicios"}
                </dd>
              </div>
            </dl>
            <Button asChild className="self-start">
              <a href={TU_CONEXION_URL} target="_blank" rel="noreferrer">
                {consulta.nueva ? "Ir al seguimiento en Tu Conexión" : "Ver estado de mi solicitud"}
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
