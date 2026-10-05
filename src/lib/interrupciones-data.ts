// Datos mock que emulan la respuesta real de las APIs Chilquinta.
// Cuando se conecte el backend, este archivo se reemplaza por server functions
// que consumen `/mapa_int/empresa/{empresa}/interrupciones` y afines.

export type TipoCorte = "no_programado" | "programado" | "mantencion";

export type EstadoETR = "vigente" | "vencida" | "investigacion";

export type HitoKey = "confirmado" | "cuadrilla" | "terreno" | "repuesto";

export interface Hito {
  key: HitoKey;
  label: string;
  at: string | null; // ISO — null => aún no ocurre
}

export interface Interrupcion {
  nr_orden: string;
  tipo: TipoCorte;
  etr_min: string | null; // ISO — límite inferior del rango
  etr_max: string | null; // ISO — límite superior. null => en investigación
  etr_updated_at: string; // ISO — última vez que se recalculó el ETR
  inicio: string; // ISO
  cant_clientes: number;
  comuna: string;
  sector: string;
  direccion: string; // dirección enmascarada asociada al suministro/cliente
  causa?: string;
  lat: number;
  lng: number;
  poligono: Array<[number, number]>;
  hitos: Hito[];
}

// --- Causas: solo lo que aparece en whitelist se muestra al cliente ---
export const CAUSAS_WHITELIST = new Set<string>([
  "Mantención programada de redes",
  "Trabajos de mejora en red",
  "Reemplazo de equipos",
  "Poste chocado por vehículo",
  "Bomberos en el sector",
  "Rama sobre conductor",
]);

export function causaVisible(i: Interrupcion): string {
  return i.causa && CAUSAS_WHITELIST.has(i.causa) ? i.causa : "Falla en investigación";
}

const now = Date.now();
const H = 3600_000;
const M = 60_000;

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const R = rand(42);

function ring(lat: number, lng: number, r = 0.006): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    pts.push([
      lat + Math.sin(a) * r + (R() - 0.5) * r * 0.25,
      lng + Math.cos(a) * r * 1.2 + (R() - 0.5) * r * 0.25,
    ]);
  }
  return pts;
}

const DISTRIBUCION: Array<{
  comuna: string;
  cortes: number;
  lat: number;
  lng: number;
  sectores: string[];
}> = [
  { comuna: "Valparaíso", cortes: 10, lat: -33.0472, lng: -71.6127, sectores: ["Cerro Alegre alto","Playa Ancha norte","Cerro Barón","Cerro Cordillera","Placilla oriente","Laguna Verde","Cerro Placeres","Rodelillo","Cerro Esperanza","Avenida Argentina"] },
  { comuna: "Nogales", cortes: 7, lat: -32.75, lng: -71.21, sectores: ["El Melón centro","Nogales pueblo","El Rincón","Los Maquis","Camino a Melón","Estación Nogales","La Peña"] },
  { comuna: "Hijuelas", cortes: 6, lat: -32.8, lng: -71.15, sectores: ["Ocoa","Romeral","Hijuelas centro","Petorquita","Purehue","La Vega"] },
  { comuna: "La Calera", cortes: 6, lat: -32.787, lng: -71.205, sectores: ["Calera centro","Artificio","El Manzano","Villa Bulnes","Los Álamos","La Calera norte"] },
  { comuna: "Limache", cortes: 5, lat: -33.01, lng: -71.267, sectores: ["San Francisco de Limache","Limache viejo","Los Laureles","Lliu Lliu","Cerro Limache"] },
  { comuna: "Concón", cortes: 4, lat: -32.925, lng: -71.53, sectores: ["Bosques de Montemar","Concón centro","Higuerillas","Costa de Montemar"] },
  { comuna: "Villa Alemana", cortes: 3, lat: -33.047, lng: -71.376, sectores: ["Peñablanca centro","Villa Hermosa","El Patagual"] },
  { comuna: "Quillota", cortes: 3, lat: -32.88, lng: -71.25, sectores: ["San Pedro","Quillota centro","Boco"] },
  { comuna: "La Cruz", cortes: 3, lat: -32.825, lng: -71.24, sectores: ["La Cruz centro","San Isidro","Pocochay"] },
  { comuna: "Santo Domingo", cortes: 2, lat: -33.642, lng: -71.635, sectores: ["Santo Domingo centro","Rocas de Santo Domingo"] },
  { comuna: "Puchuncaví", cortes: 2, lat: -32.725, lng: -71.413, sectores: ["Puchuncaví pueblo","Maitencillo"] },
  { comuna: "Quintero", cortes: 2, lat: -32.783, lng: -71.533, sectores: ["Quintero centro","Loncura"] },
  { comuna: "Viña del Mar", cortes: 2, lat: -33.0245, lng: -71.5518, sectores: ["Reñaca bajo","15 Norte con Libertad"] },
  { comuna: "Putaendo", cortes: 1, lat: -32.626, lng: -70.713, sectores: ["Putaendo centro"] },
  { comuna: "Panquehue", cortes: 1, lat: -32.81, lng: -70.9, sectores: ["Panquehue centro"] },
  { comuna: "Los Andes", cortes: 1, lat: -32.834, lng: -70.598, sectores: ["Los Andes centro"] },
  { comuna: "San Antonio", cortes: 1, lat: -33.592, lng: -71.61, sectores: ["Barrancas alto"] },
  { comuna: "Llay-Llay", cortes: 1, lat: -32.842, lng: -70.96, sectores: ["Llay-Llay centro"] },
];

