import { createFileRoute } from "@tanstack/react-router";
import { FileText, Zap, Info } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/chilquinta/field";
import { StatusMessage } from "@/components/chilquinta/status-message";
import {
  FeatureCard,
  InfoCard,
  CorporateCard,
  SelectionCard,
  RequestStatusCard,
} from "@/components/chilquinta/cards";
import dsBuildings from "@/assets/ds-buildings.jpg";

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
        <section className="ch-container py-ch-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Design System 4.0
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold text-foreground lg:text-5xl">
            Base corporativa lista para recrear el sitio de Chilquinta
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Tokens de marca, componentes Chilquinta y layout corporativo ya integrados en este
            proyecto.
          </p>
          <div className="mt-ch-lg flex flex-wrap gap-ch-md">
            <Button>Acción principal</Button>
            <Button variant="outline">Acción secundaria</Button>
            <Button variant="ghost">Terciaria</Button>
          </div>
        </section>

        <section className="ch-container grid gap-ch-lg pb-ch-2xl lg:grid-cols-2">
          <div className="flex flex-col gap-ch-base">
            <Field id="rut" label="RUT" placeholder="12.345.678-9" message="Sin puntos ni guion." />
            <Field
              id="cliente"
              label="Número de cliente"
              state="success"
              defaultValue="004512338"
              message="Cliente validado correctamente."
            />
            <Field
              id="email"
              label="Correo electrónico"
              state="error"
              defaultValue="correo@"
              message="Ingresa un correo válido."
            />
          </div>
          <div className="flex flex-col gap-ch-base">
            <StatusMessage
              tone="success"
              title="Pago recibido"
              description="Tu boleta de marzo fue pagada."
              detail="Folio: 88213 | Fecha: 12 de marzo"
            />
            <StatusMessage
              tone="warning"
              title="Corte programado"
              description="Mantención en tu sector entre 09:00 y 13:00."
            />
            <StatusMessage
              tone="error"
              title="No pudimos validar tus datos"
              description="Revisa el RUT ingresado e inténtalo nuevamente."
            />
          </div>
        </section>

        <section className="ch-container grid gap-ch-lg pb-ch-2xl lg:grid-cols-3">
          <SelectionCard
            title="Baja Tensión"
            description="Empalmes domiciliarios y comercio menor."
            icon={<Zap />}
            selected
          />
          <InfoCard
            icon={<Info />}
            title="Lectura de medidor"
            description="Revisa tu consumo y compara los últimos seis meses."
          />
          <CorporateCard
            eyebrow="Trámites"
            title="Solicitud de empalme"
            description="Inicia tu solicitud en línea y sigue su avance."
            actionLabel="Comenzar"
            icon={<FileText />}
          />
          <RequestStatusCard
            title="Solicitud de empalme"
            orderId="SOL-2026-0912"
            description="Estamos revisando los antecedentes técnicos."
            stepLabel="Etapa 2 de 4"
            progress={50}
          />
          <FeatureCard
            image={dsBuildings}
            imageAlt="Edificios en Valparaíso"
            eyebrow="Gestión inmobiliaria"
            title="Proyectos y loteos"
            description="Coordina la electrificación de tu proyecto con nuestro equipo."
            actionLabel="Ver más"
            className="lg:col-span-2"
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
