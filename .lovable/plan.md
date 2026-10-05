# Integrar “Mi suministro / Mapa de cortes” al sitio Chilquinta

## Objetivo
Traer desde **Emergency Response Hub** la funcionalidad completa de cortes y consolidarla en este proyecto, manteniendo el header, footer y sistema visual Chilquinta ya definidos aquí.

La nueva experiencia se abrirá desde **Cortes** en los accesos rápidos del home. También se conectará **Ver Cortes** del menú “Cortes y emergencias” al mismo destino.

## Alcance funcional que se conserva
- Una página de **Cortes de suministro** con selector entre:
  - **Mi suministro**: consulta por N° de cliente, dirección o N° de orden.
  - **Mapa de cortes**: vista regional de interrupciones y desconexiones.
- Comportamiento responsive original:
  - En móvil comienza en “Mi suministro”.
  - En escritorio comienza en “Mapa de cortes”.
  - El usuario puede cambiar de vista en cualquier momento.
- Todos los estados de “Mi suministro”: sin corte, corte confirmado con hora, hora en actualización, falla en investigación, técnicos en terreno, solicitud individual y servicio restablecido.
- Reposición estimada, datos del sector, clientes afectados y avance de la reparación.
- Mapa interactivo con agrupación de puntos, polígonos, selección de cortes y servicios repuestos recientes.
- Búsqueda por cliente, orden, sector o comuna; filtros por tipo, estado y comuna; agrupación de resultados por comuna.
- Alternancia lista/mapa en móvil, detalle del corte seleccionado, resumen de afectados, tendencia histórica y recorrido guiado.
- Datos de demostración y escenarios de prototipo del proyecto fuente.

## Adaptación al UI kit de este proyecto
- Usar el **SiteHeader** y **SiteFooter** actuales, sin copiar el encabezado ni el pie del proyecto fuente.
- Mantener Montserrat, contenedores, espaciados, radios, sombras, foco accesible y tokens semánticos de Chilquinta DS 4.0.
- Sustituir estilos locales y colores literales del proyecto fuente por los componentes y roles existentes: Button, Input, Card, StatusMessage y estados success/info/warning/destructive.
- Mantener el rojo corporativo para acciones, selección y estados críticos; usar azul, verde, amarillo y gris según el significado ya establecido en el kit.
- Homologar el encabezado de la página con las otras funcionalidades: volver, título centrado y línea roja inferior.
- Ajustar textos menores a 16 px cuando sean contenido relevante, sin perder la jerarquía compacta del mapa.
- Evitar tarjetas anidadas y ordenar la información para que mapa, filtros y resultados sigan siendo claros en escritorio y móvil.

## Integración y navegación
- Crear la ruta `/interrupciones` con metadata propia: título, descripción, Open Graph y Twitter.
- Conectar el acceso **Cortes** del home a `/interrupciones`.
- Conectar **Ver Cortes** del menú “Cortes y emergencias” a `/interrupciones`.
- Mantener **Seguimiento de mi corte** como funcionalidad independiente en `/sigue-tu-visita`.
- Mantener **Reportar corte** sin inventar un flujo nuevo; las llamadas internas a reportar quedarán preparadas para ese destino y no se mezclarán con el seguimiento técnico.

## Implementación técnica
- Migrar los módulos de datos, tarjetas, seguimiento, búsquedas, filtros, mapa, tendencia y recorrido guiado desde el snapshot de Emergency Response Hub.
- Añadir Leaflet y marker clustering con carga exclusiva en navegador para conservar SSR y evitar pantallas en blanco.
- Incorporar los estilos base de Leaflet al inicio de la hoja global, conservando `src/styles.css` como única fuente del sistema visual.
- Reemplazar botones e inputs crudos por los componentes del kit donde corresponda y eliminar valores visuales hardcodeados.
- Mantener los datos mock aislados para que más adelante puedan sustituirse por servicios reales sin rehacer la interfaz.
- Registrar la decisión de arquitectura y el inventario de la migración antes de modificar la funcionalidad.

## Verificación
- Probar ambas vistas y cada escenario de “Mi suministro”.
- Probar búsqueda, filtros, selección desde lista y mapa, repuestos recientes, cambio de categoría y recorrido guiado.
- Verificar navegación desde el home y desde el menú “Cortes y emergencias”.
- Revisar escritorio y móvil con el mapa visible, controles sin superposición y textos legibles.
- Confirmar que `/`, `/interrupciones`, `/sigue-tu-visita`, `/quiero-luz` y `/ingreso-datos` siguen cargando sin errores.

## Fuera de esta etapa
- Conexión a APIs productivas de cortes, geocodificación o datos de clientes.
- Creación del flujo completo de **Reportar corte**.
- Persistencia, autenticación o notificaciones reales.
