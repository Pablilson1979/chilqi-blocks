import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const title = "Chilquinta | Servicios y trámites en línea";
const description =
  "Base del sitio Chilquinta: boletas, convenios y pagos, cortes y emergencias, consumo y trámites en línea.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <SiteHeader />

      {/* Lienzo del sitio: aquí se irán agregando las secciones. */}
      <main className="flex-1" />

      <SiteFooter />
    </div>
  );
}
