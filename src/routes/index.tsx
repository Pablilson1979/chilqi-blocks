import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/home/hero";
import { QuickAccess } from "@/components/home/quick-access";
import { ConoceMas } from "@/components/home/conoce-mas";
import { Plataformas } from "@/components/home/plataformas";

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

      <main className="flex-1">
        <h2 className="ch-container py-ch-base text-center text-2xl font-bold text-primary">
          ¿ Que necesitas ?
        </h2>
        <Hero />
        <QuickAccess />
        <ConoceMas />
        <Plataformas />
      </main>

      <SiteFooter />
    </div>
  );
}
