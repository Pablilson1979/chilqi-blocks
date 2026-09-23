/**
 * Seguimiento de visita técnica — modelo de datos de la maqueta.
 *
 * Los hitos visibles siguen el blueprint v2 (acuerdos 08-09-2026):
 * ASSIGNED y DISPATCHED se muestran como un solo hito, se incorpora LLEGÓ
 * ("Técnico en el lugar") y el cierre se diferencia entre reposición y
 * casa cerrada. No se muestra el nombre del técnico: solo la patente/móvil.
 */

export type HitoId =
  | "informado"
  | "espera"
  | "en_camino"
  | "en_lugar"
  | "trabajando"
  | "cierre";

export interface HitoDef {
  id: HitoId;
  titulo: string;
  /** Qué significa para el cliente, en lenguaje simple. */
  detalle: string;
}

export const HITOS: HitoDef[] = [
  {
    id: "informado",
    titulo: "Reporte recibido",
    detalle: "Recibimos el reporte de tu corte de suministro.",
  },
  {
    id: "espera",
    titulo: "Reporte validado",
    detalle:
      "Tu corte está validado. Tu técnico está terminando otros trabajos antes de ir a tu dirección.",
  },
  {
    id: "en_camino",
    titulo: "Técnico en camino",
    detalle:
      "El técnico se dirige a tu dirección. Permanece en el domicilio y atento al teléfono.",
  },
  {
    id: "en_lugar",
    titulo: "Técnico en el lugar",
    detalle: "El técnico llegó, revisa la instalación y confirma el tiempo de reparación.",
  },
  {
    id: "trabajando",
    titulo: "Reparación en curso",
    detalle: "Estamos trabajando en terreno para reponer tu suministro.",
  },
  {
    id: "cierre",
    titulo: "Trabajo finalizado",
    detalle: "Cerramos tu reporte. Si sigues sin luz, avísanos más abajo.",
  },
];

export type Cierre = "restablecido" | "casa_cerrada";

export interface Movil {
  /** Identificación genérica del móvil: nunca el nombre del técnico. */
  nombre: string;
  patente: string;
  /** Posición relativa dentro del mapa de la maqueta (0-100). */
  x: number;
  y: number;
}

export interface Caso {
  orden: string;
  cliente: string;
  direccion: string;
  comuna: string;
  hito: HitoId;
  /** Marcas de tiempo de los hitos ya recorridos. */
  tiempos: Partial<Record<HitoId, string>>;
  /** Ventana estimada de atención (rango) para el tramo de espera. */
  ventana?: string;
  /** Órdenes por delante en la cola de la cuadrilla. */
  enCola?: number;
  /** Tiempo estimado (rango) comunicado al cliente. */
  etr?: string;
  etrConfirmado?: boolean;
  /**
   * Estado de la estimación: confirmada por terreno, ajustada respecto de la
   * anterior, o todavía no disponible.
   */
  etrEstado?: "confirmado" | "ajustado" | "pendiente";
  /** Hora en que se actualizó por última vez la posición del móvil. */
  ubicacionActualizada?: string;
  movil?: Movil;
  /** La cola se reordenó por una prioridad (ej. electrodependiente). */
  reasignado?: boolean;
  suspension?: string;
  cierre?: Cierre;
  /** Seguimiento no publicable: contingencia u orden de red. */
  noDisponible?: string;
  /** Etiqueta del estado que ilustra este caso en la maqueta. */
  ejemplo?: string;
  /** Teléfono informado en el reporte original, para no volver a pedirlo. */
  telefono?: string;
  /** Hasta qué hora se puede reabrir el reporte sin repetir el flujo. */
  reabrirHasta?: string;
  /** Este reporte ya nació de una reapertura. */
  reabierto?: boolean;
  /** Orden anterior vinculada. */
  ordenPrevia?: string;
  /** Ya se usó la reapertura: el siguiente paso es atención humana. */
  reaperturaPrevia?: boolean;
}

