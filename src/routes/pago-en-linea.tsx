import { createFileRoute } from "@tanstack/react-router";
import { PaymentFlow } from "@/components/pago/payment-flow";
const title = "Pago en línea | Chilquinta";
const description = "Selecciona el monto de tu cuenta y el recaudador para completar el recorrido de pago de Chilquinta.";
export const Route = createFileRoute("/pago-en-linea")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: PaymentFlow,
});