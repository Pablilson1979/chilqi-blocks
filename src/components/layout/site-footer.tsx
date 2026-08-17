import { Facebook, Instagram, Twitter, Phone, Scale } from "lucide-react";

import { cn } from "@/lib/utils";

export type FooterColumn = { title: string; links: { label: string; href: string }[] };

const link = (label: string) => ({ label, href: "#" });

export const CHILQUINTA_FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Boleta y facturación",
    links: [
      "Mi boleta",
      "Historial de boletas",
      "Gráfico de últimas boletas",
      "Comparación de facturación",
    ].map(link),
  },
  {
    title: "Convenios y pagos",
    links: ["Convenio de pago", "Pago adelantado", "Opciones de pago"].map(link),
  },
  {
    title: "Cortes y emergencias",
    links: ["Cortes y emergencias", "Reportar corte", "Denuncio de hurto"].map(link),
  },
  {
    title: "Consumo y lecturas",
    links: ["Aportar lectura", "Historial de consumos", "Calcula tu consumo"].map(link),
  },
  {
    title: "Servicio al cliente",
    links: [
      "Reclamos",
      "Consultas",
      "Electrodependientes",
      "Centros de servicio",
      "Despacho electrónico",
      "Olvidé mi contraseña",
      "Conoce tu número de cliente",
    ].map(link),
  },
  {
    title: "Cambios y trámites",
    links: [
      "Emisión de certificados",
      "Subir documentos",
      "Traslado de medidor",
      "Cambio de titular",
    ].map(link),
  },
];

export const CHILQUINTA_PHONES = ["600 600 5000", "800 800 500", "desde celular (32) 2265300"];

export const CHILQUINTA_PARTNERS = [
  "Energía de Casablanca",
  "Compañía Eléctrica del Litoral",
  "Luzparral",
  "Luzlinares",
];

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.5 0 .17 5.33.17 11.9a11.8 11.8 0 0 0 1.6 5.94L0 24l6.34-1.66a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.33 11.9-11.9a11.83 11.83 0 0 0-3.45-8.42Zm-8.46 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.76.98 1-3.67-.24-.38a9.86 9.86 0 0 1-1.52-5.22c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.04 7.01 2.9a9.83 9.83 0 0 1 2.9 7.01c0 5.46-4.45 9.87-9.9 9.87Zm5.44-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

const socials = [
  { label: "WhatsApp", Icon: WhatsappIcon, filled: false },
  { label: "Facebook", Icon: Facebook, filled: true },
  { label: "Twitter", Icon: Twitter, filled: true },
  { label: "Instagram", Icon: Instagram, filled: false },
];

export interface SiteFooterProps {
  columns?: FooterColumn[];
  phones?: string[];
  partners?: string[];
  brandName?: string;
  className?: string;
}

/**
 * Footer corporativo de Chilquinta. Homologado al Design System 4.0:
 * columnas de enlaces, contacto, legales y banda roja de empresas asociadas.
 */
export function SiteFooter({
  columns = CHILQUINTA_FOOTER_COLUMNS,
  phones = CHILQUINTA_PHONES,
  partners = CHILQUINTA_PARTNERS,
  brandName = "Chilquinta Distribución",
  className,
}: SiteFooterProps) {
  return (
    <footer className={cn("w-full border-t border-border bg-surface text-foreground", className)}>
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="ch-container max-w-[600px] py-ch-2xl text-center">
          <div className="flex items-center justify-center gap-ch-sm text-muted-foreground">
            <Scale className="size-6" aria-hidden="true" />
            <span className="text-lg font-bold">Gerencia Legal:</span>
          </div>
          <a
            href="#"
            className="mt-ch-lg inline-flex w-full items-center justify-center rounded-pill border-2 border-primary px-ch-lg py-ch-base text-base font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Canal de reporte ético
          </a>
          <p className="mt-ch-xl text-xl font-semibold text-primary">{brandName}</p>
          <div className="mt-ch-lg flex items-center justify-center gap-ch-lg">
            {socials.slice(0, 3).map(({ label, Icon, filled }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="ch-touch inline-flex items-center justify-center rounded-input text-foreground transition-colors hover:text-primary"
              >
                <Icon
                  className="size-8"
                  {...(filled ? { fill: "currentColor", strokeWidth: 0 } : {})}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="ch-container py-ch-3xl">
          <div className="grid grid-cols-4 gap-10">
            <div>
              <h3 className="text-lg font-semibold text-primary">{brandName}</h3>
              <div className="mt-ch-lg flex items-center gap-ch-base">
                {socials.map(({ label, Icon, filled }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="inline-flex items-center justify-center rounded-input p-1 text-foreground transition-colors hover:text-primary"
                  >
                    <Icon
                      className="size-7"
                      {...(filled ? { fill: "currentColor", strokeWidth: 0 } : {})}
                    />
                  </a>
                ))}
              </div>
              <div className="mt-ch-xl flex items-start gap-ch-md text-sm">
                <Phone className="mt-1 size-5 shrink-0" aria-hidden="true" />
                <div className="space-y-1 leading-relaxed">
                  {phones.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="mt-ch-xl space-y-2 text-sm">
                <a href="#" className="block transition-colors hover:text-primary">
                  Términos de uso
                </a>
                <a href="#" className="block transition-colors hover:text-primary">
                  Política de privacidad
                </a>
              </div>
            </div>

            <div className="col-span-3 grid grid-cols-3 gap-x-10 gap-y-10">
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="text-lg font-semibold text-primary">{col.title}</h3>
                  <ul className="mt-ch-base space-y-3 text-[15px]">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href} className="transition-colors hover:text-primary">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full bg-primary">
          <div className="ch-container flex items-center justify-between py-ch-base text-sm text-primary-foreground">
            <span className="font-bold">Empresas asociadas:</span>
            {partners.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
