import { useRef, useState, useEffect } from "react";

type Item = { label: string; src?: string };

const items: Item[] = [
  { label: "Busca tu\nN°cliente", src: "/icons/lupa.svg" },
  { label: "Reclamos", src: "/icons/reclamos.svg" },
  { label: "Boletas", src: "/icons/boleta.svg" },
  { label: "Cortes", src: "/icons/cortes.svg" },
  { label: "Medios\nde pago", src: "/icons/medios_de_pago.svg" },
  { label: "Convenio\nde pago", src: "/icons/convenio_pago.svg" },
  { label: "Electro\nDependientes", src: "/icons/electro.svg" },
];

/** Accesos rápidos: carrusel horizontal en mobile, grilla en desktop. */
export function QuickAccess() {
  return (
    <section aria-label="Accesos rápidos" className="bg-background">
      <div className="ch-container pb-ch-xl">
        <ul className="mt-[50px] -mx-ch-base flex snap-x gap-ch-base overflow-x-auto scroll-smooth px-ch-base pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-ch-lg sm:overflow-visible sm:px-0 lg:grid-cols-7">
          {items.map(({ label, src }) => (
            <li
              key={label}
              className="w-[6.5rem] shrink-0 snap-start sm:w-auto"
            >
              <a
                href="#"
                className="group flex flex-col items-center gap-ch-sm rounded-card text-center sm:gap-ch-md sm:p-ch-sm"
              >
                <span
                  aria-hidden
                  className="flex size-[4.5rem] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-colors group-hover:bg-primary-hover sm:size-[5rem] sm:ring-0 sm:ring-offset-0"
                >
                  <img
                    src={src}
                    alt=""
                    aria-hidden
                    className="size-8 object-contain sm:size-12"
                    loading="lazy"
                  />
                </span>
                <span className="whitespace-pre-line text-[15px] font-semibold leading-tight text-foreground group-hover:text-primary sm:text-[16px]">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default QuickAccess;