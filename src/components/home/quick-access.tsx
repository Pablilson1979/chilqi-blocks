import { CreditCard } from "lucide-react";
import lupaAsset from "@/assets/lupa.svg.asset.json";
import reclamosAsset from "@/assets/reclamos.svg.asset.json";
import boletaAsset from "@/assets/boleta.svg.asset.json";
import cortesAsset from "@/assets/cortes.svg.asset.json";
import convenioAsset from "@/assets/convenio_pago.svg.asset.json";
import electroAsset from "@/assets/electro.svg.asset.json";

type Item = { label: string; src?: string };

const items: Item[] = [
  { label: "Busca tu\nN°cliente", src: lupaAsset.url },
  { label: "Reclamos", src: reclamosAsset.url },
  { label: "Boletas", src: boletaAsset.url },
  { label: "Cortes", src: cortesAsset.url },
  { label: "Medios\nde pago" },
  { label: "Convenio\nde pago", src: convenioAsset.url },
  { label: "Electro\nDependientes", src: electroAsset.url },
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
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      aria-hidden
                      className="size-8 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <CreditCard className="size-8" strokeWidth={2} />
                  )}
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