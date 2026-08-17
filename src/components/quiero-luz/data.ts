/**
 * Quiero Luz — configuración y contenidos.
 * Todo el copy, los plazos, los packs y los umbrales del seguimiento viven
 * aquí para poder ajustarlos sin tocar los componentes.
 */

export const TU_CONEXION_URL = "https://ventaservicios.chilquinta.cl/online/acceso.php";

/** Corte entre el sistema antiguo y la plataforma nueva. */
export const SEGUIMIENTO_CORTE = {
  fechaISO: "2026-07-01",
  fechaLabel: "1 de julio",
  /** Sobre este correlativo la solicitud se gestiona en Tu Conexión. */
  correlativoDesde: 900000,
};

export type MacroStage = {
  id: string;
  numero: string;
  titulo: string;
  resumen: string;
  plazo?: string;
  subetapas: { titulo: string; descripcion: string; plazo?: string }[];
};

export const MACRO_STAGES: MacroStage[] = [
  {
    id: "factibilidad",
    numero: "01",
    titulo: "Solicitud de factibilidad",
    resumen:
      "Ingresas los antecedentes de la propiedad y del empalme que necesitas para que evaluemos la factibilidad técnica de la conexión.",
    plazo: "Respuesta en hasta 3 días",
    subetapas: [
      {
        titulo: "Ingreso de solicitud de factibilidad",
        descripcion:
          "Nos deberás aportar los antecedentes necesarios para evaluar la factibilidad de conexión. Si la solicitud la realiza un tercero distinto del propietario, se requiere autorización notarial. En nuevas conexiones debes adjuntar un set fotográfico: punto de conexión (poste o cámara), caja de empalme, puesta a tierra, unión al tablero y una panorámica que evidencie la lectura desde el exterior.",
      },
      {
        titulo: "Revisión de antecedentes y factibilidad",
        descripcion:
          "Revisamos los antecedentes presentados y definimos las condiciones asociadas a la factibilidad de la conexión solicitada.",
        plazo: "Hasta 3 días, ampliable si se requieren estudios adicionales o visita a terreno",
      },
      {
        titulo: "Respuesta de factibilidad",
        descripcion:
          "La respuesta indicará si la conexión se puede realizar de inmediato o si es necesario ejecutar obras adicionales en la red, señalando el plazo para su ejecución.",
      },
    ],
  },
  {
    id: "conexion",
    numero: "02",
    titulo: "Solicitud de conexión",
    resumen:
      "Con la factibilidad respondida ingresas la solicitud de conexión y recibes el presupuesto y las condiciones técnicas del servicio.",
    plazo: "Incluye presupuesto y plazos de ejecución",
    subetapas: [
      {
        titulo: "Ingreso de solicitud de conexión",
        descripcion:
          "Completas los datos del empalme y seleccionas la opción tarifaria para que preparemos el presupuesto de los servicios.",
      },
      {
        titulo: "Presupuesto y condiciones técnicas",
        descripcion:
          "Recibes el presupuesto y el detalle de las condiciones técnicas del servicio, además de los permisos y plazos asociados a su ejecución.",
      },
      {
        titulo: "Aprobación de la solicitud",
        descripcion:
          "Una vez validados todos los antecedentes presentados, tu solicitud queda aprobada y disponible para su pago.",
      },
    ],
  },
  {
    id: "notificacion",
    numero: "03",
    titulo: "Notificación de conexión",
    resumen:
      "Entregas los documentos exigidos por la norma, pagas los servicios y coordinamos la visita para conectar tu empalme.",
    plazo: "Conexión en 10 a 15 días según el tipo de empalme",
    subetapas: [
      {
        titulo: "Entrega de documentos para validar",
        descripcion:
          "Debes aportar el contrato de suministro, la declaración de instalación eléctrica interior, el certificado de dominio vigente de la propiedad y el registro fotográfico que acredite la finalización de los trabajos previos, entre otros que puedan requerirse.",
      },
      {
        titulo: "Pago",
        descripcion:
          "Podrás pagar los servicios asociados a la conexión del empalme directamente en nuestra plataforma de Venta de Servicios.",
      },
      {
        titulo: "Confirmación de visita",
        descripcion:
          "Nos pondremos en contacto contigo para coordinar y confirmar la visita para la ejecución de los trabajos.",
        plazo: "Plazo estimativo de 5 días después del pago",
      },
      {
        titulo: "Conexión de empalme",
        descripcion:
          "Los plazos dependen del tipo de requerimiento y de las condiciones definidas en el estudio de factibilidad. Como referencia, la conexión de un empalme monofásico aportado por el cliente tiene un plazo de visita de hasta 10 días y la construcción de un empalme del mismo tipo, 15 días.",
        plazo: "10 días conexión / 15 días construcción",
      },
    ],
  },
];

