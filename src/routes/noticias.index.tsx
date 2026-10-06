import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NoticiasPortada } from "@/components/noticias/noticias-portada";

const title = "Noticias Chilquinta | Actualidad de nuestra región";
const description = "Noticias de Chilquinta: prevención, comunidad, seguridad y novedades de nuestra región.";
export const Route = createFileRoute("/noticias/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <div className="flex min-h-screen flex-col bg-surface font-sans text-foreground"><SiteHeader /><NoticiasPortada /><SiteFooter /></div>,
});