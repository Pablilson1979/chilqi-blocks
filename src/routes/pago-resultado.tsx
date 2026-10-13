import { createFileRoute } from "@tanstack/react-router";
import { PaymentResult } from "@/components/pago/payment-result";
const title = "Resultado de pago QA | Chilquinta";
const description = "Confirmación de prueba del pago en línea de Chilquinta, con resumen del monto y recaudador seleccionado.";
export const Route = createFileRoute("/pago-resultado")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] }),
  component: PaymentResult,
});