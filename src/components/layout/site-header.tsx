import { useEffect, useRef, useState } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export type MenuLink = {
  label: string;
  description: string;
  href: string;
  icon: string;
};

export type NavItem = { label: string; href: string; panel?: MenuLink[] };

const SERVICIO_AL_CLIENTE: MenuLink[] = [
  {
    label: "Reclamos",
    description: "Aquí puedes ingresar un reclamo o ver el estado de tu reclamo",
    href: "#",
    icon: "/icons/menu/reclamos.svg",
  },
  {
    label: "Consultas",
    description: "Realiza tu consultas",
    href: "#",
    icon: "/icons/menu/consultas.svg",
  },
  {
    label: "Despacho electrónico",
    description: "Suscríbete al envío de boleta a tu correo electrónico",
    href: "#",
    icon: "/icons/menu/despacho.svg",
  },
  {
    label: "Centro de servicio",
    description: "Conoce la ubicación de nuestras oficinas",
    href: "#",
    icon: "/icons/menu/oficinas.svg",
  },
  {
    label: "Conoce tu número de cliente",
    description: "Busca aquí tu número de cliente",
    href: "#",
    icon: "/icons/menu/ncliente.svg",
  },
  {
    label: "Olvidé mi contraseña",
    description: "Aquí puedes recuperar tu contraseña",
    href: "#",
    icon: "/icons/menu/contrasena.svg",
  },
  {
    label: "Quiero luz en mi propiedad",
    description: "Revisa los pasos necesarios para obtener un empalme",
    href: "/quiero-luz",
    icon: "/icons/menu/luz.svg",
  },
  {
    label: "Electrodependientes",
    description:
      "Regístrate para recibir atención prioritaria ante interrupciones de suministro",
    href: "#",
    icon: "/icons/menu/electro.svg",
  },
];

export const CHILQUINTA_NAV: NavItem[] = [
  { label: "Boleta y facturación", href: "#" },
  { label: "Convenios y pagos", href: "#" },
  { label: "Cortes y emergencias", href: "#" },
  { label: "Consumo y lecturas", href: "#" },
  { label: "Servicio al cliente", href: "#", panel: SERVICIO_AL_CLIENTE },
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
  /** Texto destacado centrado entre la barra superior y la navegación. */
  tagline?: string;
  /** Estado controlado del modo emergencia. */
  emergencyMode?: boolean;
  onEmergencyModeChange?: (value: boolean) => void;
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
  tagline,
  emergencyMode: emergencyModeProp,
  onEmergencyModeChange,
  className,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [emergencyModeState, setEmergencyModeState] = useState(false);
  const emergencyMode = emergencyModeProp ?? emergencyModeState;
  const setEmergencyMode = (value: boolean) => {
    setEmergencyModeState(value);
    onEmergencyModeChange?.(value);
  };
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openPanel) return;
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenPanel(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPanel(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openPanel]);

  return (
    <header
      className={cn("relative z-50 w-full border-b border-border bg-surface", className)}
    >
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
              <div className="hidden items-center gap-2 lg:inline-flex">
                <label className="inline-flex items-center gap-2 rounded-pill bg-background px-3 py-1.5">
                  <span className="text-sm font-semibold text-foreground">Modo emergencia</span>
                  <Switch
                    checked={emergencyMode}
                    onCheckedChange={setEmergencyMode}
                    aria-label="Activar modo emergencia"
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                  />
                </label>

                <button
                  type="button"
                  aria-label="Buscar"
                  className="ch-touch inline-flex items-center justify-center rounded-pill text-primary transition-colors hover:text-primary-hover"
                >
                  <Search className="size-6" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
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

        {tagline && (
          <p className="hidden text-center text-3xl font-bold text-primary lg:block lg:text-4xl">
            {tagline}
          </p>
        )}

        {/* Navegación desktop */}
        <div ref={navRef} className="relative hidden lg:block">
          <nav aria-label="Navegación principal">
            <ul className="flex items-center justify-between gap-2 py-4">
              {nav.map((item) => {
                const isOpen = openPanel === item.label;
                if (!item.panel) {
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="rounded-pill px-4 py-2 text-[16px] font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => setOpenPanel(isOpen ? null : item.label)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-[16px] font-semibold transition-colors",
                        isOpen
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:text-primary",
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-4 transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {nav.map((item) =>
            item.panel && openPanel === item.label ? (
              <div
                key={item.label}
                className="absolute left-1/2 top-full z-50 w-full max-w-4xl -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="mt-2 rounded-[1.75rem] bg-surface p-ch-lg shadow-card-hover">
                  <ul className="grid grid-cols-2 gap-x-ch-xl gap-y-ch-base">
                    {item.panel.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={() => setOpenPanel(null)}
                          className="group flex items-start gap-ch-sm rounded-card p-ch-sm transition-colors hover:bg-accent"
                        >
                          <img
                            src={link.icon}
                            alt=""
                            aria-hidden
                            className="mt-1 size-6 shrink-0 object-contain"
                            loading="lazy"
                          />
                          <span className="min-w-0">
                            <span className="block text-[17px] font-bold leading-snug text-foreground group-hover:text-primary">
                              {link.label}
                            </span>
                            <span className="mt-1 block text-[14px] leading-snug text-muted-foreground">
                              {link.description}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null,
          )}
        </div>

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
            <label className="ch-touch flex items-center justify-between gap-ch-md rounded-card bg-background px-3">
              <span className="text-[15px] font-semibold text-foreground">Modo emergencia</span>
              <Switch
                checked={emergencyMode}
                onCheckedChange={setEmergencyMode}
                aria-label="Activar modo emergencia"
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
              />
            </label>
          </nav>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
