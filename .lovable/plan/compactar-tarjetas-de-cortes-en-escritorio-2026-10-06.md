# Compactar tarjetas de cortes en escritorio

## Objetivo
Permitir que al abrir una comuna se vea al menos una tarjeta individual completa junto al mapa, sin desplazar toda la página.

## Cambios
- Compactar solo en escritorio la tarjeta interior del corte o desconexión: reducir espacios verticales, márgenes y separación entre bloques, conservando textos de 16 px y el mismo contenido.
- Mantener el seguimiento compartido con “Mi suministro”, usando su opción compacta en esta vista en vez de crear otro componente.
- Dar a la columna izquierda un alto máximo alineado con el mapa y desplazamiento vertical propio cuando existan más tarjetas.
- Mantener sin cambios las tarjetas cerradas de comuna y la presentación móvil.
- Conservar visible y dentro de su columna el mapa, su leyenda y el botón “Reportar un corte”.

## Validación
- Revisar en escritorio que una tarjeta abierta completa sea visible junto al mapa en el alto actual de la pantalla.
- Confirmar que la lista se desplaza de forma independiente y no ensancha ni mueve el mapa.
- Comprobar móvil, Interrupciones, Desconexiones y el detalle seleccionado.
- Verificar compilación y ausencia de errores en pantalla.

## Detalles técnicos
- Ajustes limitados a los componentes de interrupciones.
- El scroll se aplicará desde `lg` con una altura máxima equivalente al mapa; no habrá scroll interno forzado en móvil.
- Se reutilizará `Tracker` con su variante compacta existente.
