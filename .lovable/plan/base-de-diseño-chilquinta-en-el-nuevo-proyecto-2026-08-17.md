# Base de diseño Chilquinta en el nuevo proyecto

Primer paso antes de recrear el sitio: traer el sistema de diseño y los componentes corporativos desde el proyecto "Chilquinta Design Unity", sin inventar estilos nuevos.

## Qué se trae

Tokens y marca
- `src/styles.css` completo (paleta oficial #DA291C / #B5120B / #3B4559 / #F1F1F3, estados éxito-info-alerta, radios pill 30px / input 8px / card 12px, escala de espaciado de 4px, breakpoints y tipografía Montserrat).
- Enlace de la fuente Montserrat en `src/routes/__root.tsx` (etiqueta `<link>` en el head, no `@import` en CSS).

Componentes Chilquinta
- `src/components/chilquinta/cards.tsx`
- `src/components/chilquinta/field.tsx`
- `src/components/chilquinta/modal.tsx`
- `src/components/chilquinta/status-message.tsx`

Componentes UI base (versiones con variantes de marca)
- `button.tsx`, `input.tsx`, `switch.tsx`, `checkbox.tsx`, `radio-group.tsx`, `card.tsx` en `src/components/ui/`

Layout corporativo
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`

## Verificación

Se reemplaza el placeholder de `src/routes/index.tsx` por una página de inicio mínima que monta el header y el footer corporativos y muestra botones, campos, cards y mensajes de estado, para confirmar visualmente que los tokens y componentes quedaron bien. Además se le ponen título y meta descripción propios de Chilquinta, no los del template.

## Notas técnicas

- Las dependencias que usan estos componentes (Radix checkbox/switch/radio-group/slot/dialog, lucide-react, class-variance-authority, tailwind-merge) ya están instaladas en este proyecto: no hace falta instalar nada.
- Los archivos se copian tal cual del snapshot para que no haya deriva de valores; header y footer se ajustan sólo si algún import no existe aquí.
- No se toca `src/routeTree.gen.ts` ni la configuración del router.

## Siguiente paso (fuera de este plan)

Con la base lista, definimos qué páginas del sitio de Chilquinta recrear (home, servicios, sucursales, pago en línea, etc.) y en qué orden.