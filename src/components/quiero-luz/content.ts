/**
 * Quiero Luz — contenidos y lógica referencial de la orientación.
 * Todo el copy y los umbrales viven aquí para ajustarlos sin tocar la UI.
 */

export const TU_CONEXION_URL = "https://ventaservicios.chilquinta.cl/online/acceso.php";

export type Necesidad = "nueva" | "potencia" | "no-seguro";
export type Inmueble = "casa" | "departamento" | "local" | "oficina";
export type Relacion = "propietario" | "arrendatario" | "represento" | "otra";
export type Uso = "residencial" | "comercial" | "mixto";
export type Equipamiento = "esencial" | "intensivo" | "no-se";
export type SiNoNoSe = "si" | "no" | "no-se";
export type TipoRed = "aerea" | "subterranea" | "no-se";
export type Instalador = "si" | "no";

export type Orientacion = {
  necesidad: Necesidad | null;
  inmueble: Inmueble | null;
  relacion: Relacion | null;
  uso: Uso | null;
  equipamiento: Equipamiento | null;
  redFrente: SiNoNoSe | null;
  tipoRed: TipoRed | null;
  instalador: Instalador | null;
};

export const ORIENTACION_INICIAL: Orientacion = {
  necesidad: null,
  inmueble: null,
  relacion: null,
  uso: null,
  equipamiento: null,
  redFrente: null,
  tipoRed: null,
  instalador: null,
};

export type Opcion<T extends string> = { value: T; label: string; description?: string };

export const OPCIONES_NECESIDAD: Opcion<Necesidad>[] = [
  {
    value: "nueva",
    label: "Necesito una conexión eléctrica nueva",
    description: "El inmueble todavía no tiene un servicio eléctrico activo.",
  },
  {
    value: "potencia",
    label: "Necesito más potencia",
    description: "Ya existe un servicio, pero necesito usar más equipamiento.",
  },
  {
    value: "no-seguro",
    label: "No estoy seguro",
    description: "Te ayudaremos a distinguir cuál de las dos alternativas corresponde.",
  },
];

export const OPCIONES_INMUEBLE: Opcion<Inmueble>[] = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "local", label: "Local comercial" },
  { value: "oficina", label: "Oficina u otro" },
];

export const OPCIONES_RELACION: Opcion<Relacion>[] = [
  { value: "propietario", label: "Propietario" },
  { value: "arrendatario", label: "Arrendatario" },
  { value: "represento", label: "Represento al propietario" },
  { value: "otra", label: "Otra relación" },
];

export const OPCIONES_USO: Opcion<Uso>[] = [
  { value: "residencial", label: "Residencial" },
  { value: "comercial", label: "Comercial" },
  { value: "mixto", label: "Uso mixto" },
];

export const OPCIONES_EQUIPAMIENTO: Opcion<Equipamiento>[] = [
  {
    value: "esencial",
    label: "Uso esencial · Referencia hasta 25 A",
    description:
      "Iluminación, refrigerador, lavadora, televisión, computador, microondas y pequeños electrodomésticos.",
  },
  {
    value: "intensivo",
    label: "Uso intensivo · Referencia hasta 40 A",
    description:
      "Incluye varios equipos de alto consumo, como horno eléctrico, encimera, termo, secadora o climatización.",
  },
  {
    value: "no-se",
    label: "No sé qué capacidad necesito",
    description: "Te indicaremos qué información debe validar un instalador o la factibilidad.",
  },
];

export const OPCIONES_RED_FRENTE: Opcion<SiNoNoSe>[] = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "no-se", label: "No sé" },
];

export const OPCIONES_TIPO_RED: Opcion<TipoRed>[] = [
  { value: "aerea", label: "Aérea", description: "Cables y postes visibles." },
  { value: "subterranea", label: "Subterránea", description: "Cámaras o canalización bajo tierra." },
  { value: "no-se", label: "No sé", description: "Se validará durante la factibilidad." },
];

export const OPCIONES_INSTALADOR: Opcion<Instalador>[] = [
  { value: "si", label: "Sí, ya tengo instalador" },
  { value: "no", label: "Necesito orientación" },
];

/* ---------- Resultado referencial ---------- */

export type Resultado = {
  titulo: string;
  detalle: string;
  chips: string[];
  resumen: { label: string; valor: string }[];
  avisos: string[];
};

