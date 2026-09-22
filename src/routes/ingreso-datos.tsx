import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { IngresoDatosCard } from "@/components/ingreso/ingreso-datos-card";

const TITLE = "Ingresa tus datos | Boletas y convenios | Chilquinta";
const DESCRIPTION =
  "Verifica tu identidad con tu RUT y número de cliente para revisar tus boletas o tu convenio de pago en Chilquinta.";

type Servicio = "boletas" | "convenio";

const SERVICIOS: Record<Servicio, { titulo: string; contexto: string }> = {
  boletas: { titulo: "Boletas", contexto: "tus boletas" },
  convenio: { titulo: "Convenio de pago", contexto: "tu convenio de pago" },
};

export const Route = createFileRoute("/ingreso-datos")({
  validateSearch: (search: Record<string, unknown>): { servicio: Servicio } => ({
    servicio: search["servicio"] === "convenio" ? "convenio" : "boletas",
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IngresoDatosPage,
});

function IngresoDatosPage() {
  const { servicio } = Route.useSearch();
  const info = SERVICIOS[servicio];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <SiteHeader />

      <main className="flex-1">
        <div className="ch-container py-ch-xl">
          <div className="relative mb-ch-lg flex items-center">
            <Link
              to="/"
              className="absolute left-0 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover hover:underline"
            >
              <ChevronLeft className="size-4" aria-hidden />
              Volver
            </Link>
            <div className="mx-auto flex flex-col items-center gap-ch-sm">
              <h1 className="text-3xl font-bold leading-tight text-foreground lg:text-4xl">
                {info.titulo}
              </h1>
              <span aria-hidden className="h-1 w-16 rounded-full bg-primary" />
            </div>
          </div>

          <IngresoDatosCard servicio={info.contexto} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}