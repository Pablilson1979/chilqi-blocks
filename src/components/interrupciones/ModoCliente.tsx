import { useState, type ReactNode } from "react";
import {
  buscarPorNIS,
  buscarPorDireccion,
  buscarPorOrden,
  estadoETR,
  INTERRUPCIONES,
  type Interrupcion,
  type ResultadoBusqueda,
  type Hito,
} from "@/lib/interrupciones-data";
import { CorteCard, formatHora } from "./shared";
import ClientOnlyMap from "./ClientOnlyMap";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Hash,
  Check,
  HelpCircle,
  Home,
  ClipboardList,
  FlaskConical,
  Bell,
  PartyPopper,
} from "lucide-react";

/* ---------------- Escenarios de prototipo ---------------- */

type EscenarioId =
  | "sin_corte"
  | "vigente"
  | "reprogramando"
  | "investigacion"
  | "avance_terreno"
  | "individual"
  | "restablecido";

const ESCENARIOS: Array<{ id: EscenarioId; label: string }> = [
  { id: "sin_corte", label: "Sin corte" },
  { id: "vigente", label: "Corte confirmado con hora" },
  { id: "reprogramando", label: "Reprogramando la hora" },
  { id: "investigacion", label: "Falla en investigación" },
  { id: "avance_terreno", label: "Técnicos en el lugar" },
  { id: "individual", label: "Solicitud individual" },
  { id: "restablecido", label: "Servicio restablecido" },
];

const NIS_DEMO = "1234567";

function pickBase(): Interrupcion {
  const selected =
    INTERRUPCIONES.find((i) => i.tipo !== "programado" && estadoETR(i) === "vigente") ??
    INTERRUPCIONES[0];
  if (!selected) {
    throw new Error("No hay interrupciones disponibles para el prototipo");
  }
  return selected;
}

function isoMinusMin(m: number): string {
  return new Date(Date.now() - m * 60_000).toISOString();
}

/** Fuerza los 5 hitos oficiales al avance solicitado. avance = 1..5 (cuántos hitos completados). */
function hitosForzados(avance: number): Hito[] {
  // Nota: el Tracker deriva 5 pasos oficiales; sólo necesita 4 hitos base (confirmado/cuadrilla/terreno/repuesto)
  // porque "revision" se calcula como intermedio si hay repuesto+terreno.
  const base: Array<{ key: Hito["key"]; label: string; hace: number }> = [
    { key: "confirmado", label: "Corte confirmado", hace: 55 },
    { key: "cuadrilla", label: "Móvil asignado", hace: 40 },
    { key: "terreno", label: "Técnicos trabajando en el lugar", hace: 22 },
    { key: "repuesto", label: "Suministro recuperado", hace: 0 },
  ];
  return base.map((b, k) => ({
    key: b.key,
    label: b.label,
    at: k < avance ? isoMinusMin(b.hace) : null,
  }));
}

/* ---------------- Página ---------------- */

type TabId = "nis" | "direccion" | "orden";

