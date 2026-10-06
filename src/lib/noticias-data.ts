import quilpue from "@/assets/noticias-quilpue.jpg.asset.json";
import huasco from "@/assets/noticias-huasco.jpg.asset.json";
import bomberos from "@/assets/noticias-bomberos.jpg.asset.json";
import rari from "@/assets/noticias-rari.jpg.asset.json";
import desierto from "@/assets/noticias-desierto.jpg.asset.json";
import catemu from "@/assets/noticias-catemu.jpg.asset.json";

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
  { slug: "embajadores-culturales-huasco", title: "Una cámara, un territorio y muchas historias: nacen los Embajadores Culturales del Huasco", date: "2026-09-29", category: "Comunidad", image: huasco.url, summary: "La iniciativa es impulsada por Eletrans, parte de Grupo Empresas Chilquinta, en vinculación con la Municipalidad de Vallenar, y formará a 30 personas en patrimonio, fotografía, medioambiente y comunicación para convertirse en promotores de la identidad de la provincia.", imageAlt: "Actividad de los Embajadores Culturales del Huasco", paragraphs: [
    "Hay historias que están en una iglesia, en una antigua construcción, en una caleta, en una flor del desierto o en una persona que mantiene viva una tradición. El desafío es saber mirarlas, registrarlas y, sobre todo, contarlas.",
    "Para hacerlo posible, Eletrans, parte del Grupo Empresas Chilquinta, y la Municipalidad de Vallenar unieron capacidades en torno a un objetivo común: que los propios habitantes del Huasco puedan reconocer, registrar y contar aquello que hace único a su territorio. La fotografía será una de las principales herramientas para lograrlo, junto con contenidos de patrimonio, medioambiente, gestión cultural y comunicación digital.",
    "La primera jornada comenzó este martes 29 de septiembre en el Museo de Vallenar, con contenidos sobre patrimonio, biodiversidad y fotografía. Luego, los participantes recorrieron el casco histórico de la ciudad y se trasladaron hasta Chehueque, donde realizaron un recorrido por senderos habilitados para observar la floración y poner en práctica lo aprendido.",
    "El programa contempla cuatro salidas por distintos lugares de la provincia: Chañaral de Aceituno, Huasco, Huasco Bajo, Freirina, Alto del Carmen, San Félix, Llanos de Challe, Carrizal Bajo y Chehueque. En cada recorrido, los participantes abordarán distintos elementos del territorio, desde biodiversidad y patrimonio costero hasta tradiciones agrícolas, paisaje cordillerano, cultura diaguita y Desierto Florido.",
    "La formación continuará con una jornada dedicada a edición fotográfica, diseño y redes sociales, para finalmente presentar el resultado del trabajo en una exposición en el Museo de Vallenar. El proyecto contempla además la creación de un Banco de Fotografías Profesionales de la Provincia del Huasco, construido a partir de los registros realizados por los propios Embajadores Culturales.",
    "Porque para cuidar y poner en valor un lugar, primero hay que conocerlo. Y a veces, basta una cámara para volver a mirarlo.",
  ] },
  { slug: "acuerdo-bomberos-valparaiso", title: "Cuando desconectar la energía salva vidas: Chilquinta y Bomberos Valparaíso firman inédito acuerdo para enfrentar emergencias", date: "2026-09-25", category: "Seguridad", image: bomberos.url, summary: "El convenio, primero de este tipo en Chile, formaliza una coordinación entre ambas instituciones y establece un procedimiento para evaluar y ejecutar desconexiones del suministro eléctrico cuando sea necesario para que Bomberos pueda trabajar de manera segura.", imageAlt: "Firma del acuerdo entre Chilquinta y Bomberos de Valparaíso", paragraphs: [
    "Cuando Bomberos llega a una emergencia y existe riesgo eléctrico, contar con información oportuna y una coordinación clara puede marcar la diferencia. Por eso, Chilquinta Distribución y el Cuerpo de Bomberos de Valparaíso firmaron un acuerdo que establece canales de comunicación, responsabilidades y procedimientos para actuar frente a incendios, rescates, accidentes y otras emergencias que involucren riesgo eléctrico.",
    "La coordinación entre ambas instituciones se desarrollaba en la práctica, pero ahora queda formalizada. El acuerdo establece que, ante una emergencia, Bomberos informará a Chilquinta y su Centro de Comando evaluará las condiciones de la red y la necesidad de realizar maniobras de desconexión, priorizando la seguridad de las personas por sobre la continuidad del servicio.",
    "Esto también permitirá explicar una situación que los clientes pueden experimentar durante una emergencia: la interrupción del suministro es una medida de seguridad para permitir que Bomberos trabaje en el lugar sin exposición al riesgo eléctrico. Una vez controlada la emergencia y verificadas las condiciones de seguridad, se coordinará la reposición del servicio.",
    "El convenio contempla además contactos de emergencia disponibles las 24 horas, capacitaciones, ejercicios de coordinación y simulacros, con el objetivo de fortalecer la preparación de los equipos y mejorar la respuesta conjunta frente a futuras emergencias.",
    "La ceremonia de firma se realizó este viernes 25 de septiembre, en la Plaza Sotomayor, frente al edificio institucional del Cuerpo de Bomberos de Valparaíso, y contó con la presencia de representantes de Chilquinta, Bomberos y SENAPRED.",
    "El convenio será efectivo de manera inmediata. Porque para un cliente, un corte de luz puede significar una molestia, pero cuando ese corte permite que Bomberos entre a una emergencia sin poner en riesgo su vida, detrás de esa interrupción hay algo mucho más importante: personas que están trabajando para salvar otras vidas.",
  ] },
  { slug: "visita-ceipa-colombia", title: "Estudiantes internacionales de CEIPA Colombia sostuvieron visita pedagógica en Chilquinta", date: "2026-09-24", category: "Comunidad", summary: "Estudiantes de CEIPA Colombia visitaron Chilquinta en una jornada de intercambio y aprendizaje.", imageAlt: "Estudiantes de CEIPA Colombia durante su visita a Chilquinta", paragraphs: [] },
  { slug: "septiembre-seguro", title: "Septiembre Seguro 2026: Estudiantes del Colegio Carmelita de El Melón se sumaron a campaña preventiva de Chilquinta", date: "2026-09-23", category: "Prevención", summary: "La comunidad escolar de El Melón se sumó a una jornada de prevención junto a Chilquinta.", imageAlt: "Comunidad escolar en la campaña Septiembre Seguro", paragraphs: [] },
  { slug: "artesania-pari", title: "Chilquinta lleva la artesanía en crin de Rari a encuentro cultural entre Chile, Brasil y China", date: "2026-09-22", category: "Comunidad", image: rari.url, summary: "La artesanía en crin de Rari fue parte de un encuentro cultural entre Chile, Brasil y China.", imageAlt: "Encuentro cultural de Chile, Brasil y China", paragraphs: [] },
  { slug: "desierto-florido", title: "“Mira, Disfruta y Cuida”: lanzan campaña para proteger el Desierto Florido y orientar a sus visitantes", date: "2026-09-15", category: "Medioambiente", image: desierto.url, summary: "Grupo Empresas Chilquinta, Sociedad Concesionaria Valles del Desierto y Municipalidad de Vallenar impulsan una campaña para promover visitas seguras y responsables durante la temporada del Desierto Florido.", imageAlt: "Lanzamiento de campaña para proteger el Desierto Florido", paragraphs: [
    "Para dar comienzo a la campaña se instaló señalética en ambos sentidos de la Ruta 5 Norte para orientar a los visitantes hacia el Mirador del Desierto Florido, un espacio habilitado para detenerse de manera segura, disfrutar del paisaje y tomar fotografías.",
    "También se incorporó señalización al interior del mirador para reforzar las recomendaciones de cuidado, iniciativa desarrollada por Eletrans, filial del Grupo Empresas Chilquinta.",
    "La campaña “Mira, Disfruta y Cuida” busca que esta temporada quienes lleguen hasta la provincia del Huasco puedan vivir el Desierto Florido de manera segura y responsable, convirtiendo cada visita en una oportunidad para conocer, valorar y proteger este patrimonio natural de Atacama.",
  ] },
  { slug: "operativo-catemu", title: "Exitoso operativo permitió reforzar la infraestructura eléctrica de Catemu", date: "2026-09-13", category: "Prevención", image: catemu.url, summary: "La intervención se realizó durante una jornada de trabajo coordinada entre Chilquinta Transmisión y Chilquinta Distribución para prevenir futuras interrupciones y entregar mayor seguridad y confiabilidad al suministro de la comuna.", imageAlt: "Cuadrillas en un operativo eléctrico en Catemu", paragraphs: [
    "Una intervención simultánea en distintos puntos de la infraestructura eléctrica permitió a Chilquinta desarrollar con éxito este domingo una importante jornada de mantenimiento en Catemu, aprovechando las horas de desconexión programada para concentrar una gran cantidad de trabajos en una sola jornada.",
    "La importancia de estas labores está en anticiparse a los problemas. Revisar y mantener las instalaciones antes de que aparezca una falla permite reducir riesgos y contribuir a que el sistema eléctrico pueda seguir funcionando de manera segura y estable.",
    "En el caso de Transmisión, los trabajos se concentraron en la Subestación Catemu y en la línea de 44 kV Estancilla-Catemu, infraestructura fundamental para el abastecimiento eléctrico de la comuna. Se realizó mantenimiento preventivo, revisión de equipos y renovación de elementos que presentaban desgaste, además de medidas para evitar interrupciones asociadas a la presencia de aves.",
    "Las cuadrillas realizaron poda de ejemplares de gran tamaño cercanos a las redes eléctricas. El objetivo es evitar que ramas o árboles puedan entrar en contacto con la infraestructura, especialmente durante episodios de viento, situación que puede provocar cortes de energía.",
    "La coordinación entre Transmisión y Distribución permitió aprovechar una desconexión que ya era necesaria para ejecutar trabajos adicionales, evitando tener que generar nuevas interrupciones para abordar estas tareas.",
    "El resultado es una red mejor preparada para enfrentar los próximos meses, con acciones que apuntan a reducir riesgos y prevenir interrupciones antes de que ocurran, contribuyendo a entregar un suministro eléctrico más seguro y confiable para toda la comunidad.",
  ] },
];

export function fechaNoticia(date: string) {
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}