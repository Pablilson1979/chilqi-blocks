
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

/** Accesos rápidos: fila de iconos rojos bajo el hero. */
export function QuickAccess() {
  return (
    <section aria-label="Accesos rápidos" className="bg-background">
      <div className="ch-container py-ch-xl">
        <ul className="grid grid-cols-3 gap-ch-lg sm:grid-cols-4 lg:grid-cols-7">
          {items.map(({ label, src }) => (
            <li key={label}>
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
                <span className="whitespace-pre-line text-sm font-semibold text-foreground group-hover:text-primary">
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