import { createFileRoute } from "@tanstack/react-router";
import { AdvancePayment } from "@/components/pago/advance-payment";
const title = "Pago adelantado | Chilquinta";
const description = "Si tu cuenta está al día, abona un monto por adelantado a tu próxima boleta Chilquinta.";
export const Route = createFileRoute("/pago-adelantado")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: AdvancePayment,
});
