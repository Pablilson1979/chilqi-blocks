import { ArrowLeft, ArrowRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChoiceGroup } from "./choice-card";
import { PASOS, StepsNav } from "./steps-nav";
import {
  OPCIONES_EQUIPAMIENTO,
  OPCIONES_INMUEBLE,
  OPCIONES_INSTALADOR,
  OPCIONES_NECESIDAD,
  OPCIONES_RED_FRENTE,
  OPCIONES_RELACION,
  OPCIONES_TIPO_RED,
  OPCIONES_USO,
  type Orientacion as Datos,
} from "./content";

const ENCABEZADOS = [
  {
    kicker: "Paso 1 · Tu necesidad",
    titulo: "¿Qué quieres resolver?",
    bajada: "Esta respuesta define el recorrido y la información que te mostraremos.",
  },
  {
    kicker: "Paso 2 · Uso del inmueble",
    titulo: "Cuéntanos sobre el lugar que quieres conectar",
    bajada: "No necesitas ser propietario para recibir esta orientación.",
  },
  {
    kicker: "Paso 3 · Equipamiento",
    titulo: "¿Qué nivel de uso se parece más al tuyo?",
    bajada: "Usamos estos ejemplos solo como referencia. La capacidad definitiva se valida técnicamente.",
  },
  {
    kicker: "Paso 4 · Contexto técnico",
    titulo: "Lo último: ¿qué sabes del entorno?",
    bajada: "No te preocupes si no conoces la respuesta. “No sé” es una alternativa válida.",
  },
];

export function pasoCompleto(step: number, d: Datos) {
  if (step === 0) return Boolean(d.necesidad);
  if (step === 1) return Boolean(d.inmueble && d.relacion && d.uso);
  if (step === 2) return Boolean(d.equipamiento);
  return Boolean(d.redFrente && d.tipoRed && d.instalador);
}

export function Orientacion({
  step,
  datos,
  onChange,
  onBack,
  onNext,
}: {
  step: number;
  datos: Datos;
  onChange: (patch: Partial<Datos>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const encabezado = ENCABEZADOS[step]!;
  const listo = pasoCompleto(step, datos);

  return (
    <div className="flex flex-col gap-ch-xl">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
              Quiero luz
            </p>
            <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
              Descubre qué conexión podrías necesitar
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Paso {step + 1} de {PASOS.length}
          </p>
        </div>
      </div>

      <StepsNav current={step} />

      <section className="mx-auto flex w-full max-w-[840px] flex-col gap-ch-lg rounded-[1.5rem] bg-card p-ch-lg shadow-card sm:p-ch-xl">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
            {encabezado.kicker}
          </p>
          <h2 className="text-2xl font-bold text-foreground lg:text-3xl">{encabezado.titulo}</h2>
          <p className="text-muted-foreground">{encabezado.bajada}</p>
        </div>

        {step === 0 ? (
          <ChoiceGroup
            question="Selecciona una alternativa"
            options={OPCIONES_NECESIDAD}
            value={datos.necesidad}
            columns={1}
            onChange={(necesidad) => onChange({ necesidad })}
          />
        ) : null}

        {step === 1 ? (
          <>
            <ChoiceGroup
              question="¿Qué tipo de inmueble es?"
              number={1}
              options={OPCIONES_INMUEBLE}
              value={datos.inmueble}
              onChange={(inmueble) => onChange({ inmueble })}
            />
            <ChoiceGroup
              question="¿Qué relación tienes con el inmueble?"
              number={2}
              options={OPCIONES_RELACION}
              value={datos.relacion}
              onChange={(relacion) => onChange({ relacion })}
            />
            <ChoiceGroup
              question="¿Cuál será su uso principal?"
              number={3}
              options={OPCIONES_USO}
              value={datos.uso}
              onChange={(uso) => onChange({ uso })}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="flex items-start gap-ch-md rounded-card bg-info-soft p-ch-base text-sm leading-relaxed text-foreground">
              <Info className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
              Piensa en los equipos que podrían funcionar al mismo tiempo y en lo que podrías
              incorporar en el futuro.
            </div>
            <ChoiceGroup
              question="Nivel de uso"
              number={1}
              options={OPCIONES_EQUIPAMIENTO}
              value={datos.equipamiento}
              columns={1}
              onChange={(equipamiento) => onChange({ equipamiento })}
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <ChoiceGroup
              question="¿Hay postes, cables o una cámara eléctrica frente al inmueble?"
              number={1}
              options={OPCIONES_RED_FRENTE}
              value={datos.redFrente}
              onChange={(redFrente) => onChange({ redFrente })}
            />
            <ChoiceGroup
              question="Si puedes identificarla, ¿qué tipo de red existe?"
              number={2}
              options={OPCIONES_TIPO_RED}
              value={datos.tipoRed}
              onChange={(tipoRed) => onChange({ tipoRed })}
            />
            <ChoiceGroup
              question="¿Cuentas con un instalador eléctrico autorizado?"
              number={3}
              options={OPCIONES_INSTALADOR}
              value={datos.instalador}
              onChange={(instalador) => onChange({ instalador })}
            />
          </>
        ) : null}

        <div className="flex flex-col-reverse gap-ch-md border-t pt-ch-lg sm:flex-row sm:justify-between">
          <Button variant="secondary" size="lg" onClick={onBack}>
            <ArrowLeft />
            {step === 0 ? "Volver al inicio" : "Anterior"}
          </Button>
          <Button size="lg" disabled={!listo} onClick={onNext}>
            {step === PASOS.length - 1 ? "Ver mi orientación" : "Continuar"}
            <ArrowRight />
          </Button>
        </div>
      </section>
    </div>
  );
}