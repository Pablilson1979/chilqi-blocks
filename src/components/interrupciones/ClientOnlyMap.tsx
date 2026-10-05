import { lazy, Suspense, useEffect, useState } from "react";
import type { ComponentProps } from "react";

const MapaCortes = lazy(() => import("./MapaCortes"));

export default function ClientOnlyMap(props: ComponentProps<typeof MapaCortes>) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!hydrated) {
    return (
      <div
        style={{ height: props.height ?? 480, borderRadius: 15 }}
        className="w-full animate-pulse border border-border bg-muted"
        aria-hidden
      />
    );
  }
  return (
    <Suspense
      fallback={
        <div
          style={{ height: props.height ?? 480, borderRadius: 15 }}
          className="w-full animate-pulse border border-border bg-muted"
        />
      }
    >
      <MapaCortes {...props} />
    </Suspense>
  );
}
