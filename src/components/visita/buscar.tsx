import * as React from "react";
import { HelpCircle, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/chilquinta/field";
import { CASOS } from "@/components/visita/content";

export interface BuscarVisitaProps {
  onBuscar: (valor: string) => void;
  error?: string | null;
}

/**
 * Ingreso al seguimiento: número de orden o número de cliente.
 * Un solo campo para bajar la carga cognitiva del paso de entrada.
 */
export function BuscarVisita({ onBuscar, error }: BuscarVisitaProps) {
  const [valor, setValor] = React.useState("");
  const [ayuda, setAyuda] = React.useState(false);
  const puede = valor.replace(/\D/g, "").length >= 6;

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-ch-lg">
      <section className="rounded-[1.5rem] bg-card p-ch-lg shadow-card sm:p-ch-xl">
        <div className="flex items-start gap-ch-md rounded-card bg-info-soft p-ch-base">
          <MapPin className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground">
            Sigue en línea el avance de tu visita técnica: en qué etapa va, dónde va el
            técnico y cuánto falta para reponer tu suministro.
          </p>
        </div>

        <form
          className="mt-ch-lg flex flex-col gap-ch-base"
          onSubmit={(e) => {
            e.preventDefault();
            if (puede) onBuscar(valor);
          }}
        >
          <div className="flex items-start gap-ch-sm">
            <Field
              id="orden"
              label="N° de orden o N° de cliente"
              placeholder="Ej: 11234412"
              inputMode="numeric"
              autoComplete="off"
              className="flex-1"
              value={valor}
              onChange={(e) => setValor(e.target.value.replace(/\D/g, "").slice(0, 10))}
              state={error ? "error" : "default"}
              message={
                error ??
                "Puedes usar cualquiera de los dos: solo números, sin puntos ni guion."
              }
            />
            <button
              type="button"
              aria-label="¿Dónde encuentro estos números?"
              aria-expanded={ayuda}
              onClick={() => setAyuda((v) => !v)}
              className="mt-[30px] flex size-11 shrink-0 items-center justify-center rounded-full bg-info/10 text-info transition-colors hover:bg-info/20"
            >
              <HelpCircle className="size-5" aria-hidden />
            </button>
          </div>

          {ayuda ? (
            <div className="rounded-card bg-muted p-ch-md text-sm leading-relaxed text-foreground">
              <p>
                <span className="font-bold">N° de orden (8 dígitos):</span> llega en el
                mensaje que recibes al reportar tu corte por la web, WhatsApp o teléfono.
              </p>
              <p className="mt-ch-sm">
                <span className="font-bold">N° de cliente (7 dígitos):</span> aparece en la
                parte superior de tu boleta, sin el dígito verificador.
              </p>
              <p className="mt-ch-sm">
                Con cualquiera de los dos puedes consultar el estado de tu visita.
              </p>
            </div>
          ) : null}

          <Button type="submit" size="lg" disabled={!puede} className="w-full">
            <Search aria-hidden />
            Ver estado de mi visita
          </Button>
        </form>
      </section>

      <section className="rounded-card bg-muted/40 p-ch-base">
        <p className="text-sm font-bold text-foreground">Ejemplos para probar la maqueta</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Cada número muestra un estado distinto de la funcionalidad.
        </p>
        <ul className="mt-ch-sm flex flex-col gap-2">
          {[...CASOS].sort((a, b) => (a.orden === "20455301" ? -1 : b.orden === "20455301" ? 1 : 0)).map((c) => (
            <li key={c.orden}>
              <button
                type="button"
                onClick={() => onBuscar(c.orden)}
                className="ch-touch flex w-full items-center justify-between gap-ch-md rounded-card border border-border-strong bg-surface px-4 py-3 text-left transition-colors hover:border-primary"
              >
                <span className="text-sm font-semibold text-foreground">{c.orden}</span>
                <span className="text-sm text-muted-foreground">{c.ejemplo}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default BuscarVisita;
