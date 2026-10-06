# Jerarquía visual de la tarjeta de corte (CorteMapaCard)

## Objetivo
Que la tarjeta abierta de un corte tenga jerarquía clara y menos carga cognitiva: la reposición estimada domina, los sectores muestran hasta 3 nombres, y el contenido se organiza en dos bloques (cuándo / dónde y por qué) separados con aire visual.

## Cambios

### 1. Reposición estimada como dato dominante
- Etiqueta pequeña en mayúsculas gris (muted-foreground); la hora grande y en negrita (28–30 px, mantiene 16 px mínimo en el resto).
- Para desconexiones programadas, la fecha/horario ocupa el mismo rol visual.
- El estado "vencida"/"investigación" mantiene el mensaje actual pero con la misma jerarquía (mensaje grande, nota de actualización pequeña gris).

### 2. Bloque de alcance degradado a segundo plano
- Causa y "N clientes afectados" pasan de bold/foreground a texto normal (16 px), con la causa en muted-foreground y los clientes con número destacado solamente.
- Se elimina el peso visual que hoy compite con la hora.

### 3. Sectores: hasta 3 por corte
- Añadir campo `sectores: string[]` (3 nombres por corte) a `Interrupcion` en `interrupciones-data.ts`; `sector` queda como sector principal (primero de la lista) para no romper mapa, tooltips ni búsquedas.
- `CorteMapaCard` muestra los 3 nombres en lista compacta, el primero en negrita; el resto en peso normal. Los datos mock toman 3 sectores del grupo de la comuna.

### 4. Dos bloques con aire visual
- Bloque A (cuándo): tipo de evento + reposición estimada/fecha + notas asociadas.
- Bloque B (dónde): causa, clientes afectados y sectores.
- Separador sutil (border-t) entre bloques; espaciados compactos dentro de cada bloque para conservar la tarjeta compacta de escritorio (plan anterior).

### 5. Alcance
- Solo `CorteMapaCard.tsx` y `interrupciones-data.ts` (más tipado derivado).
- Tarjetas cerradas, CorteCard de "Mi suministro", móvil y el resto de la funcionalidad no cambian.

## Validación
- Escritorio: abrir una comuna y confirmar que la hora es lo primero que se lee, que aparecen 3 sectores y que la tarjeta completa sigue cabiendo junto al mapa.
- Revisar los tres estados (vigente, vencida, investigación) y desconexiones programadas en azul.
- Verificar móvil sin regresiones y build sin errores.
