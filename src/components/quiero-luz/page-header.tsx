import { Link } from "@tanstack/react-router";
import { ChevronLeft, Lightbulb } from "lucide-react";

/** Encabezado propio de la plataforma Quiero Luz. */
export function QuieroLuzHeader() {
  return (
    <div className="ch-container relative flex items-center justify-center py-6 lg:py-8">
      <Link
        to="/"
        className="ch-touch absolute left-0 inline-flex items-center gap-1 rounded-input text-base font-semibold text-primary hover:text-primary-hover"
      >
        <ChevronLeft className="size-5" aria-hidden />
        Volver
      </Link>
      <h1 className="flex items-center gap-3 text-center text-2xl font-bold text-foreground lg:text-4xl">
        <Lightbulb className="size-8 text-primary lg:size-10" aria-hidden />
        Quiero luz en mi propiedad
      </h1>
    </div>
  );
}
