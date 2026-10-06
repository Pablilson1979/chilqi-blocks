import { MinusCircle, PlusCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const groups = [
  {
    title: "Información de interés",
    links: ["Tarifas vigentes", "Normativa y regulación", "Preguntas frecuentes"],
  },
  { title: "Conoce Chilquinta", links: ["Información corporativa", "Indicadores", "Noticias", "Trabaja con nosotros"] },
  { title: "Canales digitales & Covid", links: ["Sucursal virtual", "Atención telefónica", "WhatsApp Luz"] },
  { title: "Nuevos clientes", links: ["Solicita un empalme", "Aumento de potencia", "Requisitos y documentos"] },
];

/** Bloque "Conoce más": acordeón de secciones informativas. */
export function ConoceMas() {
  return (
    <section aria-labelledby="conoce-mas" className="bg-surface">
      <div className="ch-container py-ch-3xl">
        <h2 id="conoce-mas" className="text-center text-3xl font-bold text-foreground">
          Conoce más:
        </h2>

        <Accordion type="single" collapsible className="mx-auto mt-ch-2xl max-w-[720px]">
          {groups.map((group) => (
            <AccordionItem key={group.title} value={group.title} className="border-border">
              <AccordionTrigger className="group gap-ch-lg py-ch-lg text-lg font-bold text-foreground hover:no-underline [&>svg]:hidden">
                <span className="flex items-center gap-ch-lg">
                  <PlusCircle className="size-6 shrink-0 text-primary group-data-[state=open]:hidden" aria-hidden />
                  <MinusCircle className="hidden size-6 shrink-0 text-primary group-data-[state=open]:block" aria-hidden />
                  {group.title}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className={group.title === "Conoce Chilquinta" ? "flex flex-col gap-ch-xl py-ch-lg pl-ch-3xl" : "flex flex-col gap-ch-sm pb-ch-base pl-ch-3xl"}>
                  {group.links.map((link) => (
                    <li key={link} className={group.title === "Conoce Chilquinta" ? "flex items-center gap-ch-base before:size-2.5 before:shrink-0 before:rounded-full before:bg-primary" : undefined}>
                      <a
                        href={group.title === "Conoce Chilquinta" ? ({ "Información corporativa": "https://www.chilquinta.cl/informacion-corporativa", "Indicadores": "https://www.chilquinta.cl/indicadores", "Noticias": "https://www.chilquinta.cl/noticias/titulares-noticias", "Trabaja con nosotros": "https://www.chilquinta.cl/trabaja-con-nosotros" }[link] ?? "#") : "#"}
                        className={group.title === "Conoce Chilquinta" ? "text-lg font-bold text-foreground hover:text-primary hover:underline" : "text-base text-foreground/80 hover:text-primary hover:underline"}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default ConoceMas;