/* ---------- Simulador ---------- */

export type Requerimiento = "nuevo" | "aumento";
export type Tension = "baja" | "media";
export type Uso = "unitario" | "alumbrado";
export type Acometida = "aerea" | "subterranea";

export type Pack = {
  id: string;
  nombre: string;
  rango: string;
  amperes: number;
  artefactos: string;
};

export const PACKS: Pack[] = [
  {
    id: "pack-01",
    nombre: "Pack 01",
    rango: "Hasta 25 amperes",
    amperes: 25,
    artefactos:
      "Refrigerador + Batidora + Notebook + Celular + Equipo de música + Decodificador + Tv Led 40'-59' + Microonda + Horno Eléctrico + Hervidor Eléctrico + Licuadora + CalientaCamas + Consola Videojuegos + Aire Acondicionado + Plancha + Secadora 5-9Kg",
  },
  {
    id: "pack-02",
    nombre: "Pack 02",
    rango: "Sobre 25 hasta 40 amperes",
    amperes: 40,
    artefactos:
      "Artefactos pack 1 + Campana + Encimera + Lavavajillas + CalientaCamas de 2 plazas + Tv Led 60' o más + Convector + Lavadora 15kg o más + Secadora 10-14kg + Termo eléctrico",
  },
  {
    id: "pack-03",
    nombre: "Pack 03",
    rango: "Sobre 40 amperes o instalación trifásica",
    amperes: 63,
    artefactos:
      "Artefactos pack 2 + Climatización eléctrica completa + Bomba de agua + Cargador de auto eléctrico + Taller o maquinaria + Piscina con equipo de filtrado",
  },
];

export type SimuladorState = {
  requerimiento: Requerimiento | null;
  tension: Tension | null;
  uso: Uso | null;
  tipoInmueble: string;
  comuna: string;
  solicitante: "propietario" | "tercero" | null;
  tieneMedidor: "si" | "no" | null;
  acometida: Acometida | null;
  packId: string | null;
};

export const ESTADO_INICIAL: SimuladorState = {
  requerimiento: null,
  tension: null,
  uso: null,
  tipoInmueble: "",
  comuna: "",
  solicitante: null,
  tieneMedidor: null,
  acometida: null,
  packId: null,
};

export type Resultado = {
  titulo: string;
  amperes: number;
  fases: "Monofásico" | "Trifásico";
  nota: string;
};

/** Cálculo referencial de empalme a partir de las respuestas del simulador. */
export function calcularResultado(s: SimuladorState): Resultado | null {
  const pack = PACKS.find((p) => p.id === s.packId);
  if (!pack || !s.tension || !s.uso) return null;

  const acometida = s.acometida === "subterranea" ? "Subterráneo" : "Aéreo";
  const trifasico = s.tension === "media" || pack.amperes >= 63;
  const amperes = s.tension === "media" ? Math.max(pack.amperes, 63) : pack.amperes;

  const titulo =
    s.uso === "alumbrado"
      ? `Empalme ${acometida} de alumbrado público de ${amperes} amperes`
      : `Empalme ${acometida} de ${amperes} amperes`;

  return {
    titulo,
    amperes,
    fases: trifasico ? "Trifásico" : "Monofásico",
    nota:
      s.requerimiento === "aumento"
        ? "*considera el aumento de potencia sobre el empalme existente, con medidor propiedad de Chilquinta"
        : "*considera la construcción de empalme con medidor propiedad de Chilquinta",
  };
}

export const DOCUMENTOS_BASE = [
  "Cédula de identidad del solicitante",
  "Certificado de dominio vigente de la propiedad",
  "Set fotográfico: punto de conexión, caja de empalme, puesta a tierra, unión al tablero y panorámica de lectura",
  "Declaración de instalación eléctrica interior (TE1) presentada ante la SEC",
  "Contrato de suministro firmado",
];

export const TRABAJOS_PREVIOS = [
  "Instalar la caja de empalme en la línea de propiedad, accesible desde el exterior",
  "Ejecutar la puesta a tierra de protección de la instalación interior",
  "Dejar la unión desde la caja de empalme al tablero de la vivienda",
  "Contar con el tablero de distribución y sus protecciones instaladas",
  "Despejar el punto de conexión de árboles u obstáculos",
];
