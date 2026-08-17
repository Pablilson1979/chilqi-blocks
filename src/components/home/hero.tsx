import { MessageCircle } from "lucide-react";

import { PayExpressCard } from "@/components/home/pay-express-card";

/**
 * Hero del home: pago express a la izquierda sobre la imagen corporativa y
 * llamado a WhatsApp (Luz) a la derecha.
 */
export function Hero() {
  return (
    <section aria-label="Pago express y atención por WhatsApp" className="relative isolate">
      {/* Fondo: reemplazar por la fotografía corporativa cuando esté disponible */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,var(--color-foreground)_0%,color-mix(in_oklab,var(--color-foreground)_70%,var(--color-info))_55%,var(--color-primary-hover)_100%)]"
      />

      <div className="ch-container">
        <div className="grid items-center gap-ch-xl py-ch-2xl lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-ch-3xl">
          <PayExpressCard />

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold leading-tight text-primary-foreground lg:text-4xl">
              ¿Trámites? Escríbele a
              <br className="hidden lg:block" /> Luz por WhatsApp
            </h1>
            <a
              href="#"
              className="ch-touch mt-ch-lg inline-flex items-center justify-center gap-ch-sm rounded-pill bg-surface px-ch-xl py-ch-md text-base font-bold text-foreground transition-colors hover:bg-muted"
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