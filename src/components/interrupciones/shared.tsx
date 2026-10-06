import { useEffect, useRef } from "react";
import { causaVisible, estadoETR, type EstadoETR, type Hito, type Interrupcion } from "@/lib/interrupciones-data";
import { AlertTriangle, Check, Clock, MapPin, Search, User, Zap } from "lucide-react";

/* ---------------- Formatters ---------------- */

export function formatHora(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  const mo = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${hh}:${mm} · ${dd}/${mo}`;
}

function hhmm(d: Date): string {
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** "Hoy, 20:07 hrs" / "Mañana, 05:15 hrs" / "23-07, 20:07 hrs" */
export function formatFechaRelativa(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const hoy = new Date();
  const manana = new Date(hoy.getTime() + 86400000);
  if (sameDay(d, hoy)) return `Hoy, ${hhmm(d)} hrs`;
  if (sameDay(d, manana)) return `Mañana, ${hhmm(d)} hrs`;
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}, ${hhmm(d)} hrs`;
}

export function formatHoraCerrada(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return hhmm(d);
}

function formatFechaProgramada(inicio: string, termino: string | null): string {
  const desde = new Date(inicio);
  const fecha = `${desde.getDate().toString().padStart(2, "0")}/${(desde.getMonth() + 1).toString().padStart(2, "0")}/${desde.getFullYear()}`;
  const hasta = termino ? hhmm(new Date(termino)) : "Por confirmar";
  return `${fecha} · ${hhmm(desde)} - ${hasta} hrs`;
}

export function haceCuanto(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "hace instantes";
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  return `hace ${h} h`;
}

