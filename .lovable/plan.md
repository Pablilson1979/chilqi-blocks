# Nueva plataforma "Quiero luz"

Simulador/orientador previo a una solicitud real de nuevo empalme o aumento de potencia (como cotizar un auto): el usuario responde unos pasos y obtiene el empalme referencial que necesita, las etapas del proceso según la nueva Norma Técnica y los documentos que deberá presentar. No ejecuta la solicitud: al final deriva a la plataforma "Tu Conexión" (ventaservicios.chilquinta.cl).

## Acceso
- Nueva ruta `/quiero-luz`.
- El ítem "Quiero luz en mi propiedad" del mega-menú **Servicio al cliente** (desktop y mobile) apunta a esa ruta con `<Link>`.

## Estructura de la página
Encabezado propio: "Volver" a la izquierda + icono ampolleta rojo + título "Quiero luz en mi propiedad", sobre fondo `background`, dentro del header/footer del sitio.

### Bloque 1 — Guía informativa (paso 0)
- Tarjeta blanca con el aviso: la guía muestra los pasos, **no garantiza obtención inmediata**; antes de comenzar debes conocer todas las etapas y plazos estimativos.
- "Proceso de venta de nuevo medidor" con acordeón de etapas, reorganizado en **3 macroetapas** (acuerdo de la reunión, coherente con la plataforma nueva):
  1. **Solicitud de factibilidad** — ingreso de solicitud, revisión de antecedentes y factibilidad, respuesta.
  2. **Solicitud de conexión** — presupuesto, condiciones técnicas, plazos, aprobación y pago.
  3. **Notificación de conexión** — entrega de documentos, confirmación de visita y conexión del empalme.
  Cada macroetapa lista sus subetapas con el texto actual (01 Ingreso de solicitud … 06 Conexión de empalme) y plazos estimativos (3 días factibilidad, 5 días confirmación de visita, 10/15 días conexión).

### Bloque 2 — Simulador por pasos (stepper de 4 pasos)
Stepper horizontal con círculos (verde = completado, rojo = actual), como el adjunto.
1. **Tipo de requerimiento**: Nuevo empalme / Aumento de potencia · Baja tensión / Media tensión · Unitario / Alumbrado público (usa `SelectionCard` del DS).
2. **Datos de la propiedad**: tipo de inmueble, comuna, si la solicitud la hace el propietario o un tercero (avisa autorización notarial), si existe medidor.
3. **Pack referencial de artefactos**: Pack 01 (hasta 25 A), Pack 02 (sobre 25 hasta 40 A), Pack 03 (sobre 40 A / trifásico) con el listado de artefactos; selección única.
4. **Resumen de proceso**: "La conexión que necesitas es: **Empalme Aéreo de 25 amperes**" + nota de medidor propiedad de Chilquinta, y acordeones: pasos a seguir, resumen de documentos a presentar, trabajos previos, agendar Video Atención. Botón "Enviar esta simulación a mi email" y CTA "Ir a Tu Conexión".

Reglas de cálculo (frontend, sin backend): pack + tensión + tipo definen amperaje y tipo de empalme (aéreo/subterráneo, mono/trifásico); el resultado se muestra como referencial.

### Estado
Estado local en el componente de la ruta (`useState`), sin persistencia ni base de datos. El botón "Continuar" se habilita solo cuando el paso está completo. "Enviar simulación a mi email" queda como formulario con validación de correo y mensaje de éxito (no envía todavía).

## Detalles técnicos
- `src/routes/quiero-luz.tsx` con `head()` propio (título/description/og).
- Componentes nuevos en `src/components/quiero-luz/`: `page-header.tsx`, `process-guide.tsx` (macroetapas + acordeón), `stepper.tsx`, `step-tipo.tsx`, `step-propiedad.tsx`, `step-packs.tsx`, `step-resumen.tsx`, y `data.ts` con textos, packs y lógica de amperaje.
- Solo tokens del DS (`primary`, `success`, `muted`, `rounded-card`, sombras); acordeón con `@/components/ui/accordion`, tarjetas con `Card`/`SelectionCard`, botones con `Button`.
- Iconos de artefactos: se usan iconos de línea de `lucide-react` (refrigerador, lavadora, TV, etc.). Si quieres los mismos iconos del adjunto, mándamelos como SVG y los reemplazo.
- Mobile: stepper compacto, tarjetas full-width, mismos textos.
