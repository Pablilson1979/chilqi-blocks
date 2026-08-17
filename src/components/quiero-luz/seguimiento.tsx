import * as React from "react";
import { ExternalLink, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/chilquinta/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SEGUIMIENTO_CORTE, TU_CONEXION_URL } from "./data";

type Resultado = "nueva-plataforma" | "sistema-antiguo" | null;

/**
 * Seguimiento de solicitud. Deriva a Tu Conexión cuando la solicitud fue
 * ingresada en el sistema nuevo (correlativo alto o fecha posterior al corte).
 */
export function Seguimiento() {
  const [numero, setNumero] = React.useState("");
  const [periodo, setPeriodo] = React.useState<"antes" | "despues" | "">("");
  const [resultado, setResultado] = React.useState<Resultado>(null);

  const valido = numero.trim().length >= 4 && periodo !== "";

  function consultar() {
    const correlativo = Number(numero.replace(/\D/g, ""));
    const esNueva =
      periodo === "despues" || correlativo >= SEGUIMIENTO_CORTE.correlativoDesde;
    setResultado(esNueva ? "nueva-plataforma" : "sistema-antiguo");
  }

  return (
    <Card className="flex flex-col gap-5 p-6 lg:p-8">
      <div>
        <h2 className="text-lg font-bold text-foreground">Seguimiento de tu solicitud</h2>
        <p className="text-sm text-muted-foreground">
          Si ingresaste tu solicitud a partir del {SEGUIMIENTO_CORTE.fechaLabel}, el seguimiento se
          realiza directamente en la plataforma Tu Conexión.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <Field
          id="ql-solicitud"
          label="N° de solicitud"
          placeholder="Ej. 845321"
          inputMode="numeric"
          className="flex-1"
          value={numero}
          onChange={(e) => {
            setNumero(e.target.value);
            setResultado(null);
          }}
        />
        <Button disabled={!valido} onClick={consultar}>
          <Search />
          Consultar
        </Button>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold text-foreground">
          ¿Cuándo ingresaste tu solicitud?
        </legend>
        <RadioGroup
          value={periodo}
          onValueChange={(v) => {
            setPeriodo(v as "antes" | "despues");
            setResultado(null);
          }}
          className="flex flex-col gap-3 sm:flex-row sm:gap-6"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem id="periodo-antes" value="antes" />
            <Label htmlFor="periodo-antes" className="text-base font-normal">
              Antes del {SEGUIMIENTO_CORTE.fechaLabel}
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem id="periodo-despues" value="despues" />
            <Label htmlFor="periodo-despues" className="text-base font-normal">
              A partir del {SEGUIMIENTO_CORTE.fechaLabel}
            </Label>
          </div>
        </RadioGroup>
      </fieldset>

      {resultado === "nueva-plataforma" ? (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-input bg-info-soft p-4 text-sm text-foreground"
        >
          <p>
            Tu solicitud se gestiona en la plataforma Tu Conexión. Continúa el seguimiento con tu N°
            de solicitud <strong>{numero}</strong> ahí.
          </p>
          <Button variant="secondary" className="self-start" asChild>
            <a href={TU_CONEXION_URL} target="_blank" rel="noreferrer">
              Ir a Tu Conexión
              <ExternalLink />
            </a>
          </Button>
        </div>
      ) : null}

      {resultado === "sistema-antiguo" ? (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-input bg-success-soft p-4 text-sm text-foreground"
        >
          <p>
            La solicitud <strong>{numero}</strong> se encuentra en nuestro sistema de venta de
            servicios. Consulta su estado con tu N° de solicitud y RUT.
          </p>
          <Button variant="secondary" className="self-start" asChild>
            <a href={TU_CONEXION_URL} target="_blank" rel="noreferrer">
              Ver estado de mi solicitud
              <ExternalLink />
            </a>
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
