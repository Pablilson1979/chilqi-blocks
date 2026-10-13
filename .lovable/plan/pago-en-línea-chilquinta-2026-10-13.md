# Pago en línea Chilquinta

## Objetivo
Recrear el recorrido de las referencias conservando su lógica familiar: **1. Seleccionar el monto del pago → 2. Seleccionar recaudador → Confirmación de éxito simulada para QA**. Mantener el header y footer actuales, Montserrat y el fondo gris corporativo del UI kit.

## Entrada desde el home
- Conectar «Paga tu cuenta» con el nuevo recorrido después de validar N° de cliente o RUT, sin alterar el diseño ni los estados actuales del formulario.
- Usar datos de boleta de prueba basados en las referencias; no consultar cuentas reales. La identificación ingresada se mantiene durante el recorrido.

## Paso 1 · Seleccionar el monto del pago
- Título «Pago en línea» y progreso numerado de dos pasos, con etapa actual naranja, completada verde con check y pendiente gris.
- Resumen compacto de dirección, N° de cliente y vencimiento, visible en ambos pasos.
- Tres alternativas excluyentes: **Saldo total**, **Saldo anterior** y **Paga lo que puedas**. Saldo total seleccionado inicialmente; selección con borde verde, fondo verde suave y check.
- Mantener los importes de la referencia como escenario QA: total **$68.049**, saldo anterior **$40.026** y saldo actual **$28.023**. El saldo actual se obtiene por diferencia para que el desglose coincida con el total; la referencia muestra un desglose inconsistente.
- Para monto libre, aceptar pesos enteros, mostrar formato chileno y validar mínimo **$100**; error junto al campo y avance deshabilitado si el monto no es válido.
- CTA «Continuar y pagar $[monto]» actualizado según selección.
- «Ver detalle boleta» abre un detalle de prueba coherente con el resumen. «Pagar otro RUT o N° de cliente» permite volver a la identificación.

## Paso 2 · Seleccionar recaudador
- Conservar las pestañas **Pago Express** y **Otros portales de pago**.
- Usar los logos SVG adjuntos, tarjetas seleccionables y check verde. Mostrar tipo de pago y límites de las referencias:
  - Bemobi: crédito, hasta **$1.000.000**, hasta **12 cuotas**, con aviso de comisión por servicio.
  - BancoEstado: débito, hasta **$400.000.000**.
  - Bci / MACH: débito, hasta **$3.000.000**.
  - Servipag: débito, hasta **$3.000.000**.
  - Unired, en otros portales: débito y crédito, hasta **$1.000.000**.
- Recaudadores incompatibles con el monto quedan no seleccionables y explican el límite. Cambiar de pestaña no conserva una selección oculta de la otra pestaña.
- Correo obligatorio con validación y mensaje claro junto al campo.
- Destacar monto y recaudador antes de «Pagar $[monto]». «Volver» conserva el monto elegido.

## Confirmación QA
- Simular procesamiento al pagar, bloquear dobles clics y mostrar una pantalla final con check verde y título **«Pago simulado exitoso»**.
- Mostrar monto, cliente, dirección, recaudador, correo y referencia de operación ficticia.
- Aclarar que es una prueba QA, sin cobro real ni envío de correo. No solicitar datos de tarjeta ni credenciales bancarias.
- Permitir volver al inicio o comenzar otro pago.

## Experiencia móvil y escritorio
- Móvil primero: alternativas y recaudadores en una columna, campos amplios, etiquetas legibles y controles táctiles cómodos; sin desplazamiento horizontal.
- Escritorio: ancho contenido dentro del mismo marco del header/footer, alternativas de monto horizontales y recaudadores en grilla.
- Fondo general gris corporativo, superficies blancas y separación limpia, sin tarjetas anidadas ni avisos que compitan.
- Mantener el monto junto a la acción principal, errores accesibles y navegación por teclado; no superponer acciones al footer.

## Detalles técnicos y verificación
- Nuevas rutas de pago y resultado en TanStack Router con metadata propia. Componentes de pago separados de la tarjeta del home, y datos/validaciones en módulos browser-safe.
- Estado temporal del prototipo, sin persistir RUT, correo o transacciones en almacenamiento local ni incluirlos en la URL. Si se recarga y falta el contexto, ofrecer volver al inicio sin fabricar un pago exitoso.
- Reutilizar componentes y tokens del UI kit; registrar la estructura en AGENTS.md y las reglas de pago aprobadas en la memoria del proyecto durante la implementación.
- Pruebas de mínimo $100, importes, límites de cada recaudador, correo y bloqueo de pago inválido. Verificar en navegador el recorrido completo desde el home hasta éxito QA en móvil y escritorio, incluido volver y cambiar monto.
- **Fuera de alcance:** cobros, conexiones productivas, envío real de comprobantes y modificación de otras funcionalidades.