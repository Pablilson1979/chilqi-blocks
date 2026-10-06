import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { noticias, fechaNoticia, type Noticia } from "@/lib/noticias-data";

export function FotoNoticia({ noticia, className = "" }: { noticia: Noticia; className?: string }) {
  return noticia.image ? <img src={noticia.image} alt={noticia.imageAlt} className={`h-full w-full object-cover ${className}`} loading="lazy" /> : <div className={`flex h-full w-full items-center justify-center bg-muted text-muted-foreground ${className}`} role="img" aria-label="Fotografía pendiente"><Image className="size-8" aria-hidden /></div>;
}

export function NoticiasPortada() {
  const [visible, setVisible] = useState(4);
  const principal = noticias[0];
  if (!principal) return null;
  return <main className="ch-container flex-1 py-ch-xl sm:py-ch-2xl">
    <Button asChild variant="tertiary" className="mb-ch-lg -ml-2 text-base"><Link to="/"><ArrowLeft aria-hidden />Volver al inicio</Link></Button>
    <header className="mb-ch-lg sm:mb-ch-xl">
      <p className="mb-2 flex items-center gap-3 text-base font-semibold text-muted-foreground"><span className="h-0.5 w-8 bg-primary" aria-hidden />Actualidad</p>
      <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Noticias Chilquinta</h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">Información y novedades de nuestra región.</p>
    </header>
    <article className="pb-ch-xl">
      <Link to="/noticias/$slug" params={{ slug: principal.slug }} aria-label={`Leer: ${principal.title}`} className="relative block aspect-video overflow-hidden rounded-input lg:aspect-[21/9]">
        <FotoNoticia noticia={principal} />
        <span className="absolute left-4 top-4 rounded-sm bg-primary px-3 py-1.5 text-base font-semibold text-primary-foreground">Destacada</span>
      </Link>
      <div className="mt-ch-lg max-w-4xl">
        <time dateTime={principal.date} className="text-base text-muted-foreground">{fechaNoticia(principal.date)}</time>
        <h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl"><Link to="/noticias/$slug" params={{ slug: principal.slug }} className="transition-colors hover:text-primary">{principal.title}</Link></h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">{principal.summary}</p>
        <Button asChild variant="tertiary" className="mt-3 -ml-2 text-base"><Link to="/noticias/$slug" params={{ slug: principal.slug }}>Leer noticia<ArrowRight aria-hidden /></Link></Button>
      </div>
    </article>
    <section aria-label="Más noticias" className="border-t border-border py-ch-xl">
      <div className="grid gap-ch-xl lg:grid-cols-3 lg:gap-ch-lg">
        {noticias.slice(1, visible).map(noticia => <article key={noticia.slug} className="grid grid-cols-[minmax(0,1fr)_96px] items-start gap-4 border-b border-border pb-ch-lg lg:grid-cols-[minmax(0,1fr)_88px]">
          <div className="min-w-0">
            <p className="text-base font-semibold text-muted-foreground">{noticia.category}</p>
            <h2 className="mt-2 text-lg font-bold leading-snug"><Link to="/noticias/$slug" params={{ slug: noticia.slug }} className="hover:text-primary">{noticia.title}</Link></h2>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">{noticia.summary}</p>
            <time dateTime={noticia.date} className="mt-3 block text-base text-muted-foreground">{fechaNoticia(noticia.date)}</time>
            <Button asChild variant="tertiary" className="mt-2 -ml-2 text-base"><Link to="/noticias/$slug" params={{ slug: noticia.slug }} aria-label={`Leer: ${noticia.title}`}>Leer noticia<ArrowRight aria-hidden /></Link></Button>
          </div>
          <Link to="/noticias/$slug" params={{ slug: noticia.slug }} aria-label={`Leer: ${noticia.title}`} className="aspect-square overflow-hidden rounded-input"><FotoNoticia noticia={noticia} /></Link>
        </article>)}
      </div>
      {visible < noticias.length && <div className="mt-ch-xl flex justify-center"><Button variant="secondary" className="text-base" onClick={() => setVisible(noticias.length)}>Ver más noticias<ArrowRight aria-hidden /></Button></div>}
    </section>
  </main>;
}