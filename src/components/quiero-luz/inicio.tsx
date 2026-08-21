import { ArrowRight, ArrowRight as FlechaConexion, ClipboardList, History, Home, Info, PlugZap, ShieldCheck, TrendingUp } from "lucide-react";

import { ETAPAS, type Necesidad } from "./content";

const CAMINOS: {
  necesidad: Necesidad | "seguimiento";
  icon: typeof Home;
  titulo: string;
  texto: string;
  tono: string;
}[] = [
  {
    necesidad: "nueva",
    icon: Home,
    titulo: "Necesito una conexión nueva",
    texto: "Para un inmueble que todavía no cuenta con suministro eléctrico.",
    tono: "bg-info-soft text-info",
  },
  {
    necesidad: "potencia",
    icon: TrendingUp,
    titulo: "Necesito más potencia",
    texto: "Para usar más equipamiento en un servicio eléctrico existente.",
    tono: "bg-warning-soft text-warning",
  },
  {
    necesidad: "seguimiento",
    icon: History,
    titulo: "Quiero revisar una solicitud",
    texto: "Consulta dónde se gestiona una solicitud que ya ingresaste.",
    tono: "bg-success-soft text-success",
  },
];

const ICONOS_ETAPA = [ShieldCheck, ClipboardList, PlugZap];

export function Inicio({
  onComenzar,
  onSeguimiento,
}: {
  onComenzar: (necesidad?: Necesidad) => void;
  onSeguimiento: () => void;
}) {
  return (
    <div className="flex flex-col gap-ch-3xl">
      <section className="flex flex-col gap-ch-lg">

        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
            Quiero Luz: orientación para tu conexión
          </p>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Elige una opción:
          </h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {CAMINOS.map(({ necesidad, icon: Icon, titulo, texto, tono }) => (
            <button
              key={titulo}
              type="button"
              onClick={() => (necesidad === "seguimiento" ? onSeguimiento() : onComenzar(necesidad))}
              className="group flex flex-col gap-3 rounded-card border bg-card p-5 text-left shadow-card transition-shadow hover:shadow-card-hover lg:p-6"
            >
              <span className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-card ${tono}`}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 text-lg font-bold text-foreground">{titulo}</span>
                <ArrowRight
                  className="mt-3 size-5 shrink-0 text-primary transition-colors transition-transform group-hover:translate-x-1 group-hover:text-primary-hover"
                  aria-hidden
                />
              </span>
              <span className="text-sm text-muted-foreground lg:pl-14">{texto}</span>
            </button>
          ))}
        </div>

        <div className="flex max-w-3xl items-start gap-3 rounded-card border border-info/30 bg-info-soft p-4 lg:p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
          <div className="min-w-0 text-sm">
            <p className="text-base font-bold text-foreground">
              Esta herramienta entrega una orientación referencial
            </p>
            <p className="text-muted-foreground">
              Te ayuda a entender qué podrías necesitar antes de iniciar tu solicitud en Tu
              Conexión. La solución definitiva se confirma durante la evaluación de factibilidad.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-ch-md pt-ch-lg">
        <div className="flex flex-col gap-1 text-center">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Después de orientarte
          </p>
          <h2 className="mx-auto max-w-2xl text-lg font-semibold text-foreground sm:text-xl">
            Tu solicitud formal tiene tres macroetapas
          </h2>
          <p className="text-sm text-muted-foreground">
            Quiero Luz te prepara. El trámite y sus acciones se realizan en Tu Conexión.
          </p>
        </div>

        <ol className="grid gap-4 lg:grid-cols-3">
          {ETAPAS.map((etapa, i) => {
            const Icon = ICONOS_ETAPA[i]!;
            return (
              <li
                key={etapa.numero}
                className="flex flex-col gap-4 rounded-card bg-muted/20 p-5 lg:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-info/10 text-info">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span aria-hidden className="text-3xl leading-none font-semibold text-muted-foreground/60">
                    {etapa.numero}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-foreground">{etapa.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{etapa.descripcion}</p>
                </div>
                <div className="mt-auto border-t border-border/60 pt-3">
                  <p className="text-xs font-medium text-muted-foreground">{etapa.plazo}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
