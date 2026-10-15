import { createFileRoute } from "@tanstack/react-router";
import { PaymentResult } from "@/components/pago/payment-result";
const title = "Resultado del pago en línea | Chilquinta";
const description = "Revisa el resultado de tu pago de prueba Chilquinta y su resumen, o vuelve a intentarlo si no se pudo completar.";
export const Route = createFileRoute("/pago-resultado")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] }),
  component: PaymentResult,
});