const CAUSAS_NP = [
  "Falla en línea de media tensión", // no whitelist -> "en investigación"
  "Poste chocado por vehículo",
  "Bomberos en el sector",
  "Falla en transformador", // no whitelist
  "Rama sobre conductor",
  "Falla en investigación",
];
const CAUSAS_P = [
  "Mantención programada de redes",
  "Trabajos de mejora en red",
  "Reemplazo de equipos",
];

function buildHitos(inicioMs: number, etrMaxMs: number | null, avance: number): Hito[] {
  // avance: 0..1 fracción de la línea de tiempo cubierta
  const t = (frac: number) => new Date(inicioMs + frac * 15 * M).toISOString();
  const defs: Array<{ key: HitoKey; label: string; frac: number; minAvance: number }> = [
    { key: "confirmado", label: "Corte confirmado", frac: 0, minAvance: 0 },
    { key: "cuadrilla", label: "Técnicos en camino", frac: 1, minAvance: 0.25 },
    { key: "terreno", label: "Técnicos trabajando en el lugar", frac: 3, minAvance: 0.55 },
    { key: "repuesto", label: "Luz restablecida", frac: 6, minAvance: 1 },
  ];
  // Si hay ETR max, forzamos que el hito "repuesto" caiga cerca de etr_max
  return defs.map((d) => ({
    key: d.key,
    label: d.label,
    at: avance >= d.minAvance
      ? d.key === "repuesto" && etrMaxMs
        ? new Date(etrMaxMs).toISOString()
        : t(d.frac)
      : null,
  }));
}

function build(): Interrupcion[] {
  const out: Interrupcion[] = [];
  let idx = 0;
  for (const d of DISTRIBUCION) {
    for (let k = 0; k < d.cortes; k++) {
      idx++;
      const esProgramado = R() < 0.18;
      const rangoAncho = (30 + R() * 60) * M; // 30-90 min
      const centroOffset = (0.5 + R() * 4) * H;
      const inicioOffset = (0.2 + R() * 3) * H;
      const inicioMs = now - inicioOffset;

      const roll = R();
      let etrMinMs: number | null;
      let etrMaxMs: number | null;
      let updatedAtMs: number;

      if (esProgramado) {
        etrMaxMs = now + centroOffset;
        etrMinMs = etrMaxMs - rangoAncho;
        updatedAtMs = inicioMs;
      } else if (roll < 0.15) {
        // en investigación
        etrMinMs = null;
        etrMaxMs = null;
        updatedAtMs = now - (2 + R() * 25) * M;
      } else if (roll < 0.32) {
        // vencido
        etrMaxMs = now - R() * 40 * M;
        etrMinMs = etrMaxMs - rangoAncho;
        updatedAtMs = etrMaxMs - (5 + R() * 30) * M;
      } else {
        etrMaxMs = now + centroOffset;
        etrMinMs = etrMaxMs - rangoAncho;
        updatedAtMs = inicioMs + (5 + R() * 20) * M;
      }

      const avance =
        etrMaxMs && etrMaxMs > now
          ? Math.min(0.9, (now - inicioMs) / (etrMaxMs - inicioMs))
          : etrMaxMs
            ? 0.7 // vencido: probablemente equipo en terreno
            : 0.35; // investigación

      const jitterLat = (R() - 0.5) * 0.025;
      const jitterLng = (R() - 0.5) * 0.03;
      const lat = d.lat + jitterLat;
      const lng = d.lng + jitterLng;

      const sector = d.sectores[k % d.sectores.length] ?? d.comuna;
      const numero = Math.floor(100 + R() * 8999);
      const calles = ["Av. Principal", "Calle Bellavista", "Calle España", "Los Carrera", "San Martín", "Pedro Montt", "Av. Argentina", "Calle Blanco"];
      const calle = calles[Math.floor(R() * calles.length)];
      out.push({
        nr_orden: `47${(1000 + idx).toString()}-${k + 1}`,
        tipo: esProgramado ? "programado" : "no_programado",
        etr_min: etrMinMs ? new Date(etrMinMs).toISOString() : null,
        etr_max: etrMaxMs ? new Date(etrMaxMs).toISOString() : null,
        etr_updated_at: new Date(updatedAtMs).toISOString(),
        inicio: new Date(inicioMs).toISOString(),
        cant_clientes: Math.round(40 + R() * 3200),
        comuna: d.comuna,
        sector,
        direccion: `${calle} •• ${numero}, ${d.comuna}`,
        causa: esProgramado
          ? CAUSAS_P[Math.floor(R() * CAUSAS_P.length)]
          : CAUSAS_NP[Math.floor(R() * CAUSAS_NP.length)],
        lat,
        lng,
        poligono: ring(lat, lng, 0.004 + R() * 0.004),
        hitos: buildHitos(inicioMs, etrMaxMs, avance),
      });
    }
  }
  return out;
}

