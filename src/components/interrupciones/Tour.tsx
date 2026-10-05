import { useEffect, useLayoutEffect, useState } from "react";
import { X, ArrowRight, Check } from "lucide-react";

type Step = {
  selector: string;
  title: string;
  body: string;
  vista?: "cliente" | "operativa";
  mobileView?: "lista" | "mapa";
  padding?: number;
};

const ALL_STEPS: Step[] = [
  {
    selector: '[data-tour="toggle"]',
    title: "Cambia de vista cuando quieras",
    body: "Elige “Mi suministro” para saber si tu luz está cortada, o “Mapa de cortes” para ver todos los cortes de la región.",
    padding: 10,
  },
  {
    selector: '[data-tour="buscador"]',
    title: "Encuentra tu corte rápido",
    body: "Busca por N° de cliente, N° de aviso, sector o comuna. Al escribir tu N° de cliente el mapa se enfoca en tu corte.",
    vista: "operativa",
    padding: 8,
  },
  {
    selector: '[data-tour="lista"]',
    title: "Lista de cortes por comuna",
    body: "Los cortes están agrupados por comuna, ordenados por cantidad. Toca uno para verlo en el mapa.",
    vista: "operativa",
    mobileView: "lista",
    padding: 8,
  },
  {
    selector: '[data-tour="mapa"]',
    title: "Explora el mapa",
    body: "Cada punto es un corte. Toca uno para ver el detalle y filtrar la lista solo a ese corte.",
    vista: "operativa",
    mobileView: "mapa",
    padding: 6,
  },

];

const FALLBACK_STEP: Step = {
  selector: '[data-tour="toggle"]',
  title: "Cambia de vista cuando quieras",
  body: "Elige la información que necesitas consultar.",
};

type Rect = { top: number; left: number; width: number; height: number };

export default function Tour({
  onClose,
  onVistaChange,
  vistaActual,
}: {
  onClose: () => void;
  onVistaChange: (v: "cliente" | "operativa") => void;
  vistaActual: "cliente" | "operativa";
}) {
  const STEPS = vistaActual === "cliente" ? ALL_STEPS.slice(0, 1) : ALL_STEPS;
  const [i, setI] = useState(0);
  const step = STEPS[i] ?? FALLBACK_STEP;
  const [rect, setRect] = useState<Rect | null>(null);
  const [vh, setVh] = useState(0);
  const [vw, setVw] = useState(0);

  // Aplicar contexto (vista, mobileView) al cambiar de paso
  useEffect(() => {
    if (step.vista) onVistaChange(step.vista);
    if (step.mobileView) {
      window.dispatchEvent(
        new CustomEvent("tour:mobile-view", { detail: step.mobileView }),
      );
    }
  }, [i, step, onVistaChange]);

  // Medir target
  useLayoutEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    const measure = () => {
      const els = Array.from(
        document.querySelectorAll(step.selector),
      ) as HTMLElement[];
      // Elegir el primer elemento visible (offsetParent != null y tamaño > 0)
      const el =
        els.find((e) => {
          if (e.offsetParent === null && getComputedStyle(e).position !== "fixed") return false;
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }) ?? els[0] ?? null;
      setVh(window.innerHeight);
      setVw(window.innerWidth);
      if (!el) {
        setRect(null);
        return;
      }
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    // Dos rAF para dejar que cambien vista/mobileView y layout se estabilice
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(measure);
    });
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [i, step.selector]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const next = () => (i < STEPS.length - 1 ? setI(i + 1) : onClose());
  const prev = () => i > 0 && setI(i - 1);

  const pad = step.padding ?? 8;
  const box = rect
    ? {
        top: Math.max(4, rect.top - pad),
        left: Math.max(4, rect.left - pad),
        width: Math.min(vw - 8, rect.width + pad * 2),
        height: rect.height + pad * 2,
      }
    : null;

  // Posición del tooltip: debajo si hay espacio, si no arriba
  const tooltipW = Math.min(360, vw - 24);
  let tipTop = 0;
  let tipLeft = 12;
  if (box) {
    const spaceBelow = vh - (box.top + box.height);
    const belowsFit = spaceBelow > 220;
    tipTop = belowsFit ? box.top + box.height + 12 : Math.max(12, box.top - 220);
    tipLeft = Math.min(
      Math.max(12, box.left + box.width / 2 - tooltipW / 2),
      vw - tooltipW - 12,
    );
  } else {
    tipTop = vh / 2 - 100;
    tipLeft = vw / 2 - tooltipW / 2;
  }

  return (
    <div className="fixed inset-0 z-[1000]" aria-modal="true" role="dialog">
      {/* Spotlight: overlay oscuro con recorte por box-shadow */}
      {box ? (
        <div
          className="pointer-events-none absolute rounded-[16px] transition-all duration-200"
          style={{
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
            boxShadow: "0 0 0 9999px color-mix(in oklab, var(--foreground) 66%, transparent)",
            outline: "3px solid var(--primary)",
            outlineOffset: 2,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-foreground/60" />
      )}

      {/* Click en zona oscura cierra */}
      <button
        aria-label="Cerrar tour"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        style={{ background: "transparent" }}
      />

      {/* Tooltip card */}
      <div
        className="absolute rounded-card bg-surface p-4 shadow-modal ring-1 ring-border"
        style={{ top: tipTop, left: tipLeft, width: tooltipW }}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-sm font-bold uppercase text-primary">
              Paso {i + 1} de {STEPS.length}
            </p>
            <h3 className="mt-1 text-base font-extrabold text-foreground">
              {step.title}
            </h3>
            <p className="mt-1.5 text-base leading-snug text-muted-foreground">
              {step.body}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="ch-touch shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progreso */}
        <div className="mt-3 flex items-center gap-1.5">
          {STEPS.map((_, k) => (
            <span
              key={k}
              className={`h-1.5 flex-1 rounded-full transition ${
                k <= i ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="ch-touch text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Saltar
          </button>
          <div className="flex items-center gap-2">
            {i > 0 && (
              <button
                onClick={prev}
                className="ch-touch rounded-pill border border-border px-3 py-1.5 text-sm font-bold text-foreground hover:bg-muted"
              >
                Atrás
              </button>
            )}
            <button
              onClick={next}
              className="ch-touch inline-flex items-center gap-1.5 rounded-pill bg-primary px-4 py-1.5 text-sm font-bold uppercase text-primary-foreground hover:bg-primary-hover"
            >
              {i === STEPS.length - 1 ? (
                <>
                  Listo <Check className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Siguiente <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
