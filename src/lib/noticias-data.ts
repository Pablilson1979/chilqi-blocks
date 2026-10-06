import quilpue from "@/assets/noticias-quilpue.jpg.asset.json";

export interface Noticia {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image?: string;
  imageAlt: string;
  paragraphs: string[];
}

// Dates and titles follow the supplied Chilquinta listing. Summaries are editorial adaptations.
export const noticias: Noticia[] = [
  {
    slug: "quilpue-prevencion-verano",
    title: "Quilpué y Chilquinta se adelantan al verano con primera intervención conjunta para prevenir riesgos eléctricos",
    date: "2026-10-02", category: "Prevención", image: quilpue.url,
    imageAlt: "Cuadrilla de Chilquinta trabajando de noche en la red eléctrica de Quilpué",
    summary: "Cuadrillas municipales y de Chilquinta trabajaron durante la noche en cuatro calles del centro de la comuna, realizando labores de manejo de vegetación y mantenimiento de la red eléctrica. Esta es la primera de varias intervenciones preventivas que ambas instituciones proyectan realizar en conjunto.",
    paragraphs: [
      "Mientras la ciudad descansaba, equipos municipales y de Chilquinta intervinieron las calles Blanco, Centeno, Thompson y Errázuriz, combinando labores de poda, manejo del arbolado y mantenimiento de la infraestructura eléctrica para prevenir riesgos y posibles interrupciones del suministro.",
      "La jornada se realizó en horario nocturno para reducir las molestias a la comunidad. Chilquinta dispuso cuadrillas especializadas para trabajar en las redes de baja y media tensión, mientras que el municipio aportó con equipos de poda y apoyo en la coordinación de los cierres de calles.",
      "“Nos hemos coordinado durante estos meses y hemos logrado sacar estos trabajos adelante. Hacemos trabajos nocturnos para no interrumpir el funcionamiento normal de la comuna y de este sector céntrico”, destacó Ramón Mendoza del Departamento Verde Urbano y Cauces de la Municipalidad de Quilpué.",
      "Por su parte, Rodrigo Arancibia, Ingeniero Mantenimiento Marga Marga de Chilquinta Distribución, destacó el trabajo conjunto que permitió concretar esta primera intervención y adelantó que habrá nuevas jornadas. “Esta es la primera intervención de varias que se vienen adelante, que son las que estamos teniendo continuamente con las reuniones que tenemos entre la municipalidad y Chilquinta para poder planificar estas intervenciones mayores”, señaló.",
      "Así, ambas instituciones comienzan a concretar en terreno su plan preventivo para los meses de verano, sumando capacidades para cuidar el arbolado urbano, proteger a la comunidad y contribuir a la continuidad del suministro eléctrico.",
    ],
  },
  { slug: "embajadores-culturales-huasco", title: "Una cámara, un territorio y muchas historias: nacen los Embajadores Culturales del Huasco", date: "2026-09-29", category: "Comunidad", summary: "Una iniciativa cultural que reúne las historias y el territorio del Huasco a través de la fotografía.", imageAlt: "Actividad de los Embajadores Culturales del Huasco", paragraphs: [] },
  { slug: "acuerdo-bomberos-valparaiso", title: "Cuando desconectar la energía salva vidas: Chilquinta y Bomberos Valparaíso firman inédito acuerdo para enfrentar emergencias", date: "2026-09-25", category: "Seguridad", summary: "Chilquinta y Bomberos de Valparaíso acuerdan trabajar juntos para enfrentar emergencias.", imageAlt: "Firma del acuerdo entre Chilquinta y Bomberos de Valparaíso", paragraphs: [] },
  { slug: "visita-ceipa-colombia", title: "Estudiantes internacionales de CEIPA Colombia sostuvieron visita pedagógica en Chilquinta", date: "2026-09-24", category: "Comunidad", summary: "Estudiantes de CEIPA Colombia visitaron Chilquinta en una jornada de intercambio y aprendizaje.", imageAlt: "Estudiantes de CEIPA Colombia durante su visita a Chilquinta", paragraphs: [] },
  { slug: "septiembre-seguro", title: "Septiembre Seguro 2026: Estudiantes del Colegio Carmelita de El Melón se sumaron a campaña preventiva de Chilquinta", date: "2026-09-23", category: "Prevención", summary: "La comunidad escolar de El Melón se sumó a una jornada de prevención junto a Chilquinta.", imageAlt: "Comunidad escolar en la campaña Septiembre Seguro", paragraphs: [] },
  { slug: "artesania-pari", title: "Chilquinta lleva la artesanía en crin de Rari a encuentro cultural entre Chile, Brasil y China", date: "2026-09-22", category: "Comunidad", summary: "La artesanía en crin de Rari fue parte de un encuentro cultural entre Chile, Brasil y China.", imageAlt: "Encuentro cultural de Chile, Brasil y China", paragraphs: [] },
  { slug: "desierto-florido", title: "“Mira, Disfruta y Cuida”: lanzan campaña para proteger el Desierto Florido y orientar a sus visitantes", date: "2026-09-15", category: "Medioambiente", summary: "Una campaña invita a disfrutar y proteger el Desierto Florido durante la visita.", imageAlt: "Lanzamiento de campaña para proteger el Desierto Florido", paragraphs: [] },
  { slug: "operativo-catemu", title: "Exitoso operativo permitió reforzar la infraestructura eléctrica de Catemu", date: "2026-09-13", category: "Prevención", summary: "Un operativo en terreno reforzó la infraestructura eléctrica de la comuna de Catemu.", imageAlt: "Cuadrillas en un operativo eléctrico en Catemu", paragraphs: [] },
];

export function fechaNoticia(date: string) {
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}