export const INTERRUPCIONES: Interrupcion[] = build();

export const ULTIMA_ACTUALIZACION = new Date(now - 4 * M).toISOString();

// --- Servicios repuestos en las últimas 24h (mock) ---
export interface Reposicion {
  nr_orden: string;
  sector: string;
  comuna: string;
  cant_clientes: number;
  lat: number;
  lng: number;
  repuesto_at: string; // ISO
  duracion_min: number;
}

const REPUESTOS_SEED: Array<{ sector: string; comuna: string; lat: number; lng: number; hace_min: number; dur_min: number; clientes: number }> = [
  { sector: "Cerro Barón",         comuna: "Valparaíso",    lat: -33.045, lng: -71.60,   hace_min: 12,  dur_min: 222, clientes: 640 },
  { sector: "Reñaca alto",         comuna: "Viña del Mar",  lat: -32.965, lng: -71.545,  hace_min: 38,  dur_min: 165, clientes: 1120 },
  { sector: "El Melón centro",     comuna: "Nogales",       lat: -32.752, lng: -71.212,  hace_min: 74,  dur_min: 98,  clientes: 410 },
  { sector: "Quillota centro",     comuna: "Quillota",      lat: -32.881, lng: -71.249,  hace_min: 155, dur_min: 74,  clientes: 260 },
  { sector: "Peñablanca",          comuna: "Villa Alemana", lat: -33.049, lng: -71.377,  hace_min: 240, dur_min: 189, clientes: 880 },
  { sector: "Ocoa",                comuna: "Hijuelas",      lat: -32.802, lng: -71.152,  hace_min: 410, dur_min: 55,  clientes: 190 },
  { sector: "San Isidro",          comuna: "La Cruz",       lat: -32.826, lng: -71.241,  hace_min: 620, dur_min: 132, clientes: 320 },
  { sector: "Loncura",             comuna: "Quintero",      lat: -32.784, lng: -71.534,  hace_min: 880, dur_min: 210, clientes: 540 },
];

export const REPUESTOS: Reposicion[] = REPUESTOS_SEED.map((r, k) => ({
  nr_orden: `47R${(2000 + k).toString()}-1`,
  sector: r.sector,
  comuna: r.comuna,
  cant_clientes: r.clientes,
  lat: r.lat,
  lng: r.lng,
  repuesto_at: new Date(now - r.hace_min * M).toISOString(),
  duracion_min: r.dur_min,
}));

export function estadoETR(i: Interrupcion): EstadoETR {
  if (!i.etr_max) return "investigacion";
  return new Date(i.etr_max).getTime() < Date.now() ? "vencida" : "vigente";
}

// -------- Búsqueda multi-canal (NIS / RUT / Dirección) --------

export interface Producto {
  nis: string;
  direccionEnmascarada: string;
  comuna: string;
}

// NIS -> índice de corte
const NIS_INDEX: Record<string, number> = {
  "1234567": 0,
  "2345678": 1,
  "3456789": 10,
  "4567890": 17,
  "5678901": 25,
  "6789012": 33,
};

