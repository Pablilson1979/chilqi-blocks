import { PlusCircle } from "lucide-react";

import { Card } from "@/components/ui/card";

const platforms = [
  {
    title: "Gestión Inmobiliaria",
    description: "Solicita aquí proyectos eléctricos de múltiples empalmes.",
  },
  {
    title: "Venta de servicios",
    description: "Solicita un nuevo empalme o un aumento de potencia.",
  },
  {
    title: "Mi consumo controlado",
    description: "Accede a la información de tu medidor inteligente.",
  },
  {
    title: "Llámanos antes de excavar",
    description: "Infórmanos si vas a hacer alguna excavación.",
  },
];

/** Plataformas digitales: carrusel de tarjetas con imagen. */
export function Plataformas() {
  return (
    <section aria-labelledby="plataformas" className="bg-background">
      <div className="ch-container py-ch-3xl">
        <h2 id="plataformas" className="text-center text-3xl font-bold text-foreground">
          Plataformas digitales
        </h2>

        <ul className="mt-ch-2xl grid gap-ch-lg sm:grid-cols-2 lg:grid-cols-4">
          {platforms.map((platform) => (
            <li key={platform.title}>
              <Card className="flex h-full flex-col overflow-hidden p-0">
                {/* Imagen pendiente: se reemplaza por la fotografía oficial */}
                <div
                  aria-hidden
                  className="h-40 w-full bg-[linear-gradient(135deg,var(--color-info-soft),var(--color-muted))]"
                />
                <div className="flex flex-1 flex-col gap-ch-sm p-ch-base">
                  <h3 className="text-base font-bold text-foreground">{platform.title}</h3>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                  <a
                    href="#"
                    aria-label={platform.title}
                    className="mt-auto self-end pt-ch-base text-primary hover:text-primary-hover"
                  >
                    <PlusCircle className="size-6" aria-hidden />
                  </a>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Plataformas;