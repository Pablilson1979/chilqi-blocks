import * as React from "react";
import { HelpCircle, Lock, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/chilquinta/field";

/** Formatea el RUT a 12345678-9 mientras se escribe. */
function formatRut(value: string) {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
  if (clean.length <= 1) return clean;
  return `${clean.slice(0, -1)}-${clean.slice(-1)}`;
}

function rutValido(rut: string) {
  const clean = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  return clean.length >= 8 && clean.length <= 9;
}

export interface IngresoDatosCardProps {
  /** Nombre del trámite al que se accede, para dar contexto. */
  servicio: string;
  className?: string;
}

/**
 * Verificación de identidad previa a un trámite (boletas, convenio de pago).
 * Estructura del flujo actual, rediseñada con los tokens del DS 4.0.
 */
export function IngresoDatosCard({ servicio, className }: IngresoDatosCardProps) {
  const [rut, setRut] = React.useState("");
  const [cliente, setCliente] = React.useState("");
  const [ayuda, setAyuda] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);

  const rutOk = rutValido(rut);
  const clienteOk = cliente.trim().length >= 5;
  const puedeEnviar = rutOk && clienteOk;

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-[520px] rounded-[1.5rem] bg-card p-ch-lg shadow-card sm:p-ch-xl",
        className,
      )}
    >
      <div className="flex items-start gap-ch-md rounded-card bg-info-soft p-ch-base">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
        <p className="text-sm leading-relaxed text-foreground">
          <strong className="font-bold">Tus datos están protegidos.</strong> Solo los usaremos para
          identificar tu suministro.
        </p>
      </div>

      <form
        className="mt-ch-lg flex flex-col gap-ch-base"
        onSubmit={(e) => {
          e.preventDefault();
          if (puedeEnviar) setEnviado(true);
        }}
      >
        <Field
          id="rut"
          label="Ingresa tu RUT"
          placeholder="Ej: 12345678-9"
          inputMode="text"
          autoComplete="off"
          value={rut}
          onChange={(e) => setRut(formatRut(e.target.value))}
          state={rut.length === 0 ? "default" : rutOk ? "success" : "error"}
          message={
            rut.length === 0
              ? "Sin puntos y con guión."
              : rutOk
                ? "RUT con formato válido."
                : "Revisa el formato: 12345678-9."
          }
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-ch-sm">
            <Field
              id="numero-cliente"
              label="Ingresa tu número de cliente"
              placeholder="Ej: 123456"
              inputMode="numeric"
              autoComplete="off"
              className="flex-1"
              value={cliente}
              onChange={(e) => setCliente(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
            <button
              type="button"
              aria-label="¿Dónde encuentro mi número de cliente?"
              aria-expanded={ayuda}
              onClick={() => setAyuda((v) => !v)}
              className="mt-[30px] flex size-11 shrink-0 items-center justify-center rounded-full bg-info/10 text-info transition-colors hover:bg-info/20 focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              <HelpCircle className="size-5" aria-hidden />
            </button>
          </div>
          {ayuda ? (
            <p className="rounded-card bg-muted p-ch-md text-sm leading-relaxed text-foreground">
              Tu número de cliente aparece en la parte superior de tu boleta, junto a la dirección
              del suministro. También puedes buscarlo con la opción{" "}
              <span className="font-semibold">Busca tu N° cliente</span>.
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" disabled={!puedeEnviar} className="mt-ch-sm w-full">
          Ingresar
        </Button>

        {enviado ? (
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-success">
            <Lock className="size-4" aria-hidden />
            Datos verificados. Continuaremos a {servicio.toLowerCase()}.
          </p>
        ) : null}
      </form>

      <div className="my-ch-lg flex items-center gap-ch-md">
        <span className="h-px flex-1 bg-border" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          otra alternativa
        </span>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>

      <Button variant="secondary" size="lg" className="w-full" asChild>
        <a href="https://www.chilquinta.cl" target="_blank" rel="noreferrer">
          Iniciar sesión en Mi Chilquinta
        </a>
      </Button>
      <p className="mt-ch-md text-center text-sm text-muted-foreground">
        Con tu cuenta accedes a todos tus suministros y trámites en un solo lugar.
      </p>
    </section>
  );
}

export default IngresoDatosCard;
