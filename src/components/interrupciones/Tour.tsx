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
  {
    selector: '[data-tour="repuestos"]',
    title: "Mira los repuestos recientes",
    body: "Activa “Ver repuestos” para mostrar en el mapa los servicios que ya volvieron en las últimas 24 horas.",
    vista: "operativa",
    padding: 8,
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
            boxShadow: "0 0 0 9999px rgba(15, 18, 32, 0.66)",
            outline: "3px solid #DA291C",
            outlineOffset: 2,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/60" />
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
        className="absolute rounded-[15px] bg-white p-4 shadow-2xl ring-1 ring-black/5"
        style={{ top: tipTop, left: tipLeft, width: tooltipW }}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#DA291C]">
              Paso {i + 1} de {STEPS.length}
            </p>
            <h3 className="mt-1 text-base font-extrabold text-[#373B53]">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-snug text-[#373B53]/80">
              {step.body}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded-full p-1 text-[#373B53]/60 hover:bg-neutral-100"
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
                k <= i ? "bg-[#DA291C]" : "bg-neutral-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#373B53]/60 hover:text-[#373B53]"
          >
            Saltar
          </button>
          <div className="flex items-center gap-2">
            {i > 0 && (
              <button
                onClick={prev}
                className="rounded-[30px] border border-neutral-200 px-3 py-1.5 text-xs font-bold text-[#373B53] hover:bg-neutral-50"
              >
                Atrás
              </button>
            )}
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-[30px] bg-[#DA291C] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:brightness-110"
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
