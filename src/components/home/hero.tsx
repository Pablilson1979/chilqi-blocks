import { MessageCircle } from "lucide-react";

import { PayExpressCard } from "@/components/home/pay-express-card";
import luzWinter from "@/assets/luz-winter.jpg.asset.json";

/** Versión mobile: banner arriba y pago express expandido debajo. */
function HeroMobile() {
  return (
    <section aria-label="Pago express y atención por WhatsApp" className="lg:hidden">
      <div
        className="relative flex h-[300px] items-center justify-center bg-cover bg-[position:65%_center]"
        style={{ backgroundImage: `url(${luzWinter.url})` }}
      >
        <h1 className="px-ch-lg text-center text-3xl font-bold leading-tight text-primary-foreground drop-shadow-md">
          ¿Trámites? Escríbele a Luz por WhatsApp
        </h1>
        <div className="absolute bottom-ch-lg flex items-center gap-2" aria-hidden>
          <span className="size-3.5 rounded-full bg-primary" />
          <span className="size-3.5 rounded-full bg-muted-foreground/50" />
        </div>
      </div>

      <div className="ch-container py-ch-xl">
        <PayExpressCard className="max-w-none rounded-none bg-transparent p-0 shadow-none backdrop-blur-none" />
        <a
          href="#"
          className="ch-touch mt-ch-lg inline-flex w-full items-center justify-center gap-ch-sm rounded-pill border-2 border-primary px-ch-xl py-ch-md text-base font-bold text-primary"
        >
          <MessageCircle className="size-5" aria-hidden />
          Hablar con Luz
        </a>
      </div>
    </section>
  );
}

/**
 * Hero del home: pago express a la izquierda y llamado a WhatsApp (Luz) sobre
 * la fotografía corporativa de invierno.
 */
export function Hero() {
  return (
    <>
      <HeroMobile />
      <section
      aria-label="Pago express y atención por WhatsApp"
      className="relative isolate hidden overflow-hidden lg:block"
    >
      {/* Imagen de fondo corporativa a color original */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-[position:65%_center] lg:bg-right"
        style={{ backgroundImage: `url(${luzWinter.url})` }}
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
    </>
  );
}

export default Hero;
