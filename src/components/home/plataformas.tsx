import { PlusCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import gestionInmobiliaria from "@/assets/GestionInmobiliaria.webp.asset.json";
import ventaServicios from "@/assets/VentaServicios.webp.asset.json";
import miConsumo from "@/assets/MiConsumoControlado.webp.asset.json";
import llamanosAntes from "@/assets/LlamanosAntes.webp.asset.json";

const platforms = [
  {
    title: "Gestión Inmobiliaria",
    description: "Solicita aquí proyectos eléctricos de múltiples empalmes.",
    image: gestionInmobiliaria.url,
  },
  {
    title: "Venta de servicios",
    description: "Solicita un nuevo empalme o un aumento de potencia.",
    image: ventaServicios.url,
  },
  {
    title: "Mi consumo controlado",
    description: "Accede a la información de tu medidor inteligente.",
    image: miConsumo.url,
  },
  {
    title: "Llámanos antes de excavar",
    description: "Infórmanos si vas a hacer alguna excavación.",
    image: llamanosAntes.url,
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
                <img
                  src={platform.image}
                  alt={platform.title}
                  loading="lazy"
                  className="h-40 w-full object-cover"
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