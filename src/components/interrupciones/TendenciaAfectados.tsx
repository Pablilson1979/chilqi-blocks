import { useMemo, useState } from "react";
import { ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Rango = "24h" | "3d" | "7d";

// Serie mock determinista (prototipo). Curva con pico y descenso progresivo.
function serie(rango: Rango, base: number) {
  const puntos = rango === "24h" ? 24 : rango === "3d" ? 24 : 28;
  const stepLabel = (i: number) => {
    if (rango === "24h") return `${String(i).padStart(2, "0")}:00`;
    if (rango === "3d") {
      const h = i * 3;
      const d = Math.floor(h / 24);
      const hh = h % 24;
      return `${["Lun", "Mar", "Mié"][d] ?? "Hoy"} ${String(hh).padStart(2, "0")}h`;
    }
    const dias = ["Mié", "Jue", "Vie", "Sáb", "Dom", "Lun", "Mar"];
    return dias[Math.floor(i / 4)] ?? "";
  };
  const pico = rango === "24h" ? 10 : rango === "3d" ? 12 : 14;
  return Array.from({ length: puntos }, (_, i) => {
    const dist = Math.abs(i - pico);
    const noise = Math.sin(i * 1.3) * 180;
    const factor = Math.max(0, 1 - dist / (puntos * 0.9));
    const value = Math.round(base * (0.55 + factor * 0.85) + noise);
    return { t: stepLabel(i), afectados: Math.max(200, value) };
  });
}

export default function TendenciaAfectados({ afectadosActuales }: { afectadosActuales: number }) {
  const [abierto, setAbierto] = useState(false);
  const [rango, setRango] = useState<Rango>("24h");
  const datos = useMemo(() => serie(rango, afectadosActuales), [rango, afectadosActuales]);

  // Delta última hora vs ahora (prototipo): diferencia entre los dos últimos puntos.
  const delta = useMemo(() => {
    if (datos.length < 2) return 0;
    const ultimo = datos.at(-1);
    const anterior = datos.at(-2);
    if (!ultimo || !anterior) return 0;
    return ultimo.afectados - anterior.afectados;
  }, [datos]);
  const subiendo = delta > 0;

  return (
    <section
      className="mb-4 hidden overflow-hidden rounded-2xl border border-border bg-card lg:block"
      aria-label="Tendencia de clientes afectados"
    >
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition hover:bg-muted/40"
        aria-expanded={abierto}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">
            Tendencia de clientes afectados
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              subiendo
                ? "bg-[color:var(--status-active)]/10 text-[color:var(--status-active)]"
                : "bg-emerald-500/10 text-emerald-600"
            }`}
          >
            {subiendo ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {subiendo ? "+" : ""}
            {delta.toLocaleString("es-CL")} última hora
          </span>
          <span className="hidden text-[11px] text-muted-foreground xl:inline">
            Actualizado 09:30
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${abierto ? "rotate-180" : ""}`}
        />
      </button>

      {abierto && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Clientes sin servicio en la región · vista histórica
            </p>
            <div className="inline-flex rounded-[30px] border border-border bg-background p-1">
              {(["24h", "3d", "7d"] as Rango[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRango(r)}
                  className={`rounded-[30px] px-3 py-1 text-[11px] font-semibold transition ${
                    rango === r
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r === "24h" ? "24 horas" : r === "3d" ? "3 días" : "7 días"}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={datos} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAfectados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="t"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tickFormatter={(v: number) => v.toLocaleString("es-CL")}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--muted-foreground)" }}
                  formatter={(v: number) => [v.toLocaleString("es-CL"), "Clientes"]}
                />
                <Area
                  type="monotone"
                  dataKey="afectados"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#gradAfectados)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}
