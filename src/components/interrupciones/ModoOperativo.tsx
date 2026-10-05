import { useEffect, useMemo, useRef, useState } from "react";
import {
  INTERRUPCIONES,
  REPUESTOS,
  ULTIMA_ACTUALIZACION,
  totales as totalesGlobales,
  agruparPorComuna,
  buscarPorNIS,
  estadoETR,
  type Interrupcion,
  type EstadoETR,
  type TipoCorte,
} from "@/lib/interrupciones-data";
import ClientOnlyMap from "./ClientOnlyMap";
import { CorteCard, ListaVacia, haceCuanto } from "./shared";
import TendenciaAfectados from "./TendenciaAfectados";
import { Users, X, ChevronDown, Search, RefreshCw, CheckCircle2 } from "lucide-react";

const TIPOS: TipoCorte[] = ["no_programado", "programado"];
const ESTADOS: EstadoETR[] = ["vigente", "vencida", "investigacion"];

type CategoriaMapa = "interrupciones" | "desconexiones";

export default function ModoOperativo({ onVolver }: { onVolver: () => void }) {
  const [categoria, setCategoria] = useState<CategoriaMapa>("interrupciones");
  const [q, setQ] = useState("");
  const [comunas, setComunas] = useState<Set<string>>(new Set());
  const [tipos, setTipos] = useState<Set<TipoCorte>>(new Set());
  const [estados, setEstados] = useState<Set<EstadoETR>>(new Set());
  const [sel, setSel] = useState<string | null>(null);
  const [selFromMap, setSelFromMap] = useState(false);
  const [mobileView, setMobileView] = useState<"lista" | "mapa">(
    typeof window !== "undefined" && window.innerWidth < 1024 ? "mapa" : "lista",
  );
  const [showRepuestos, setShowRepuestos] = useState(false);
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



  const listaComunas = useMemo(
    () => Array.from(new Set(INTERRUPCIONES.map((i) => i.comuna))).sort(),
    [],
  );

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
          if (comunas.size && !comunas.has(i.comuna)) return false;
          if (tipos.size && !tipos.has(i.tipo)) return false;
          if (estados.size && !estados.has(estadoETR(i))) return false;
          return true;
        });
      }
    }
    return INTERRUPCIONES.filter((i) => {
      if (!coincideCategoria(i)) return false;
      if (comunas.size && !comunas.has(i.comuna)) return false;
      if (tipos.size && !tipos.has(i.tipo)) return false;
      if (estados.size && !estados.has(estadoETR(i))) return false;
      if (clean) {
        const s = clean.toLowerCase();
        if (!(i.nr_orden.toLowerCase().includes(s) || i.sector.toLowerCase().includes(s) || i.comuna.toLowerCase().includes(s))) {
          return false;
        }
      }
      return true;
    });
  }, [q, comunas, tipos, estados, categoria]);

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

  function toggle<T>(set: Set<T>, v: T, setter: (n: Set<T>) => void) {
    const n = new Set(set);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    setter(n);
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div
          aria-live="polite"
          className="hidden flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground lg:flex"
        >
          <span className="inline-flex items-center gap-1.5" key={tick}>
            <RefreshCw className="h-3 w-3" /> Actualizado {haceCuanto(ULTIMA_ACTUALIZACION)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[color:var(--status-active)]" />
            {tGlobal.activos} corte{tGlobal.activos === 1 ? "" : "s"} activos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3 w-3" /> {tGlobal.afectados.toLocaleString("es-CL")} afectados
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">{totales.cortes}</strong> cortes filtrados ·{" "}
          <strong className="text-foreground">{totales.afectados.toLocaleString("es-CL")}</strong>{" "}
          clientes
        </p>
      </div>

      {/* Tabs + buscador + Ver repuestos */}
      <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
        <div className="mb-3 flex items-center gap-1 rounded-[30px] bg-muted p-1 sm:w-fit" role="tablist" aria-label="Tipo de evento">
          <button
            type="button"
            role="tab"
            aria-selected={categoria === "interrupciones"}
            onClick={() => {
              setCategoria("interrupciones");
              setSel(null);
              setSelFromMap(false);
            }}
            className={`flex-1 rounded-[30px] px-4 py-2 text-xs font-bold transition sm:flex-none ${
              categoria === "interrupciones" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Interrupciones
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={categoria === "desconexiones"}
            onClick={() => {
              setCategoria("desconexiones");
              setSel(null);
              setSelFromMap(false);
            }}
            className={`flex-1 rounded-[30px] px-4 py-2 text-xs font-bold transition sm:flex-none ${
              categoria === "desconexiones"
                ? "bg-[color:var(--status-scheduled)] text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Desconexiones
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2" data-tour="buscador">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                const v = e.target.value;
                setQ(v);
                // Enfocar automáticamente el corte de un N° cliente válido
                const clean = v.trim();
                if (/^\d{5,8}$/.test(clean)) {
                  const r = buscarPorNIS(clean);
                  if (r.kind === "masiva") setSel(r.i.nr_orden);
                }
              }}
              placeholder="Buscar por N° de cliente, N° de orden, sector o comuna..."
              className="h-10 w-full rounded-[30px] border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {categoria === "interrupciones" && <button
            type="button"
            data-tour="repuestos"
            onClick={() => setShowRepuestos((v) => !v)}
            aria-pressed={showRepuestos}
            className={`inline-flex h-10 items-center gap-2 rounded-[30px] border px-3.5 text-xs font-semibold transition ${
              showRepuestos
                ? "border-[color:var(--status-ok)] bg-[color-mix(in_oklab,var(--status-ok)_12%,transparent)] text-[color:var(--status-ok)]"
                : "border-border bg-card text-foreground hover:bg-muted"
            }`}
            title="Muestra en el mapa los servicios repuestos en las últimas 24h"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {showRepuestos ? "Ocultando repuestos" : "Ver repuestos"}
            <span
              className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                showRepuestos
                  ? "bg-[color:var(--status-ok)] text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {REPUESTOS.length}
            </span>
          </button>}

          {q ? (
            <button
              onClick={() => setQ("")}
              className="inline-flex items-center gap-1 rounded-[30px] px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" /> Limpiar
            </button>
          ) : null}
        </div>
      </div>

      <TendenciaAfectados afectadosActuales={tGlobal.afectados} />

      {/* Toggle Lista/Mapa solo mobile */}
      <div className="mb-3 flex lg:hidden">

        <div className="inline-flex w-full rounded-[30px] border border-border bg-card p-1">
          <button
            onClick={() => setMobileView("lista")}
            className={`flex-1 rounded-[30px] px-3 py-1.5 text-xs font-semibold transition ${
              mobileView === "lista"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Lista ({totales.cortes})
          </button>
          <button
            onClick={() => setMobileView("mapa")}
            className={`flex-1 rounded-[30px] px-3 py-1.5 text-xs font-semibold transition ${
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
            <div className="mb-2 flex items-center justify-between rounded-[15px] border border-primary/40 bg-primary/5 px-3 py-2 text-xs">
              <span className="text-foreground">
                Mostrando el corte seleccionado en el mapa
              </span>
              <button
                onClick={() => {
                  setSel(null);
                  setSelFromMap(false);
                }}
                className="inline-flex items-center gap-1 rounded-[30px] px-2 py-1 font-semibold text-primary hover:bg-primary/10"
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
          className={`min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] ${
            mobileView === "lista" ? "hidden lg:block" : ""
          }`}
        >

          <div
            className={`lg:h-full ${
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
              repuestos={showRepuestos ? REPUESTOS : undefined}
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
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <LegendDot color="var(--status-active)" label="Falla imprevista con hora estimada" />
            <LegendDot color="var(--status-scheduled)" label="Trabajo programado" />
            <LegendDot color="var(--status-expired)" label="Sin hora confirmada" />
            {showRepuestos && (
              <LegendDot color="#1f9d55" label="Repuesto (últimas 24h)" />
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onVolver();
              window.setTimeout(() => document.querySelector("#reportar")?.scrollIntoView({ behavior: "smooth" }), 100);
            }}
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-[30px] border border-primary bg-card px-5 py-2.5 text-center text-sm font-bold text-primary transition hover:bg-primary/5"
          >
            Reportar un corte que no aparece en el mapa
          </button>
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
    <section className="overflow-hidden rounded-[15px] border border-border bg-card">
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
          <p className="truncate text-[11px] text-muted-foreground">
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

