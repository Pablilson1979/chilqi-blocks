import { MessageCircle } from "lucide-react";

import { PayExpressCard } from "@/components/home/pay-express-card";
import luzWinter from "@/assets/luz-winter.jpg.asset.json";

/**
 * Hero del home: pago express a la izquierda y llamado a WhatsApp (Luz) sobre
 * la fotografía corporativa de invierno.
 */
export function Hero() {
  return (
    <section
      aria-label="Pago express y atención por WhatsApp"
      className="relative isolate overflow-hidden"
    >
      {/* Imagen de fondo corporativa */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-[position:65%_center] lg:bg-right"
        style={{ backgroundImage: `url(${luzWinter.url})` }}
      />

      {/* Overlay para legibilidad del contenido */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-background/85 via-background/50 to-transparent"
      />

      <div className="ch-container">
        <div className="grid items-center gap-ch-xl py-ch-2xl lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-ch-3xl">
          <PayExpressCard />

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold leading-tight text-primary-foreground drop-shadow-sm lg:text-4xl">
              ¿Trámites? Escríbele a
              <br className="hidden lg:block" /> Luz por WhatsApp
            </h1>
            <a
              href="#"
              className="ch-touch mt-ch-lg inline-flex items-center justify-center gap-ch-sm rounded-pill bg-surface px-ch-xl py-ch-md text-base font-bold text-foreground shadow-md transition-colors hover:bg-muted"
            >
              <MessageCircle className="size-5" aria-hidden />
              Hablar con luz
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
