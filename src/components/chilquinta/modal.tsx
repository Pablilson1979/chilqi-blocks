import * as React from "react";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogPortal, DialogOverlay, DialogTrigger } from "@/components/ui/dialog";

/**
 * Chilquinta DS 4.0 — Modal canónico ("Información de suministro").
 *
 * Especificación del manual:
 * - Contenedor 600px máx, radio 12px, borde sutil y sombra suave.
 * - Cierre: cuadrado 29px, radio 8px, fondo `muted`, icono `foreground`.
 * - Cuerpo dentro de un panel `bg-muted` con radio 8px (pausa visual).
 * - Acciones abajo a la derecha: secundaria (outline rojo) + primaria (rojo sólido).
 */

export interface ChilquintaModalProps {
  title: string;
  children: React.ReactNode;
  /** Texto de la acción secundaria (izquierda). */
  cancelLabel?: string;
  /** Texto de la acción principal (derecha). */
  confirmLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  className?: string;
}

export function ChilquintaModal({
  title,
  children,
  cancelLabel = "Volver",
  confirmLabel = "Continuar",
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  trigger,
  className,
}: ChilquintaModalProps) {
  return (
    <Dialog {...(open !== undefined ? { open } : {})} {...(onOpenChange ? { onOpenChange } : {})}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[600px] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-card border border-border bg-card p-6 shadow-modal duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <DialogPrimitive.Title className="text-xl font-bold text-foreground">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Cerrar"
              className="flex size-8 shrink-0 items-center justify-center rounded-input bg-muted text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              <X className="size-4" aria-hidden />
            </DialogPrimitive.Close>
          </div>

          <DialogPrimitive.Description asChild>
            <div className="rounded-input bg-muted p-6 text-sm leading-relaxed text-foreground">
              {children}
            </div>
          </DialogPrimitive.Description>

          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
            <DialogPrimitive.Close asChild>
              <Button variant="secondary" className="sm:min-w-[137px]" onClick={onCancel}>
                {cancelLabel}
              </Button>
            </DialogPrimitive.Close>
            <Button variant="primary" className="sm:min-w-[137px]" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
