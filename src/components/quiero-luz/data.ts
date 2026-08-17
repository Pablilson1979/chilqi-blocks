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

export const COMUNAS = [
  "Algarrobo","Cabildo","Calera","Calle Larga","Cartagena","Casablanca","Catemu","Concón",
  "El Quisco","El Tabo","Hijuelas","La Cruz","La Ligua","Limache","Llaillay","Los Andes",
  "Nogales","Olmué","Panquehue","Papudo","Petorca","Puchuncaví","Putaendo","Quillota",
  "Quilpué","Quintero","Rinconada","San Antonio","San Esteban","San Felipe","Santa María",
  "Santo Domingo","Valparaíso","Villa Alemana","Viña del Mar","Zapallar",
];

export type Relacion = "Propietario" | "Arrendatario" | "Comodato" | "Otro";
export type TipoPropiedad = "Casa" | "Local Comercial" | "Oficina" | "Industria";
export type UbicacionEmpalme =
  | "En la propiedad"
  | "Fuera de la propiedad"
  | "Camino público"
  | "Camino privado";
export type TipoRedes = "Aéreas" | "Subterráneas";

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
  /* Paso 1 — Ingresar datos */
  rut: string;
  nombre: string;
  apellido: string;
  comuna: string;
  direccion: string;
  celular: string;
  email: string;
  emailRepetir: string;
  /* Paso 2 — Detalles de la propiedad */
  relacion: Relacion | null;
  tipoPropiedad: TipoPropiedad | null;
  packId: string | null;
  /* Paso 3 — Detalles de la conexión */
  ubicacionEmpalme: UbicacionEmpalme | null;
  instaladorSEC: "Si" | "No" | null;
  redesExistentes: "Si" | "No" | null;
  tipoRedes: TipoRedes | null;
};

export const ESTADO_INICIAL: SimuladorState = {
  rut: "",
  nombre: "",
  apellido: "",
  comuna: "",
  direccion: "",
  celular: "",
  email: "",
  emailRepetir: "",
  relacion: null,
  tipoPropiedad: null,
  packId: null,
  ubicacionEmpalme: null,
  instaladorSEC: null,
  redesExistentes: null,
  tipoRedes: null,
};

export type Resultado = {
  titulo: string;
  amperes: number;
  fases: "Monofásico" | "Trifásico";
  nota: string;
  observaciones: string[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function datosCompletos(s: SimuladorState) {
  return (
    s.rut.trim().length >= 8 &&
    s.nombre.trim().length > 1 &&
    s.apellido.trim().length > 1 &&
    s.comuna !== "" &&
    s.direccion.trim().length > 3 &&
    /^\d{8,9}$/.test(s.celular.replace(/\D/g, "")) &&
    EMAIL_RE.test(s.email) &&
    s.email.trim().toLowerCase() === s.emailRepetir.trim().toLowerCase()
  );
}

export function propiedadCompleta(s: SimuladorState) {
  return Boolean(s.relacion && s.tipoPropiedad && s.packId);
}

export function conexionCompleta(s: SimuladorState) {
  return Boolean(
    s.ubicacionEmpalme &&
      s.instaladorSEC &&
      s.redesExistentes &&
      (s.redesExistentes === "No" || s.tipoRedes),
  );
}

/** Cálculo referencial del empalme a partir de las respuestas del simulador. */
export function calcularResultado(s: SimuladorState): Resultado | null {
  const pack = PACKS.find((p) => p.id === s.packId);
  if (!pack) return null;

  const subterranea = s.tipoRedes === "Subterráneas";
  const acometida = subterranea ? "Subterráneo" : "Aéreo";
  const trifasico = pack.amperes >= 63 || s.tipoPropiedad === "Industria";
  const amperes = s.tipoPropiedad === "Industria" ? Math.max(pack.amperes, 63) : pack.amperes;

  const observaciones: string[] = [];
  if (s.redesExistentes === "No") {
    observaciones.push(
      "No existen redes de distribución frente a la propiedad: se requerirá una extensión de red, evaluada en la etapa de factibilidad.",
    );
  }
  if (s.instaladorSEC === "No") {
    observaciones.push(
      "Necesitas contratar un instalador eléctrico autorizado por la SEC para ejecutar la instalación interior y presentar la declaración TE1.",
    );
  }
  if (s.ubicacionEmpalme === "Camino privado" || s.ubicacionEmpalme === "Fuera de la propiedad") {
    observaciones.push(
      "Al instalarse fuera de la propiedad o en camino privado se requieren autorizaciones o servidumbres de paso.",
    );
  }
  if (s.relacion !== "Propietario") {
    observaciones.push(
      "Si no eres el propietario, deberás adjuntar la autorización notarial del propietario de la propiedad.",
    );
  }

  return {
    titulo: `Empalme ${acometida} de ${amperes} amperes`,
    amperes,
    fases: trifasico ? "Trifásico" : "Monofásico",
    nota: "*considera la construcción de empalme con medidor propiedad de Chilquinta",
    observaciones,
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