function etiqueta<T extends string>(opciones: Opcion<T>[], value: T | null) {
  return opciones.find((o) => o.value === value)?.label ?? "Por definir";
}

export function calcularOrientacion(o: Orientacion): Resultado {
  const intensivo = o.equipamiento === "intensivo";
  const noResidencial = o.uso !== "residencial";
  const amperes = intensivo || noResidencial ? 40 : 25;
  const desconocido = o.equipamiento === "no-se";

  const chips = [
    o.necesidad === "potencia" ? "Aumento de potencia" : "Conexión nueva",
    intensivo ? "Uso intensivo" : desconocido ? "Capacidad por validar" : "Uso esencial",
    o.tipoRed === "subterranea"
      ? "Red subterránea"
      : o.tipoRed === "aerea"
        ? "Red aérea"
        : "Red por confirmar",
  ];

  const avisos: string[] = [];
  if (desconocido) {
    avisos.push(
      "Como no conoces la capacidad, un instalador eléctrico autorizado puede estimarla antes de solicitar la factibilidad.",
    );
  }
  if (o.redFrente === "no") {
    avisos.push(
      "Si no hay red frente al inmueble, la factibilidad evaluará una extensión de red y su plazo de ejecución.",
    );
  }
  if (o.relacion !== "propietario") {
    avisos.push("Si no eres el propietario, necesitarás una autorización notarial para solicitar.");
  }
  if (o.instalador === "no") {
    avisos.push(
      "Necesitarás un instalador autorizado por la SEC para la instalación interior y la declaración TE1.",
    );
  }

  return {
    titulo: desconocido
      ? "Capacidad referencial por validar"
      : `Empalme referencial de hasta ${amperes} A`,
    detalle: desconocido
      ? "Con la información entregada podemos orientarte sobre el proceso; la capacidad se definirá técnicamente."
      : "Por el nivel de uso seleccionado, esta podría ser una referencia inicial. La factibilidad confirmará la capacidad y si la solución es aérea o subterránea.",
    chips,
    resumen: [
      { label: "Necesidad", valor: etiqueta(OPCIONES_NECESIDAD, o.necesidad) },
      { label: "Tipo de inmueble", valor: etiqueta(OPCIONES_INMUEBLE, o.inmueble) },
      { label: "Relación", valor: etiqueta(OPCIONES_RELACION, o.relacion) },
      { label: "Uso", valor: etiqueta(OPCIONES_USO, o.uso) },
      { label: "Perfil de potencia", valor: etiqueta(OPCIONES_EQUIPAMIENTO, o.equipamiento) },
      { label: "Red disponible", valor: etiqueta(OPCIONES_RED_FRENTE, o.redFrente) },
      { label: "Tipo de red", valor: etiqueta(OPCIONES_TIPO_RED, o.tipoRed) },
      { label: "Instalador autorizado", valor: etiqueta(OPCIONES_INSTALADOR, o.instalador) },
    ],
    avisos,
  };
}

/* ---------- Etapas del proceso en Tu Conexión ---------- */

export const ETAPAS = [
  {
    numero: 1,
    titulo: "Solicitud de factibilidad",
    descripcion:
      "Entregas antecedentes del inmueble, ubicación, fotografías y documentos para la evaluación técnica.",
    nota: "Tu acción: completar antecedentes y responder observaciones.",
    plazo: "Respuesta en hasta 3 días",
  },
  {
    numero: 2,
    titulo: "Solicitud de conexión",
    descripcion: "Con la factibilidad respondida, solicitas las condiciones, el presupuesto y los plazos.",
    nota: "Resultado: presupuesto formal de conexión.",
    plazo: "Incluye condiciones técnicas",
  },
  {
    numero: 3,
    titulo: "Notificación y ejecución",
    descripcion:
      "Presentas los antecedentes finales, pagas los servicios y coordinamos la visita para conectar el empalme.",
    nota: "Resultado: conexión coordinada y ejecutada.",
    plazo: "10 a 15 días según el empalme",
  },
];

/* ---------- Seguimiento ---------- */

export const SEGUIMIENTO_CORTE = {
  fechaLabel: "1 de julio",
  /** Desde este correlativo la solicitud se gestiona en Tu Conexión. */
  correlativoDesde: 900000,
};