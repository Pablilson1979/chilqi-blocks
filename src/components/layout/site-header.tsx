import { useState } from "react";
import { Search, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type NavItem = { label: string; href: string };

export const CHILQUINTA_NAV: NavItem[] = [
  { label: "Boleta y facturación", href: "#" },
  { label: "Convenios y pagos", href: "#" },
  { label: "Cortes y emergencias", href: "#" },
  { label: "Consumo y lecturas", href: "#" },
  { label: "Servicio al cliente", href: "#" },
  { label: "Cambios y trámites", href: "#" },
];

export interface SiteHeaderProps {
  /** Enlaces de la navegación principal. Por defecto, el menú corporativo. */
  nav?: NavItem[];
  /** Destino del logotipo. */
  homeHref?: string;
  /** Muestra el buscador (solo desktop). */
  showSearch?: boolean;
  /** Acción de inicio de sesión; si es null, se oculta el botón. */
  loginHref?: string | null;
  loginLabel?: string;
  className?: string;
}

/**
 * Header corporativo de Chilquinta. Homologado al Design System 4.0:
 * logotipo oficial, botón pill de sesión y navegación en texto primario.
 */
export function SiteHeader({
  nav = CHILQUINTA_NAV,
  homeHref = "/",
  showSearch = true,
  loginHref = "#",
  loginLabel = "Iniciar Sesión",
  className,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={cn("w-full border-b border-border bg-surface", className)}>
      <div className="ch-container">
        <div className="flex items-center justify-between py-4 lg:py-6">
          <a
            href={homeHref}
            className="flex min-w-0 shrink items-center rounded-input"
            aria-label="Chilquinta — Inicio"
          >
            <img
              src="/Logo_Chilquinta.svg"
              alt="Chilquinta"
              className="block h-7 w-auto sm:h-8 lg:h-9"
              width="190"
              height="38"
            />
          </a>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">
            {showSearch && (
              <button
                type="button"
                aria-label="Buscar"
                className="ch-touch hidden items-center justify-center rounded-pill text-primary transition-colors hover:text-primary-hover lg:inline-flex"
              >
                <Search className="size-6" strokeWidth={2.5} aria-hidden="true" />
              </button>
            )}

            {loginHref && (
              <a
                href={loginHref}
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-pill border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:px-5 lg:px-8 lg:py-2.5 lg:text-base"
              >
                {loginLabel}
              </a>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              className="ch-touch inline-flex shrink-0 items-center justify-center rounded-input text-primary lg:hidden"
            >
              {open ? (
                <X className="size-7" strokeWidth={3} aria-hidden="true" />
              ) : (
                <Menu className="size-7" strokeWidth={3} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Navegación desktop */}
        <nav className="hidden lg:block" aria-label="Navegación principal">
          <ul className="flex items-center justify-between gap-6 py-5">
            {nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="rounded-input text-[15px] font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Navegación mobile */}
        {open && (
          <nav className="pb-3 lg:hidden" aria-label="Navegación principal">
            <ul className="flex flex-col py-2">
              {nav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="ch-touch flex items-center rounded-input px-2 text-[15px] font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
