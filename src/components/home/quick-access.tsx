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
      <div className="ch-container py-ch-xl">
        <ul className="flex snap-x snap-mandatory gap-ch-lg overflow-x-auto scroll-smooth sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-7">
          {items.map(({ label, src }) => (
            <li
              key={label}
              className="w-[22%] shrink-0 snap-start min-w-[5.5rem] sm:w-auto"
            >
              <a
                href="#"
                className="group flex flex-col items-center gap-ch-md rounded-card p-ch-sm text-center"
              >
                <span
                  aria-hidden
                  className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-colors group-hover:bg-primary-hover"
                >
                  <img
                    src={src}
                    alt=""
                    aria-hidden
                    className="size-8 object-contain"
                    loading="lazy"
                  />
                </span>
                <span className="whitespace-pre-line text-[16px] font-semibold text-foreground group-hover:text-primary">
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