export const CASOS: Caso[] = [
  {
    orden: "11234412",
    ejemplo: "Técnico en camino",
    cliente: "3045128",
    direccion: "Pasaje C1 223, Camino las Maravillas",
    comuna: "Viña del Mar",
    hito: "en_camino",
    tiempos: {
      informado: "Hoy · 13:50",
      espera: "Hoy · 14:05",
      en_camino: "Hoy · 15:12",
    },
    etr: "20 – 30 minutos",
    etrEstado: "confirmado",
    ubicacionActualizada: "15:38",
    movil: { nombre: "Móvil SAT", patente: "KJHT-56", x: 70, y: 64 },
  },
  {
    orden: "20455301",
    ejemplo: "En espera de móvil",
    cliente: "4187903",
    direccion: "Av. Libertad 1180, depto. 703",
    comuna: "Viña del Mar",
    hito: "espera",
    tiempos: { informado: "Hoy · 12:20", espera: "Hoy · 12:41" },
    ventana: "16:40 – 17:20",
    etrEstado: "ajustado",
    enCola: 2,
    reasignado: true,
  },
  {
    orden: "30778120",
    ejemplo: "Reparación en curso",
    cliente: "5093344",
    direccion: "Los Aromos 452",
    comuna: "Quilpué",
    hito: "trabajando",
    tiempos: {
      informado: "Hoy · 09:10",
      espera: "Hoy · 09:32",
      en_camino: "Hoy · 11:02",
      en_lugar: "Hoy · 11:26",
      trabajando: "Hoy · 11:34",
    },
    etr: "30 – 45 minutos",
    etrConfirmado: true,
    etrEstado: "confirmado",
    ubicacionActualizada: "11:52",
    movil: { nombre: "Móvil SAT", patente: "LPBR-31", x: 62, y: 58 },
  },
  {
    orden: "40990011",
    ejemplo: "Cerrado: casa cerrada",
    cliente: "6120877",
    direccion: "Calle Nueva 87",
    comuna: "Villa Alemana",
    hito: "cierre",
    cierre: "casa_cerrada",
    telefono: "9 8123 4455",
    tiempos: {
      informado: "Ayer · 17:05",
      espera: "Ayer · 17:22",
      en_camino: "Ayer · 18:40",
      en_lugar: "Ayer · 19:02",
      cierre: "Ayer · 19:10",
    },
  },
  {
    orden: "50110022",
    ejemplo: "Suministro restablecido",
    cliente: "7233901",
    direccion: "Pasaje El Sauce 14",
    comuna: "Valparaíso",
    hito: "cierre",
    cierre: "restablecido",
    tiempos: {
      informado: "Hoy · 07:40",
      espera: "Hoy · 07:55",
      en_camino: "Hoy · 08:30",
      en_lugar: "Hoy · 08:52",
      trabajando: "Hoy · 09:01",
      cierre: "Hoy · 09:48",
    },
    telefono: "9 7455 2210",
    reabrirHasta: "11:48",
  },
  {
    orden: "70330044",
    ejemplo: "Cerrado y reabierto por el cliente",
    cliente: "9451220",
    direccion: "Las Acacias 330",
    comuna: "Villa Alemana",
    hito: "espera",
    reabierto: true,
    ordenPrevia: "70330044-1",
    telefono: "9 6120 8877",
    tiempos: { informado: "Hoy · 14:02", espera: "Hoy · 14:15" },
    ventana: "17:10 – 18:00",
    etrEstado: "pendiente",
    enCola: 1,
  },
  {
    orden: "80440055",
    ejemplo: "Reabierto y vuelve a cerrarse",
    cliente: "9670331",
    direccion: "Serrano 1244",
    comuna: "Valparaíso",
    hito: "cierre",
    cierre: "restablecido",
    reabierto: true,
    reaperturaPrevia: true,
    ordenPrevia: "80440055-1",
    telefono: "9 5332 1109",
    tiempos: {
      informado: "Hoy · 08:05",
      espera: "Hoy · 08:20",
      en_camino: "Hoy · 09:40",
      en_lugar: "Hoy · 10:02",
      trabajando: "Hoy · 10:10",
      cierre: "Hoy · 10:55",
    },
  },
  {
    orden: "60220033",
    ejemplo: "Sin seguimiento (falla masiva)",
    cliente: "8340112",
    direccion: "Camino Troncal 2200",
    comuna: "Quilpué",
    hito: "espera",
    tiempos: { informado: "Hoy · 10:15" },
    noDisponible:
      "Tu corte forma parte de una falla que afecta a varios clientes del sector. En estos casos el seguimiento en tiempo real todavía no está disponible.",
  },
];

export function buscarCaso(valor: string): Caso | undefined {
  const q = valor.replace(/\D/g, "");
  if (!q) return undefined;
  return CASOS.find((c) => c.orden === q || c.cliente === q);
}

export function indiceHito(id: HitoId) {
  return HITOS.findIndex((h) => h.id === id);
}
