import { AlertTriangle, ArrowRight, ChevronDown, RefreshCw, Truck, HardHat } from "lucide-react";

import { PayExpressCard } from "@/components/home/pay-express-card";
import { cn } from "@/lib/utils";

const CONNECTED = 93.21;
const LAST_UPDATE = "Hoy · 18:00 hrs.";

const contacts = [
  {
    icon: "/icons/emergencia/whatsapp.svg",
    label: "Escríbenos por WhatsApp",
    detail: "Respuesta guiada 24/7 con Luz",
    href: "#",
  },
  {
    icon: "/icons/emergencia/telefono.svg",
    label: "Llámanos",
    detail: "600 600 5000 · 800 800 500",
    href: "tel:6006005000",
  },
];

const crews = [
  { icon: Truck, value: "110", unit: "Equipos", detail: "Trabajando en terreno" },
  { icon: HardHat, value: "670", unit: "Colaboradores", detail: "Reforzando cuadrillas" },
];

/** Tarjeta blanca base del modo emergencia. */
function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-[1.75rem] bg-surface p-ch-lg shadow-card", className)}>
      {children}
    </section>
  );
}

/**
 * Home en modo emergencia: prioriza atención a electrodependientes, canales de
 * contacto, estado de la red y avance de cuadrillas. El pago queda en segundo
 * plano, colapsado al final.
 */
export function EmergenciaHome() {
  return (
    <div className="bg-background">
      {/* Aviso de estado */}
      <div className="bg-primary text-primary-foreground">
        <div className="ch-container grid grid-cols-[auto_minmax(0,1fr)] items-center gap-ch-md py-ch-md sm:flex sm:justify-between">
          <span className="flex min-w-0 items-center gap-ch-sm">
            <AlertTriangle className="size-5 shrink-0" aria-hidden />
            <span className="text-[15px] font-bold leading-tight">
              Emergencia climática en curso · trabajamos para restablecer el suministro
            </span>
          </span>
          <span className="col-span-2 inline-flex items-center gap-ch-xs text-[13px] font-semibold opacity-90 sm:col-auto sm:shrink-0">
            <RefreshCw className="size-3.5" aria-hidden />
            Actualizado: {LAST_UPDATE}
          </span>
        </div>
      </div>

      <div className="ch-container flex flex-col gap-ch-base py-ch-xl lg:grid lg:grid-cols-3 lg:gap-ch-lg">
        {/* 1. Electrodependientes — máxima prioridad */}
        <Panel className="border-2 border-success-tint bg-success-soft lg:col-span-1">
          <div className="flex items-start gap-ch-md">
            <img
              src="/icons/emergencia/electro.svg"
              alt=""
              aria-hidden
              className="size-10 shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-tight text-foreground">
                ¿Eres electrodependiente sin suministro?
              </h2>
              <p className="mt-ch-xs text-[15px] font-semibold text-foreground/80">
                Atención prioritaria durante la emergencia.
              </p>
            </div>
          </div>

          <a
            href="tel:800800606"
            className="ch-touch mt-ch-base flex items-center justify-center gap-ch-sm rounded-pill bg-success px-ch-lg py-ch-md text-lg font-bold text-success-foreground transition-opacity hover:opacity-90"
          >
            Llamar al 800 800 606
          </a>

          <a
            href="#"
            className="ch-touch mt-ch-sm flex items-center justify-center gap-ch-xs text-[15px] font-bold text-foreground underline-offset-4 hover:underline"
          >
            Registrarme como electrodependiente
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </Panel>

        {/* 2. Contacto clientes */}
        <Panel>
          <h2 className="text-xl font-bold text-foreground">Contáctanos</h2>
          <ul className="mt-ch-base flex flex-col gap-ch-sm">
            {contacts.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="ch-touch flex items-center gap-ch-md rounded-card border border-border bg-surface p-ch-md transition-colors hover:border-success hover:bg-success-soft"
                >
                  <img src={c.icon} alt="" aria-hidden className="size-10 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-[16px] font-bold leading-snug text-foreground">
                      {c.label}
                    </span>
                    <span className="block text-[14px] leading-snug text-muted-foreground">
                      {c.detail}
                    </span>
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                className="ch-touch flex items-center gap-ch-md rounded-card border-2 border-primary bg-surface p-ch-md text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-current">
                  <AlertTriangle className="size-5" aria-hidden />
                </span>
                <span className="text-[16px] font-bold">Reportar un corte o emergencia</span>
              </a>
            </li>
          </ul>
        </Panel>

        {/* 3. Estado de la red */}
        <Panel>
          <h2 className="text-xl font-bold text-foreground">Estado general de la red</h2>
          <p className="mt-ch-xs text-[14px] text-muted-foreground">
            Monitoreo en tiempo real de clientes con suministro eléctrico activo.
          </p>

          <div className="mt-ch-base rounded-card bg-muted p-ch-base">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-ch-sm">
              <span className="text-[15px] font-bold text-foreground">Clientes conectados</span>
              <span className="text-3xl font-bold leading-none text-success">
                {CONNECTED.toLocaleString("es-CL")}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={CONNECTED}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Clientes con suministro"
              className="mt-ch-md h-3 w-full overflow-hidden rounded-pill bg-surface"
            >
              <div className="h-full rounded-pill bg-success" style={{ width: `${CONNECTED}%` }} />
            </div>
            <div className="mt-ch-sm flex items-center justify-between text-[13px] font-semibold text-muted-foreground">
              <span>Con servicio</span>
              <span>{(100 - CONNECTED).toFixed(2)}% sin servicio</span>
            </div>
          </div>

          <a
            href="#"
            className="ch-touch mt-ch-base inline-flex w-full items-center justify-center gap-ch-xs rounded-pill border-2 border-primary px-ch-lg py-ch-sm text-[15px] font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Ver cortes e interrupciones
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </Panel>
      </div>

      {/* 4. Recuperación en marcha */}
      <div className="ch-container pb-ch-xl">
        <Panel className="bg-surface">
          <div className="flex flex-col gap-ch-base lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-foreground">Recuperación en marcha</h2>
              <p className="mt-ch-xs inline-flex items-center gap-ch-xs text-[13px] font-semibold text-muted-foreground">
                <RefreshCw className="size-3.5 text-primary" aria-hidden />
                Última actualización: {LAST_UPDATE}
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-ch-base lg:flex lg:gap-ch-2xl">
              {crews.map(({ icon: Icon, value, unit, detail }) => (
                <li key={unit} className="flex items-center gap-ch-sm">
                  <Icon className="size-9 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold leading-tight text-foreground">
                      <span className="text-2xl">{value}</span> {unit}
                    </span>
                    <span className="block text-[13px] leading-snug text-muted-foreground">
                      {detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      {/* 5. Pago en segundo plano */}
      <div className="ch-container pb-ch-2xl">
        <details className="group rounded-[1.75rem] border border-border bg-surface/70">
          <summary className="ch-touch flex cursor-pointer list-none items-center justify-between gap-ch-md p-ch-lg">
            <span className="min-w-0">
              <span className="block text-[17px] font-bold text-foreground">
                Paga tu cuenta
              </span>
              <span className="block text-[14px] text-muted-foreground">
                Disponible como siempre, aunque ahora la prioridad es tu suministro.
              </span>
            </span>
            <ChevronDown
              className="size-6 shrink-0 text-primary transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="px-ch-lg pb-ch-lg">
            <PayExpressCard className="max-w-none rounded-card bg-transparent p-0 shadow-none backdrop-blur-none" />
          </div>
        </details>
      </div>
    </div>
  );
}

export default EmergenciaHome;
