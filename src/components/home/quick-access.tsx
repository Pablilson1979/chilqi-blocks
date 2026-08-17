import {
  Search,
  Megaphone,
  ReceiptText,
  Zap,
  CreditCard,
  FileCheck2,
  HeartPulse,
} from "lucide-react";

const items = [
  { label: "Busca tu\nN°cliente", Icon: Search },
  { label: "Reclamos", Icon: Megaphone },
  { label: "Boletas", Icon: ReceiptText },
  { label: "Cortes", Icon: Zap },
  { label: "Medios\nde pago", Icon: CreditCard },
  { label: "Convenio\nde pago", Icon: FileCheck2 },
  { label: "Electro\nDependientes", Icon: HeartPulse },
];

/** Accesos rápidos: fila de iconos rojos bajo el hero. */
export function QuickAccess() {
  return (
    <section aria-label="Accesos rápidos" className="bg-background">
      <div className="ch-container py-ch-xl">
        <ul className="grid grid-cols-3 gap-ch-lg sm:grid-cols-4 lg:grid-cols-7">
          {items.map(({ label, Icon }) => (
            <li key={label}>
              <a
                href="#"
                className="group flex flex-col items-center gap-ch-md rounded-card p-ch-sm text-center"
              >
                <span
                  aria-hidden
                  className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-colors group-hover:bg-primary-hover"
                >
                  <Icon className="size-8" strokeWidth={2} />
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