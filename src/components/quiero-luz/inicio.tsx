import { ArrowRight, ExternalLink, History, Home, Info, TrendingUp, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TU_CONEXION_URL, type Necesidad } from "./content";

const COMO_FUNCIONA = [
  { titulo: "Oriéntate", texto: "Entiende qué podrías necesitar." },
  { titulo: "Prepárate", texto: "Revisa requisitos y próximos pasos." },
  { titulo: "Solicita", texto: "Continúa el trámite en Tu Conexión." },
];

const CAMINOS: {
  necesidad: Necesidad | "seguimiento";
  icon: typeof Home;
  titulo: string;
  texto: string;
}[] = [
  {
    necesidad: "nueva",
    icon: Home,
    titulo: "Necesito una conexión nueva",
    texto: "Para un inmueble que todavía no cuenta con suministro eléctrico.",
  },
  {
    necesidad: "potencia",
    icon: TrendingUp,
    titulo: "Necesito más potencia",
    texto: "Para usar más equipamiento en un servicio eléctrico existente.",
  },
  {
    necesidad: "seguimiento",
    icon: History,
    titulo: "Quiero revisar una solicitud",
    texto: "Consulta dónde se gestiona una solicitud que ya ingresaste.",
  },
];

export function Inicio({
  onComenzar,
  onSeguimiento,
}: {
  onComenzar: (necesidad?: Necesidad) => void;
  onSeguimiento: () => void;
}) {
  return (
    <div className="flex flex-col gap-ch-3xl">
      <section className="grid items-start gap-ch-xl lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-5">
          <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
            <Zap className="size-4 text-primary" aria-hidden />
            Orientación antes de solicitar
          </p>
          <h1 className="text-4xl leading-tight font-bold text-foreground lg:text-5xl">
            Descubre qué conexión eléctrica necesitas
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Te ayudamos a orientarte sobre una conexión nueva o un aumento de potencia antes de
            iniciar tu solicitud formal en <strong className="text-foreground">Tu Conexión</strong>.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => onComenzar()}>
              Comenzar orientación
              <ArrowRight />
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href={TU_CONEXION_URL} target="_blank" rel="noreferrer">
                Ya sé lo que necesito
                <ExternalLink />
              </a>
            </Button>
          </div>
          <div className="flex max-w-xl items-start gap-3 rounded-card bg-info-soft p-4">
            <Info className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
            <div className="text-sm">
              <p className="font-bold text-foreground">Esta es una orientación referencial</p>
              <p className="text-muted-foreground">
                La factibilidad, el presupuesto y los plazos se confirman posteriormente en Tu
                Conexión.
              </p>
            </div>
          </div>
        </div>

        <Card className="flex flex-col gap-5 p-6 lg:p-8">
          <div className="flex items-center justify-center rounded-card bg-info-soft py-10">
            <Zap className="size-16 text-warning" aria-hidden />
          </div>
          <ol className="flex flex-col gap-4">
            {COMO_FUNCIONA.map((p, i) => (
              <li key={p.titulo} className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-info-soft text-sm font-bold text-info">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-base font-bold text-foreground">{p.titulo}</span>
                  <span className="block text-sm text-muted-foreground">{p.texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
            Elige tu camino
          </p>
          <h2 className="text-2xl font-bold text-foreground lg:text-3xl">¿Qué necesitas hacer?</h2>
          <p className="text-muted-foreground">
            Selecciona la alternativa que mejor representa tu situación.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {CAMINOS.map(({ necesidad, icon: Icon, titulo, texto }) => (
            <button
              key={titulo}
              type="button"
              onClick={() =>
                necesidad === "seguimiento" ? onSeguimiento() : onComenzar(necesidad)
              }
              className="group flex flex-col gap-3 rounded-card border bg-card p-6 text-left shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-card bg-info-soft text-info">
                  <Icon className="size-5" aria-hidden />
                </span>
                <ArrowRight
                  className="size-5 text-info transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
              <span className="text-lg font-bold text-foreground">{titulo}</span>
              <span className="text-sm text-muted-foreground">{texto}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}