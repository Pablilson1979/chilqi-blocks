import { PlusCircle } from "lucide-react";

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
  { title: "Conoce chilquinta", links: ["Quiénes somos", "Nuestra zona de concesión", "Trabaja con nosotros"] },
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
              <AccordionTrigger className="gap-ch-lg py-ch-lg text-lg font-bold text-foreground hover:no-underline [&>svg]:hidden">
                <span className="flex items-center gap-ch-lg">
                  <PlusCircle className="size-6 shrink-0 text-primary" aria-hidden />
                  {group.title}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-ch-sm pb-ch-base pl-ch-3xl">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-base text-foreground/80 hover:text-primary hover:underline"
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