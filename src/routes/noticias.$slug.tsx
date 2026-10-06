import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { FotoNoticia } from "@/components/noticias/noticias-portada";
import { noticias, fechaNoticia } from "@/lib/noticias-data";

export const Route = createFileRoute("/noticias/$slug")({
  loader: ({ params }) => {
    const noticia = noticias.find(item => item.slug === params.slug);
    if (!noticia) throw notFound();
    return noticia;
  },
  head: ({ loaderData }) => {
    const title = `${loaderData?.title ?? "Noticia"} | Chilquinta`;
    const description = loaderData?.summary ?? "Actualidad y noticias de Chilquinta.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: NoticiaDetalle,
});

function NoticiaDetalle() {
  const noticia = Route.useLoaderData();
  return <div className="flex min-h-screen flex-col bg-surface font-sans text-foreground">
    <SiteHeader />
    <main className="ch-container flex-1 py-ch-xl sm:py-ch-2xl">
      <Button asChild variant="tertiary" className="mb-ch-lg -ml-2 text-base"><Link to="/noticias/"><ArrowLeft aria-hidden />Volver a noticias</Link></Button>
      <article>
        <header className="mx-auto max-w-4xl">
          <p className="flex items-center gap-3 text-base font-semibold text-muted-foreground"><span className="h-0.5 w-8 bg-primary" aria-hidden />{noticia.category}</p>
          <time dateTime={noticia.date} className="mt-3 block text-base text-muted-foreground">{fechaNoticia(noticia.date)}</time>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{noticia.title}</h1>
          <p className="mt-ch-lg text-lg leading-relaxed text-muted-foreground">{noticia.summary}</p>
        </header>
        <figure className="mx-auto my-ch-xl max-w-5xl">
          <div className="aspect-[3/2] overflow-hidden rounded-input sm:aspect-video"><FotoNoticia noticia={noticia} /></div>
          {noticia.image && <figcaption className="mt-3 text-base text-muted-foreground">{noticia.imageAlt}</figcaption>}
        </figure>
        <div className="mx-auto max-w-[720px] space-y-ch-lg text-base leading-loose sm:text-lg">
          {noticia.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {noticia.paragraphs.length === 0 && <Button asChild variant="secondary" className="text-base"><a href="https://www.chilquinta.cl/noticias/titulares-noticias" target="_blank" rel="noopener noreferrer">Ver publicación original<ArrowRight aria-hidden /></a></Button>}
        </div>
      </article>
      <div className="mx-auto mt-ch-2xl max-w-[720px] border-t border-border pt-ch-lg"><Button asChild variant="tertiary" className="-ml-2 text-base"><Link to="/noticias/"><ArrowLeft aria-hidden />Todas las noticias</Link></Button></div>
    </main>
    <SiteFooter />
  </div>;
}