// RUT -> lista de productos (algunos con corte, otros no)
const RUT_INDEX: Record<string, Producto[]> = {
  "12345678-9": [
    { nis: "1234567", direccionEnmascarada: "Av. Argenti•• ••23, Valparaíso", comuna: "Valparaíso" },
    { nis: "9876543", direccionEnmascarada: "Calle Bellav•• ••56, Viña del Mar", comuna: "Viña del Mar" },
  ],
  "9876543-2": [
    { nis: "2345678", direccionEnmascarada: "Los Maq•• ••89, Nogales", comuna: "Nogales" },
  ],
};

// Dirección aproximada -> NIS (mock; en producción es geocoder + red)
const DIRECCION_INDEX: Array<{ query: string; nis: string }> = [
  { query: "argentina valparaiso", nis: "1234567" },
  { query: "cerro alegre", nis: "1234567" },
  { query: "reñaca", nis: "9876543" },
  { query: "melon", nis: "2345678" },
  { query: "san pedro quillota", nis: "5678901" },
];

export interface SolicitudIndividual {
  orden: string;
  ingresadaAt: string;
  hitos: Hito[];
}

function nuevaSolicitudIndividual(): SolicitudIndividual {
  const ingresadaMs = now - 12 * M;
  return {
    orden: `SI-${Math.floor(100000 + R() * 900000)}`,
    ingresadaAt: new Date(ingresadaMs).toISOString(),
    hitos: [
      { key: "confirmado", label: "Solicitud individual ingresada", at: new Date(ingresadaMs).toISOString() },
      { key: "cuadrilla", label: "Técnicos en camino", at: null },
      { key: "terreno", label: "Técnicos trabajando en el lugar", at: null },
      { key: "repuesto", label: "Luz restablecida", at: null },
    ],
  };
}

export type ResultadoBusqueda =
  | { kind: "masiva"; i: Interrupcion; nis: string }
  | { kind: "individual"; nis: string; solicitud: SolicitudIndividual }
  | { kind: "sin_corte"; nis: string }
  | { kind: "no_encontrado" };

export function buscarPorNIS(nis: string): ResultadoBusqueda {
  const clean = nis.trim();
  if (!clean) return { kind: "no_encontrado" };
  const idx = NIS_INDEX[clean];
  if (idx !== undefined) {
    const i = INTERRUPCIONES[idx];
    if (i) return { kind: "masiva", i, nis: clean };
  }
  // Simulación: NIS que termina en dígito impar => solicitud individual abierta
  if (/^\d{5,8}$/.test(clean)) {
    if (parseInt(clean.slice(-1), 10) % 2 === 1) {
      return { kind: "individual", nis: clean, solicitud: nuevaSolicitudIndividual() };
    }
    return { kind: "sin_corte", nis: clean };
  }
  return { kind: "no_encontrado" };
}

export function productosPorRUT(rut: string): Producto[] {
  const clean = rut.trim().replace(/\./g, "").toUpperCase();
  return RUT_INDEX[clean] ?? [];
}

export function buscarPorDireccion(texto: string): ResultadoBusqueda {
  const q = texto.trim().toLowerCase();
  if (!q) return { kind: "no_encontrado" };
  const hit = DIRECCION_INDEX.find((d) => q.includes(d.query) || d.query.includes(q));
  if (!hit) return { kind: "no_encontrado" };
  return buscarPorNIS(hit.nis);
}

export function buscarPorOrden(texto: string): ResultadoBusqueda {
  const clean = texto.trim().toLowerCase();
  if (!clean) return { kind: "no_encontrado" };
  const i = INTERRUPCIONES.find((item) => item.nr_orden.toLowerCase() === clean);
  if (!i) return { kind: "no_encontrado" };
  const nis = Object.entries(NIS_INDEX).find(([, idx]) => INTERRUPCIONES[idx]?.nr_orden === i.nr_orden)?.[0] ?? "";
  return { kind: "masiva", i, nis };
}

export function totales() {
  const activos = INTERRUPCIONES.length;
  const afectados = INTERRUPCIONES.reduce((s, i) => s + i.cant_clientes, 0);
  const contingencia = INTERRUPCIONES.filter((i) => i.tipo !== "programado");
  return {
    activos,
    afectados,
    contingenciaCortes: contingencia.length,
    contingenciaAfectados: contingencia.reduce((s, i) => s + i.cant_clientes, 0),
  };
}

export function agruparPorComuna(items: Interrupcion[]): Record<string, Interrupcion[]> {
  return items.reduce<Record<string, Interrupcion[]>>((acc, it) => {
    (acc[it.comuna] ||= []).push(it);
    return acc;
  }, {});
}