function toTitleCase(s: string): string {
  const minus = new Set(["de", "del", "la", "las", "los", "y", "el", "en"]);
  return s
    .toLowerCase()
    .split(/(\s+)/)
    .map((part, idx) => {
      if (/^\s+$/.test(part)) return part;
      if (idx !== 0 && minus.has(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

export { Search };

/* Chips (mantenidos por compatibilidad con otros consumidores) */
export function ChipTipo({ tipo }: { tipo: Interrupcion["tipo"] }) {
  const label = tipo === "programado" ? "Trabajo programado" : "Falla imprevista";
  return <span className="text-xs font-semibold text-muted-foreground">{label}</span>;
}
export function ChipETR({ i }: { i: Interrupcion }) {
  const est = estadoETR(i);
  const label = est === "vigente" ? "Hora estimada" : est === "vencida" ? "Recalculando la hora" : "Aún estamos evaluando";
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
      <Clock className="h-3 w-3" /> {label}
    </span>
  );
}

/* ---------------- Tracker (5 pasos oficiales) ---------------- */

const OFFICIAL_STEPS: Array<{ key: "confirmado" | "cuadrilla" | "terreno" | "revision" | "repuesto"; label: string }> = [
  { key: "confirmado", label: "Corte de suministro informado" },
  { key: "cuadrilla", label: "Móvil asignado" },
  { key: "terreno", label: "Técnicos trabajando en el lugar" },
  { key: "revision", label: "Trabajos en revisión" },
  { key: "repuesto", label: "Suministro recuperado" },
];

function derive5Steps(hitos: Hito[]): Array<{ label: string; at: string | null }> {
  const map: Record<string, string | null> = {};
  hitos.forEach((h) => (map[h.key] = h.at));
  // "revision" se marca cuando ya hay reposición; si terreno está hecho y repuesto no, queda como en curso (at: null).
  let revisionAt: string | null = null;
  if (map["repuesto"] && map["terreno"]) {
    const t = new Date(map["terreno"]).getTime();
    const r = new Date(map["repuesto"]).getTime();
    revisionAt = new Date(t + (r - t) / 2).toISOString();
  }
  return OFFICIAL_STEPS.map(({ key, label }) => {
    if (key === "revision") return { label, at: revisionAt };
    return { label, at: map[key] ?? null };
  });
}

export function Tracker({
  hitos,
  compact = false,
  desktopCompact = false,
  mapReference = false,
  currentLabel = "En curso",
}: {
  hitos: Hito[];
  compact?: boolean;
  desktopCompact?: boolean;
  mapReference?: boolean;
  currentLabel?: string;
}) {
  const steps = derive5Steps(hitos);
  // "en curso" = primer pendiente después del último hecho
  let lastDone = -1;
  steps.forEach((s, k) => {
    if (s.at) lastDone = k;
  });
  const currentIdx = lastDone < steps.length - 1 ? lastDone + 1 : -1;

  return (
    <ol className={`relative ${mapReference ? "" : compact ? "space-y-2" : desktopCompact ? "space-y-3.5 lg:space-y-1.5" : "space-y-3.5"} ${mapReference ? "" : "pl-1"}`}>
      {steps.map((s, k) => {
        const done = !!s.at;
        const isCurrent = k === currentIdx;
        const isLast = k === steps.length - 1;

        const dotCls = done
          ? "bg-[color-mix(in_oklab,var(--status-ok)_18%,transparent)] text-[color:var(--status-ok)]"
          : isCurrent
            ? "bg-warning-soft text-warning"
            : "bg-muted text-muted-foreground";
        const lineCls = done ? "bg-[color:var(--status-ok)]/50" : "bg-border";
        const textCls = done
          ? "text-foreground"
          : isCurrent
            ? "font-bold text-foreground"
            : "text-muted-foreground";

        return (
          <li key={k} className={`relative flex items-start gap-3 ${mapReference ? (isLast ? "min-h-10" : "min-h-[46px]") : desktopCompact ? "lg:gap-2" : ""}`}>
            <div className={`relative flex flex-col items-center ${mapReference ? "self-stretch" : ""}`}>
               <span className={`grid shrink-0 place-items-center rounded-full ${mapReference ? "size-7" : "h-6 w-6"} ${desktopCompact ? "lg:h-5 lg:w-5" : ""} ${mapReference && isCurrent ? "bg-warning text-info-foreground" : mapReference && !done ? "bg-border text-muted-foreground" : dotCls}`}>
                 {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : isCurrent ? <Zap className="h-3 w-3" strokeWidth={3} /> : !mapReference ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
              </span>
              {!isLast && (
                <span
                   className={`${mapReference ? "absolute bottom-0 top-7 bg-border" : `mt-0.5 flex-1 ${compact ? "min-h-3.5" : desktopCompact ? "min-h-[22px] lg:min-h-2.5" : "min-h-[22px]"} ${lineCls}`} w-0.5`}
                />
              )}
            </div>
            <div className={`min-w-0 flex-1 ${mapReference ? "pb-4 pt-1.5" : compact ? "pb-1" : desktopCompact ? "pb-1.5 lg:pb-0.5" : "pb-1.5"}`}>
              <p className={`text-base leading-tight ${mapReference ? done ? "font-semibold text-success" : "font-bold text-foreground" : textCls}`}>{mapReference && k === 0 ? "Corte informado" : s.label}</p>
              {(!mapReference || !done) && <p className={`mt-0.5 ${mapReference ? "text-base leading-tight" : "text-sm"} ${mapReference && isCurrent ? "text-warning" : "text-muted-foreground"}`}>
                {done ? formatHora(s.at) : isCurrent ? currentLabel : "Pendiente"}
              </p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------- CorteCard unificada ---------------- */

export type CorteCardVariant = "cliente" | "mapa";

export type CorteCardProps = {
  i: Interrupcion;
  variant: CorteCardVariant;
  /** Solo para variante cliente */
  nis?: string;
  activo?: boolean;
  onClick?: () => void;
  scrollOnActive?: boolean;
  className?: string;
  /** Muestra el link "Centrar" cuando la card no está activa (solo variante mapa) */
  showCentrar?: boolean;
  onCentrar?: (e: React.MouseEvent) => void;
  /** Texto adicional bajo Nivel 3 (ej: aviso de recálculo) — cliente */
  extraNota?: React.ReactNode;
  /** Oculta el tracker */
  hideTracker?: boolean;
  /** ---- Overrides para escenarios (estados) sin cambiar diseño ---- */
  kickerOverride?: { label: string; color: string } | null; // null => oculta kicker
  pretitulo?: React.ReactNode;
  nivel2Override?: React.ReactNode;
  contextoOverride?: React.ReactNode | null; // null => oculta contexto
  hideNoReporte?: boolean;
  notaFinal?: React.ReactNode;
  ctaPrimario?: React.ReactNode;
  hitosOverride?: Hito[];
  trackerCurrentLabel?: string;
};


export function CorteCard({
  i,
  variant,
  nis,
  activo = false,
  onClick,
  scrollOnActive = false,
  className = "",
  showCentrar = false,
  onCentrar,
  extraNota,
  hideTracker = false,
  kickerOverride,
  pretitulo,
  nivel2Override,
  contextoOverride,
  hideNoReporte = false,
  notaFinal,
  ctaPrimario,
  hitosOverride,
  trackerCurrentLabel,
}: CorteCardProps) {
  const est = estadoETR(i);
  const interactive = typeof onClick === "function";

  const secRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!scrollOnActive || !activo) return;
    secRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activo, scrollOnActive]);

  const isCliente = variant === "cliente";
  const compactTracker = variant === "mapa";

  // Nivel 1 — Identidad
  const identidad = isCliente ? (
    <div className="min-w-0">
      <p className="truncate text-[17px] font-extrabold leading-tight text-foreground">{i.direccion}</p>
      {nis && (
        <p className="mt-0.5 text-sm text-muted-foreground">
          N° de cliente <span className="font-semibold text-foreground">{nis}</span>
        </p>
      )}
    </div>
  ) : (
    <div className="min-w-0">
      <p className="truncate text-base font-extrabold leading-tight text-foreground">
        {toTitleCase(i.sector)}, {i.comuna}
      </p>
    </div>
  );

  // Nivel 2 — La respuesta (o override)
  const nivel2 = nivel2Override ?? (() => {
    if (!isCliente && i.tipo === "programado") {
      return (
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-muted-foreground">Fecha y horario</p>
          <p className="mt-1 text-[18px] font-black leading-tight text-foreground">
            {formatFechaProgramada(i.inicio, i.etr_max)}
          </p>
        </div>
      );
    }
    if (est === "vigente" && i.etr_max) {
      return (
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-muted-foreground">Reposición estimada</p>
          <p
            className={`mt-0.5 font-black tabular-nums leading-none tracking-normal text-foreground ${
              variant === "cliente" ? "text-[38px]" : "text-[28px]"
            }`}
          >
            {formatFechaRelativa(i.etr_max)}
          </p>
        </div>
      );
    }
    const msg = est === "vencida" ? "Estamos recalculando la hora" : "Aún estamos evaluando el corte";
    return (
      <div>
        <p className="text-sm font-bold uppercase tracking-normal text-muted-foreground">Reposición estimada</p>
        <p className={`mt-0.5 font-extrabold leading-tight text-foreground ${variant === "cliente" ? "text-[22px]" : "text-[18px]"}`}>
          {msg}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Última actualización {haceCuanto(i.etr_updated_at)}</p>
      </div>
    );
  })();

  // Nivel 3 — Contexto
  const clientes = `${i.cant_clientes.toLocaleString("es-CL")} clientes afectados`;
  const contextoDefault = isCliente
    ? `${causaVisible(i)} · ${toTitleCase(i.sector)} · ${clientes}`
    : `${causaVisible(i)} · ${clientes}`;
  const contextoNode =
    contextoOverride === null
      ? null
      : contextoOverride !== undefined
        ? contextoOverride
        : contextoDefault;

  // Acción
  const mostrarCentrar = !isCliente && !activo && showCentrar;

  // Kicker de tipo/estado alineado al color del pin del mapa
  const kickerDefault = (() => {
    if (est === "investigacion" || est === "vencida") {
      return { label: est === "vencida" ? "Recalculando hora" : "En investigación", color: "var(--status-expired)" };
    }
    if (i.tipo === "programado") return { label: "Trabajo programado", color: "var(--status-scheduled)" };
    return { label: "Falla imprevista", color: "var(--status-active)" };
  })();
  const kicker = kickerOverride === undefined ? kickerDefault : kickerOverride;

  const hitosFinal = hitosOverride ?? i.hitos;

  const content = (
    <div className={`p-4 ${isCliente ? "sm:p-5" : ""}`}>
      {/* Kicker: tipo/estado del corte (coincide con el color del pin) */}
      {kicker && (
        <div className="mb-2 inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: kicker.color }}
            aria-hidden
          />
          <span
            className="text-sm font-bold uppercase tracking-normal"
            style={{ color: kicker.color }}
          >
            {kicker.label}
          </span>
        </div>
      )}
      {!isCliente && (
        <p className="mb-1.5 text-sm font-bold uppercase tracking-normal text-muted-foreground">
          Sectores:
        </p>
      )}
      {/* Nivel 1 */}
      <div className="flex items-start gap-2">
        <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${isCliente ? "text-primary" : "text-muted-foreground"}`} />
        {identidad}
      </div>

      {/* Pretitulo (paso activo del tracker, etc.) */}
      {pretitulo && (
        <p className="mt-3 text-sm font-bold uppercase tracking-normal text-muted-foreground">
          {pretitulo}
        </p>
      )}

      {/* Nivel 2 */}
      <div className={pretitulo ? "mt-1" : "mt-4"}>{nivel2}</div>

      {/* Nivel 3 */}
      {contextoNode && (
        <p className="mt-3 text-base leading-snug text-foreground/90">{contextoNode}</p>
      )}
      {isCliente && !hideNoReporte && (
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--status-ok)]">
          <Check className="h-3 w-3" strokeWidth={3} /> Este corte ya está registrado — no necesitas reportarlo.
        </p>
      )}
      {extraNota && <div className="mt-2 text-sm text-muted-foreground">{extraNota}</div>}

      {/* Nivel 4 — Tracker */}
      {!hideTracker && (
        <div className={`${compactTracker ? "mt-3 border-t border-dashed border-border pt-3" : "mt-5 border-t border-dashed border-border pt-4"}`}>
          <p className="mb-2 text-sm font-bold uppercase tracking-normal text-muted-foreground">
            Estado de la reparación
          </p>
          <Tracker
            hitos={hitosFinal}
            compact={compactTracker}
            {...(trackerCurrentLabel ? { currentLabel: trackerCurrentLabel } : {})}
          />
        </div>
      )}

      {ctaPrimario && <div className="mt-4">{ctaPrimario}</div>}
      {notaFinal && <div className="mt-3 text-base leading-snug text-muted-foreground">{notaFinal}</div>}

      {mostrarCentrar && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCentrar?.(e);
              onClick?.();
            }}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Centrar en el mapa
          </button>
        </div>
      )}
    </div>
  );


  const base = `block w-full overflow-hidden rounded-card border bg-card text-left transition ${
    activo ? "border-primary ring-2 ring-primary/25" : "border-border"
  } ${interactive ? "hover:border-primary/40" : ""} ${className}`;

  if (interactive) {
    return (
      <section
        ref={secRef}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={`${base} cursor-pointer`}
        role="button"
        tabIndex={0}
      >
        {content}
      </section>
    );
  }
  return (
    <section ref={secRef} className={base}>
      {content}
    </section>
  );
}

/** Estado vacío del panel de lista. */
export function ListaVacia() {
  return (
    <div className="rounded-card border border-dashed border-border bg-card p-6 text-center text-base text-muted-foreground">
      Sin cortes activos en esta búsqueda. Revisa <strong className="text-foreground">“Ver repuestos”</strong> para confirmar reposiciones recientes.
    </div>
  );
}

// Compatibilidad con firmas antiguas
export function formatRangoETR(_min: string | null, max: string | null): string {
  return formatFechaRelativa(max);
}
export function formatFechaLarga(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`;
}

// re-export types
export type { CorteCardVariant as Variant };
export { User };