export default function ModoCliente({
  onIrOperativo: _,
  viewToggle,
}: {
  onIrOperativo: () => void;
  viewToggle: ReactNode;
}) {
  const [tab, setTab] = useState<TabId>("nis");
  const [nis, setNis] = useState("");
  const [dir, setDir] = useState("");
  const [orden, setOrden] = useState("");
  const [res, setRes] = useState<ResultadoBusqueda | null>(null);
  const [escenario, setEscenario] = useState<EscenarioId | null>(null);

  function reset() {
    setRes(null);
    setEscenario(null);
  }

  function aplicarEscenario(id: EscenarioId) {
    setEscenario(id);
    setRes(null);
    setNis(NIS_DEMO);
    setTab("nis");
  }

  function onBuscarNIS(e: React.FormEvent) {
    e.preventDefault();
    setEscenario(null);
    const clean = nis.replace(/\s/g, "");
    if (!clean) return;
    setRes(buscarPorNIS(clean));
  }

  function onBuscarDireccion(e: React.FormEvent) {
    e.preventDefault();
    setEscenario(null);
    setRes(buscarPorDireccion(dir));
  }

  function onBuscarOrden(e: React.FormEvent) {
    e.preventDefault();
    setEscenario(null);
    setRes(buscarPorOrden(orden));
  }

  return (
    <div className="ch-container pb-16 pt-ch-lg">
      {/* Franja superior con el selector: misma posición que en Mapa de cortes */}
      <section
        aria-label="Selector de vista"
        className="mb-ch-lg min-w-0 border border-border rounded-card bg-[#F5F6F8] p-ch-base"
      >
        <div className="flex justify-center lg:justify-end" data-tour="toggle">
          {viewToggle}
        </div>
      </section>

      <div id="reportar" className="min-w-0 rounded-card bg-card p-5 shadow-sm sm:p-7">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-primary" /> Estado de tu suministro
        </div>
        <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          ¿Estás sin luz?
        </h2>
        <p className="mt-1 text-base text-muted-foreground">
          Consulta por <strong>N° de cliente</strong>, <strong>dirección</strong> o <strong>N° de orden</strong>.
        </p>

        {/* Tabs */}
        <div role="tablist" className="mt-4 inline-flex w-full rounded-pill bg-muted p-1 sm:w-auto">
          {(
            [
              { id: "nis", label: "N° cliente", icon: Hash },
              { id: "direccion", label: "Dirección", icon: Home },
              { id: "orden", label: "N° de orden", icon: ClipboardList },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => {
                setTab(id);
                reset();
              }}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-pill px-3.5 py-1.5 text-xs font-bold transition sm:flex-none ${
                tab === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        {tab === "nis" && (
          <form onSubmit={onBuscarNIS} className="mt-4">
            <label htmlFor="nis" className="sr-only">N° de cliente</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Hash className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="nis"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Ej: 1234567"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  className="h-14 w-full rounded-pill border border-border bg-background pl-11 pr-4 text-base font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button type="submit" className="h-14 rounded-pill bg-primary px-7 text-sm font-bold uppercase tracking-normal text-primary-foreground transition hover:brightness-110 active:scale-[0.98]">
                Consultar
              </button>
            </div>
            <button type="button" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-3.5 w-3.5" /> ¿Dónde encuentro mi N° de cliente?
            </button>
          </form>
        )}

        {tab === "direccion" && (
          <form onSubmit={onBuscarDireccion} className="mt-4">
            <label htmlFor="dir" className="sr-only">Dirección</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Home className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="dir"
                  autoComplete="off"
                  placeholder="Ej: Av. Argentina, Valparaíso"
                  value={dir}
                  onChange={(e) => setDir(e.target.value)}
                  className="h-14 w-full rounded-pill border border-border bg-background pl-11 pr-4 text-base font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button type="submit" className="h-14 rounded-pill bg-primary px-7 text-sm font-bold uppercase tracking-normal text-primary-foreground hover:brightness-110">
                Consultar
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Ubicamos tu domicilio en la red y te decimos si hay corte reconocido.
            </p>
          </form>
        )}


        {tab === "orden" && (
          <form onSubmit={onBuscarOrden} className="mt-4">
            <label htmlFor="orden" className="sr-only">N° de orden</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <ClipboardList className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="orden"
                  autoComplete="off"
                  placeholder="Ej: 471001-1"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="h-14 w-full rounded-pill border border-border bg-background pl-11 pr-4 text-base font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button type="submit" className="h-14 rounded-pill bg-primary px-7 text-sm font-bold uppercase tracking-normal text-primary-foreground hover:brightness-110">
                Consultar
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Ingresa el número asociado a tu solicitud o interrupción.
            </p>
          </form>
        )}
      </div>

      {/* Resultado dentro de la card, bajo el formulario */}
      {escenario && (
        <div className="mt-4">
          <EscenarioCard id={escenario} />
        </div>
      )}

      {/* Resultados reales de búsqueda */}
      {!escenario && res?.kind === "no_encontrado" && (
        <div className="mt-4 rounded-card border border-border bg-muted/40 p-5 text-base text-muted-foreground">
          No encontramos suministros con esos datos. Revisa y vuelve a intentar.
        </div>
      )}

      {!escenario && res?.kind === "sin_corte" && (
        <div className="mt-4">
          <EscenarioCard id="sin_corte" nisReal={res.nis} />
        </div>
      )}

      {!escenario && res?.kind === "masiva" && (
        <div className="mt-4 space-y-3">
          <CorteCard i={res.i} variant="cliente" nis={res.nis} />
          <div className="overflow-hidden rounded-card border border-border">
            <ClientOnlyMap items={[res.i]} focus={res.i} cluster={false} height={220} seleccionada={res.i.nr_orden} />
          </div>
        </div>
      )}

      {!escenario && res?.kind === "individual" && (
        <div className="mt-4">
          <EscenarioCard id="individual" nisReal={res.nis} folio={res.solicitud.orden} />
        </div>
      )}
      </div>

      {/* Escenarios del prototipo — al final, fuera de la card */}
      <div className="mx-auto mt-4 w-full max-w-2xl">
        <EscenariosChips escenario={escenario} onSelect={aplicarEscenario} onReset={reset} />
      </div>
    </div>
  );
}

/* ---------------- Card según escenario ---------------- */

function EscenarioCard({
  id,
  nisReal,
  folio,
}: {
  id: EscenarioId;
  nisReal?: string;
  folio?: string;
}) {
  const base = pickBase();
  const nis = nisReal ?? NIS_DEMO;

  const btnActualizaciones = (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-pill bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-normal text-primary-foreground hover:brightness-110"
    >
      <Bell className="h-3.5 w-3.5" />
      {id === "reprogramando" ? "Avísame cuando haya nueva hora" : "Recibir actualizaciones"}
    </button>
  );

  const btnReportar = (
    <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
      <a href="#reportar">
        <img src="/icons/emergencia/reportarcorte.svg" alt="" aria-hidden className="size-5" />
        Reportar corte
      </a>
    </Button>
  );

  if (id === "sin_corte") {
    return (
      <CorteCard
        i={base}
        variant="cliente"
        nis={nis}
        kickerOverride={{ label: "Servicio normal", color: "var(--status-ok)" }}
        nivel2Override={
          <div>
            <p className="inline-flex items-center gap-2 text-[22px] font-extrabold leading-tight text-[color:var(--status-ok)]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[color-mix(in_oklab,var(--status-ok)_18%,transparent)]">
                <Check className="h-5 w-5" strokeWidth={3} />
              </span>
              Tu suministro está normal
            </p>
            <p className="mt-2 text-base text-muted-foreground">
              No registramos interrupciones en tu dirección.
            </p>
          </div>
        }
        contextoOverride={null}
        hideNoReporte
        hideTracker
        notaFinal={
          <>
            ¿Estás sin luz igual? Puede ser una falla interna o un corte muy reciente.{" "}
            <a href="#reportar" className="font-semibold text-primary hover:underline">
              Repórtalo y lo revisamos
            </a>
            .
          </>
        }
      />
    );
  }

  if (id === "vigente") {
    // Estado 2: baseline con hora display + tracker en avance medio
    const i: Interrupcion = { ...base, hitos: hitosForzados(2) };
    return <CorteCard i={i} variant="cliente" nis={nis} />;
  }

  if (id === "avance_terreno") {
    // Estado 5: mismo layout que 2, con pretitulo "Técnicos trabajando en el lugar"
    const i: Interrupcion = { ...base, hitos: hitosForzados(3) };
    return (
      <CorteCard
        i={i}
        variant="cliente"
        nis={nis}
        pretitulo="Técnicos trabajando en el lugar"
      />
    );
  }

  if (id === "reprogramando") {
    // Estado 3: sin hora display; título pequeño; tracker conserva avance
    const i: Interrupcion = { ...base, hitos: hitosForzados(2) };
    return (
      <CorteCard
        i={i}
        variant="cliente"
        nis={nis}
        kickerOverride={{ label: "Hora en actualización", color: "var(--status-expired)" }}
        nivel2Override={
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-muted-foreground">
              Reposición estimada
            </p>
            <p className="mt-0.5 text-[22px] font-extrabold leading-tight text-foreground">
              La reparación está tomando más tiempo
            </p>
            <p className="mt-2 text-base text-muted-foreground">
              La cuadrilla sigue trabajando en tu sector — el trabajo no se suspendió. Te daremos la nueva hora apenas el equipo en terreno la confirme.
            </p>
          </div>
        }
        trackerCurrentLabel="En curso — tomando más tiempo del estimado"
        ctaPrimario={btnActualizaciones}
      />
    );
  }

  if (id === "investigacion") {
    // Estado 4: paso 1 completado; solo sector · clientes (sin motivo)
    const i: Interrupcion = { ...base, hitos: hitosForzados(1) };
    const clientes = `${base.cant_clientes.toLocaleString("es-CL")} clientes afectados`;
    return (
      <CorteCard
        i={i}
        variant="cliente"
        nis={nis}
        kickerOverride={{ label: "En investigación", color: "var(--status-expired)" }}
        nivel2Override={
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-muted-foreground">
              Reposición estimada
            </p>
            <p className="mt-0.5 text-[22px] font-extrabold leading-tight text-foreground">
              Falla en investigación
            </p>
            <p className="mt-2 text-base text-muted-foreground">
              Publicaremos la hora estimada de reposición cuando el diagnóstico en terreno sea confiable.
            </p>
          </div>
        }
        contextoOverride={`${base.sector} · ${clientes}`}
        ctaPrimario={btnActualizaciones}
      />
    );
  }

  if (id === "individual") {
    // Estado 6: sin masiva; solo paso 1 completado
    const folioMostrar = folio ?? "SI-483920";
    const i: Interrupcion = { ...base, hitos: hitosForzados(1) };
    return (
      <CorteCard
        i={i}
        variant="cliente"
        nis={nis}
        kickerOverride={{ label: "Solicitud individual", color: "var(--status-expired)" }}
        nivel2Override={
          <div>
            <p className="text-[22px] font-extrabold leading-tight text-foreground">
              Tu solicitud fue ingresada
            </p>
            <p className="mt-2 text-base text-muted-foreground">
              Registramos tu reporte individual. Conoceremos más detalles cuando la cuadrilla esté en terreno.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              N° de folio <span className="font-semibold text-foreground">{folioMostrar}</span>
            </p>
          </div>
        }
        contextoOverride={null}
        hideNoReporte
        ctaPrimario={btnActualizaciones}
      />
    );
  }

  // id === "restablecido" — Estado 7
  const hitos = hitosForzados(4);
  const repuestoAt = hitos[hitos.length - 1]?.at ?? new Date().toISOString();
  const i: Interrupcion = { ...base, hitos };
  return (
    <CorteCard
      i={i}
      variant="cliente"
      nis={nis}
      kickerOverride={{ label: "Servicio restablecido", color: "var(--status-ok)" }}
      nivel2Override={
        <div>
          <p className="inline-flex items-center gap-2 text-[22px] font-extrabold leading-tight text-[color:var(--status-ok)]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[color-mix(in_oklab,var(--status-ok)_18%,transparent)]">
              <PartyPopper className="h-5 w-5" strokeWidth={2.5} />
            </span>
            Servicio restablecido
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            Tu suministro fue recuperado hoy a las {formatHora(repuestoAt).split(" · ")[0]} hrs.
          </p>
        </div>
      }
      contextoOverride={null}
      hideNoReporte
      notaFinal={
        <>
          ¿Sigues sin luz? Puede ser una falla interna de tu instalación.{" "}
          <a href="#reportar" className="font-semibold text-primary hover:underline">
            Repórtalo aquí
          </a>
          .
        </>
      }
    />
  );
}

/* ---------------- Chips de prueba (sobre la card) ---------------- */

function EscenariosChips({
  escenario,
  onSelect,
  onReset,
}: {
  escenario: EscenarioId | null;
  onSelect: (id: EscenarioId) => void;
  onReset: () => void;
}) {
  return (
    <div className="mt-4 rounded-card border border-dashed border-border bg-card/60 p-3">
      <div className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-normal text-muted-foreground">
        <FlaskConical className="h-3.5 w-3.5" />
        Escenarios del prototipo — se eliminan en producción
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ESCENARIOS.map((e) => (
          <button
            key={e.id}
            onClick={() => onSelect(e.id)}
            className={`rounded-pill border px-3 py-1 text-sm font-semibold transition ${
              escenario === e.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-primary/40"
            }`}
          >
            {e.label}
          </button>
        ))}
        {escenario && (
          <button
            onClick={onReset}
            className="rounded-pill border border-border bg-background px-3 py-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
