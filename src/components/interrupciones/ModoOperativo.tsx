import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  INTERRUPCIONES,
  ULTIMA_ACTUALIZACION,
  totales as totalesGlobales,
  agruparPorComuna,
  buscarPorNIS,
  estadoETR,
  type Interrupcion,
} from "@/lib/interrupciones-data";
import ClientOnlyMap from "./ClientOnlyMap";
import { CorteCard, ListaVacia, haceCuanto } from "./shared";
import TendenciaAfectados from "./TendenciaAfectados";
import { Users, X, ChevronDown, Hash } from "lucide-react";

type CategoriaMapa = "interrupciones" | "desconexiones";

export default function ModoOperativo({ onVolver, viewToggle }: { onVolver: () => void; viewToggle: ReactNode }) {
  const [categoria, setCategoria] = useState<CategoriaMapa>("interrupciones");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [selFromMap, setSelFromMap] = useState(false);
  const [mobileView, setMobileView] = useState<"lista" | "mapa">(
    typeof window !== "undefined" && window.innerWidth < 1024 ? "mapa" : "lista",
  );
  const tGlobal = useMemo(() => totalesGlobales(), []);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Sincronía con el tour: cambia lista/mapa según el paso activo (mobile)
  useEffect(() => {
    const onMv = (e: Event) => {
      const detail = (e as CustomEvent<"lista" | "mapa">).detail;
      if (detail === "lista" || detail === "mapa") setMobileView(detail);
    };
    window.addEventListener("tour:mobile-view", onMv);
    return () => window.removeEventListener("tour:mobile-view", onMv);
  }, []);

  // Al seleccionar un corte desde el mapa en mobile: llevar el mapa al top
  // (bajo la barra de estado) para dejar mapa arriba + card debajo, ambos visibles.
  const mapaWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selFromMap || !sel) return;
    if (window.innerWidth >= 1024) return;
    const el = mapaWrapRef.current;
    if (!el) return;
    const t = window.setTimeout(() => {
      const y = el.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 150);
    return () => window.clearTimeout(t);
  }, [selFromMap, sel]);



  const items = useMemo(() => {
    const clean = q.trim();
    const coincideCategoria = (i: Interrupcion) =>
      categoria === "desconexiones" ? i.tipo === "programado" : i.tipo !== "programado";
    // Búsqueda por NIS: si matchea, mostramos solo ese corte (respetando otros filtros)
    if (/^\d{5,8}$/.test(clean)) {
      const r = buscarPorNIS(clean);
      if (r.kind === "masiva") {
        return INTERRUPCIONES.filter((i) => {
          if (!coincideCategoria(i)) return false;
          if (i.nr_orden !== r.i.nr_orden) return false;
          return true;
        });
      }
    }
    return INTERRUPCIONES.filter((i) => {
      if (!coincideCategoria(i)) return false;
      if (clean) {
        const s = clean.toLowerCase();
        if (!(i.nr_orden.toLowerCase().includes(s) || i.sector.toLowerCase().includes(s) || i.comuna.toLowerCase().includes(s))) {
          return false;
        }
      }
      return true;
    });
  }, [q, categoria]);

  const seleccionada = items.find((i) => i.nr_orden === sel) ?? null;
  const itemsLista = selFromMap && seleccionada ? [seleccionada] : items;
  const grouped = useMemo(() => agruparPorComuna(itemsLista), [itemsLista]);

  const totales = useMemo(
    () => ({
      cortes: items.length,
      afectados: items.reduce((s, i) => s + i.cant_clientes, 0),
    }),
    [items],
  );

  return (
    <div className="ch-container min-w-0 py-ch-lg">
      <section aria-label="Consulta de cortes" className="mb-ch-lg min-w-0 border border-border rounded-card bg-[#F5F6F8] p-ch-base">
        <div className="mb-ch-base flex justify-center lg:justify-end" data-tour="toggle">
          {viewToggle}
        </div>
        <div className="mb-ch-base grid min-w-0 gap-ch-sm text-sm text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div aria-live="polite" className="flex min-w-0 flex-wrap items-center gap-x-ch-lg gap-y-ch-sm">
            <span key={tick} title={`Actualizado ${haceCuanto(ULTIMA_ACTUALIZACION)}`}>Datos en línea</span>
            <span className="inline-flex items-center gap-ch-sm">
              <span aria-hidden className="size-3 shrink-0 rounded-full bg-status-active" />
              {tGlobal.activos} cortes activos
            </span>
            <span className="inline-flex items-center gap-ch-sm">
              <Users className="size-5 shrink-0" aria-hidden /> {tGlobal.afectados.toLocaleString("es-CL")} afectados
            </span>
          </div>
          <p className="min-w-0 lg:text-right">
            <strong className="text-foreground">{totales.cortes}</strong> cortes filtrados ·{" "}
            <strong className="text-foreground">{totales.afectados.toLocaleString("es-CL")}</strong> clientes
          </p>
        </div>
        <div className="grid min-w-0 gap-ch-md lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="grid min-w-0 grid-cols-2 gap-1 rounded-pill bg-tab-track p-1" role="tablist" aria-label="Tipo de evento">
            {(["interrupciones", "desconexiones"] as const).map((tipo) => (
              <Button
                key={tipo}
                type="button"
                role="tab"
                aria-selected={categoria === tipo}
                size="sm"
                variant={categoria === tipo ? "primary" : "ghost"}
                className="min-w-0 rounded-pill px-4"
                onClick={() => {
                  setCategoria(tipo);
                  setSel(null);
                  setSelFromMap(false);
                }}
              >
                {tipo === "interrupciones" ? "Interrupciones" : "Desconexiones"}
              </Button>
            ))}
          </div>
          <div className="relative min-w-0" data-tour="buscador">
            <Hash className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={q}
              aria-label="Buscar cortes por comuna, sector, cliente u orden"
              onChange={(e) => {
                const v = e.target.value;
                setQ(v);
                const clean = v.trim();
                if (/^\d{5,8}$/.test(clean)) {
                  const r = buscarPorNIS(clean);
                  if (r.kind === "masiva") setSel(r.i.nr_orden);
                }
              }}
              placeholder="Buscar por comuna o sector..."
              style={{ height: 44, minHeight: 44 }}
              className="min-w-0 py-0 rounded-pill border-border pl-11 pr-12 text-base md:text-sm"
            />
            {q && (
              <Button variant="ghost" size="icon" aria-label="Limpiar búsqueda" className="absolute right-1.5 top-1/2 size-7 -translate-y-1/2 rounded-full" onClick={() => { setQ(""); setSel(null); setSelFromMap(false); }}>
                <X aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </section>

      <TendenciaAfectados afectadosActuales={tGlobal.afectados} />

      {/* Toggle Lista/Mapa solo mobile */}
      <div className="mb-3 flex lg:hidden">

        <div className="inline-flex w-full rounded-pill border border-border bg-card p-1">
          <button
            onClick={() => setMobileView("lista")}
            className={`flex-1 rounded-pill px-3 py-1.5 text-xs font-semibold transition ${
              mobileView === "lista"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Lista ({totales.cortes})
          </button>
          <button
            onClick={() => setMobileView("mapa")}
            className={`flex-1 rounded-pill px-3 py-1.5 text-xs font-semibold transition ${
              mobileView === "mapa"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Mapa
          </button>
        </div>
      </div>

      {/* Split */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* Lista */}
        <div data-tour="lista" className={`min-w-0 ${mobileView === "mapa" ? "hidden lg:block" : ""}`}>
          {Object.keys(grouped).length === 0 && <ListaVacia />}


          {selFromMap && seleccionada && (
            <div className="mb-2 flex items-center justify-between rounded-card border border-primary/40 bg-primary/5 px-3 py-2 text-xs">
              <span className="text-foreground">
                Mostrando el corte seleccionado en el mapa
              </span>
              <button
                onClick={() => {
                  setSel(null);
                  setSelFromMap(false);
                }}
                className="inline-flex items-center gap-1 rounded-pill px-2 py-1 font-semibold text-primary hover:bg-primary/10"
              >
                <X className="h-3 w-3" /> Ver todos
              </button>
            </div>
          )}

          <div className="space-y-2">

            {Object.entries(grouped)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([comuna, arr]) => (
                <ComunaAccordion
                  key={comuna}
                  comuna={comuna}
                  items={arr}
                  sel={sel}
                  onSelect={(id) => {
                    const same = id === sel;
                    setSel(same ? null : id);
                    setSelFromMap(false);
                    if (!same) setMobileView("mapa");
                  }}
                />
              ))}
          </div>
        </div>

        {/* Mapa */}
        <div
          data-tour="mapa"
          ref={mapaWrapRef}
          className={`min-w-0 lg:sticky lg:top-24 lg:self-start ${
            mobileView === "lista" ? "hidden lg:block" : ""
          }`}
        >

          <div
            className={`lg:h-[min(65vh,640px)] ${
              seleccionada ? "h-[48svh]" : "h-[calc(100vh-14rem)]"
            }`}
          >
            <ClientOnlyMap
              items={items}
              seleccionada={sel}
              focus={seleccionada}
              onSelect={(id) => {
                setSel(id);
                setSelFromMap(true);
              }}
              height="100%"
            />
          </div>
          {seleccionada && (
            <div className="relative mt-3 lg:hidden">
              <button
                onClick={() => {
                  setSel(null);
                  setSelFromMap(false);
                }}
                aria-label="Cerrar detalle"
                className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <CorteCard i={seleccionada} variant="mapa" activo />
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <LegendDot color="var(--status-active)" label="Falla imprevista con hora estimada" />
            <LegendDot color="var(--status-scheduled)" label="Trabajo programado" />
            <LegendDot color="var(--status-expired)" label="Sin hora confirmada" />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onVolver();
              window.setTimeout(() => document.querySelector("#reportar")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}
            className="mt-ch-base h-auto w-full min-w-0 whitespace-normal px-ch-base py-ch-md text-center text-base"
          >
            Reportar un corte que no aparece en el mapa
          </Button>
        </div>
      </div>
    </div>

  );
}



function ComunaAccordion({
  comuna,
  items,
  sel,
  onSelect,
}: {
  comuna: string;
  items: Interrupcion[];
  sel: string | null;
  onSelect: (id: string) => void;
}) {
  const contieneSel = sel !== null && items.some((i) => i.nr_orden === sel);
  const [open, setOpen] = useState(contieneSel);

  useEffect(() => {
    if (contieneSel) setOpen(true);
  }, [contieneSel]);
  const afectados = items.reduce((s, i) => s + i.cant_clientes, 0);
  const vencidas = items.filter((i) => estadoETR(i) !== "vigente").length;
  const soloProgramadas = items.every((i) => i.tipo === "programado");
  return (
    <section className="overflow-hidden rounded-card border border-border bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-muted/50"
        aria-expanded={open}
      >
        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-primary px-2 text-sm font-bold text-primary-foreground">
          {items.length}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-foreground">{comuna}</h2>
          <p className="truncate text-sm text-muted-foreground">
            {items.length} {soloProgramadas ? (items.length === 1 ? "desconexión" : "desconexiones") : (items.length === 1 ? "interrupción" : "interrupciones")}
            {!soloProgramadas && <> · {afectados.toLocaleString("es-CL")} clientes afectados</>}
            {!soloProgramadas && vencidas > 0 && (
              <>
                {" "}·{" "}
                <span className="font-semibold text-[color:var(--status-expired)]">
                  {vencidas} sin hora confirmada
                </span>
              </>
            )}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="space-y-2 border-t border-border bg-background/40 p-3">
          {items.map((i) => (
            <CorteCard
              key={i.nr_orden}
              i={i}
              variant="mapa"
              activo={sel === i.nr_orden}
              onClick={() => onSelect(i.nr_orden)}
              showCentrar
              scrollOnActive
              hideTracker={i.tipo === "programado"}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: color, boxShadow: "0 0 0 2px white" }}
      />
      {label}
    </span>
  );
}

