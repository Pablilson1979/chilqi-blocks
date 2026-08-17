import { useRef, useState, useEffect } from "react";
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

/** Plataformas digitales: carrusel horizontal en mobile, grilla en desktop. */
export function Plataformas() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const scrollLeft = track.scrollLeft;
      const width = track.clientWidth;
      const index = Math.round(scrollLeft / (width * 0.85 + 16));
      setActive(Math.max(0, Math.min(index, platforms.length - 1)));
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section aria-labelledby="plataformas" className="bg-background">
      <div className="ch-container py-ch-3xl">
        <h2 id="plataformas" className="text-center text-3xl font-bold text-foreground">
          Plataformas digitales
        </h2>

        <ul
          ref={trackRef}
          className="mt-ch-2xl flex snap-x snap-mandatory gap-ch-lg overflow-x-auto scroll-smooth sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4"
        >
          {platforms.map((platform) => (
            <li
              key={platform.title}
              className="w-[85%] shrink-0 snap-center sm:w-auto"
            >
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

        <div className="mt-ch-lg flex justify-center gap-2 sm:hidden">
          {platforms.map((_, i) => (
            <span
              key={i}
              className={`size-2 rounded-full transition-colors ${
                i === active ? "bg-foreground" : "bg-muted-foreground/40"
              }`}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Plataformas;