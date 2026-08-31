import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/home/hero";
import { QuickAccess } from "@/components/home/quick-access";
import { ConoceMas } from "@/components/home/conoce-mas";
import { Plataformas } from "@/components/home/plataformas";
import { EmergenciaHome } from "@/components/home/emergencia-home";

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
  const [emergencyMode, setEmergencyMode] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <SiteHeader
        tagline={emergencyMode ? "Emergencia climática en curso" : "¿Qué necesitas?"}
        emergencyMode={emergencyMode}
        onEmergencyModeChange={setEmergencyMode}
      />

      <main className="flex-1">
        {emergencyMode ? (
          <EmergenciaHome />
        ) : (
          <>
            <Hero />
            <QuickAccess />
            <ConoceMas />
            <Plataformas />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
