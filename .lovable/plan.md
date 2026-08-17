# Quiero Luz — análisis y plan

## Insights del contexto (reunión + apuntes + manual)

**Problema 1 — Las etapas mostradas no coinciden con el proceso real.**
La pantalla actual de Quiero Luz muestra 6 etapas lineales (01 Ingreso de solicitud → 06 Conexión de empalme). Con la nueva Norma Técnica (vigente 04-11-2025) el proceso son **3 macroetapas normativas**, cada una con su propio ingreso y su respuesta:
Factibilidad → Solicitud de conexión → Notificación de conexión.
En la reunión se acuerda dividir "Ingreso de solicitud" en esas tres subetapas y ubicar el **pago en la tercera macroetapa**, junto con confirmación de visita y conexión. Objetivo explícito: **coherencia entre lo que dice la web y los pasos que pide la plataforma nueva "Tu Conexión"**.

**Problema 2 — Quiero Luz no queda claro como orientación.**
Los apuntes lo definen: "si no sabes qué tipo de empalme solicitar, completa esta guía — **es una orientación**". Es un primer acercamiento (como cotizar un auto): estima el empalme/potencia y explica el proceso, **no garantiza obtención ni precio**. Al final el usuario debe conocer etapas y plazos antes de ir a solicitar.

**Problema 3 — Seguimiento de solicitudes quebrado entre sistemas.**
La API de seguimiento sólo reconoce números de solicitud del **sistema antiguo**; las ingresadas en el sistema nuevo no aparecen. Además el sistema nuevo **no tiene mensajería**, por lo que el seguimiento se hace en la plataforma. Solución acordada: mensaje ("si ingresaste tu solicitud a partir del 01 de julio, haz el seguimiento aquí" con link) **y** una validación por número/fecha de ingreso que derive automáticamente a la plataforma nueva.

**Problema 4 — Nombre y correlativo.** Queda abierto si "Quiero Luz" es el nombre definitivo y si los correlativos del sistema nuevo son distinguibles. El plan deja el copy y el umbral de correlativo/fecha en un solo archivo de configuración para cambiarlos sin tocar componentes.

## Solución

Nueva ruta `/quiero-luz`, accesible desde **Servicio al cliente → Quiero luz en mi propiedad** (mega-menú desktop y menú mobile), con header/footer del sitio y encabezado propio (Volver + ampolleta + "Quiero luz en mi propiedad").

### 1. Portada / guía (paso 0)
- Tarjeta de aviso: la guía muestra los pasos, **no garantiza la obtención inmediata**; es una orientación. Antes de comenzar debes conocer todas las etapas y plazos.
- **Mapa de 3 macroetapas** (chips Factibilidad → Conexión → Notificación) y bajo cada una un acordeón con sus subetapas, reemplazando la lista plana de 6:
  1. **Solicitud de factibilidad**: ingreso de solicitud y antecedentes (autorización notarial si es un tercero, set fotográfico), revisión y respuesta en **hasta 3 días** (ampliable con estudios o visita a terreno).
  2. **Solicitud de conexión**: ingreso, presupuesto y condiciones técnicas, permisos y plazos, aprobación.
  3. **Notificación de conexión**: entrega de documentos (contrato de suministro, declaración TE1, dominio vigente, registro fotográfico de trabajos previos), **pago**, confirmación de visita (≈5 días) y conexión (10 días visita / 15 días construcción, empalme monofásico).
- Dos CTA: "Simular mi empalme" y "Ya sé lo que necesito → Ir a Tu Conexión".

### 2. Simulador (stepper de 4 pasos, círculos verde/rojo como el adjunto)
1. **Tipo de requerimiento**: nuevo empalme / aumento de potencia · baja o media tensión · unitario o alumbrado público (`SelectionCard`).
2. **Datos de la propiedad**: tipo de inmueble, comuna, solicitante propietario o tercero (avisa autorización notarial), existe medidor.
3. **Pack referencial de artefactos**: Pack 01 (hasta 25 A), Pack 02 (sobre 25 hasta 40 A), Pack 03 (sobre 40 A / trifásico) con el listado de artefactos del adjunto; selección única.
4. **Resumen**: "La conexión que necesitas es: **Empalme Aéreo de 25 amperes**" + nota "considera construcción de empalme con medidor propiedad de Chilquinta" y acordeones: pasos a seguir (las 3 macroetapas ya resueltas para su caso), documentos que debe presentar, trabajos previos, agendar Video Atención. Botones: "Enviar esta simulación a mi email" y "Continuar en Tu Conexión".

Cálculo referencial en frontend: pack + tensión + tipo → amperaje (25/40/63 A), aéreo/subterráneo, mono/trifásico. Se rotula siempre como referencial.

### 3. Seguimiento de solicitud (bloque en la misma página)
Campo "N° de solicitud" con validación local: si el número supera el umbral configurado o el usuario indica fecha de ingreso posterior al corte, se muestra el mensaje y el enlace directo a **Tu Conexión** en vez de consultar el seguimiento antiguo; en caso contrario, se mantiene el flujo actual. Sin backend: umbral y textos en configuración.

## Detalles técnicos
- `src/routes/quiero-luz.tsx` con `head()` propio (title, description, og:title, og:description).
- `src/components/quiero-luz/`: `page-header.tsx`, `macro-stages.tsx`, `process-guide.tsx`, `stepper.tsx`, `step-tipo.tsx`, `step-propiedad.tsx`, `step-packs.tsx`, `step-resumen.tsx`, `seguimiento.tsx`.
- `src/components/quiero-luz/data.ts`: copys, macroetapas y subetapas con plazos, packs, lógica de amperaje, umbral/fecha de corte para el seguimiento y URL de Tu Conexión.
- Estado local con `useState`; sin base de datos ni envío real de email (formulario validado con mensaje de éxito).
- Sólo tokens del DS (`primary`, `success`, `muted`, `rounded-card`, sombras), `Accordion`, `Card`/`SelectionCard`, `Button`, `Progress`. Mobile: stepper compacto y tarjetas full-width.
- Iconos de artefactos con `lucide-react`; si quieres los mismos del adjunto, mándalos en SVG y los reemplazo.
