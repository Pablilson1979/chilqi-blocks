import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import type { Interrupcion, Reposicion } from "@/lib/interrupciones-data";
import { estadoETR } from "@/lib/interrupciones-data";

// Fix default icon paths cuando bundlean
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function colorPorEstado(i: Interrupcion): string {
  const est = estadoETR(i);
  if (est === "investigacion" || est === "vencida") return "var(--status-expired)";
  if (i.tipo === "programado") return "var(--desconexiones)";
  return "var(--status-active)";
}

interface Props {
  items: Interrupcion[];
  seleccionada?: string | null;
  onSelect?: (nr_orden: string) => void;
  height?: number | string;
  focus?: Interrupcion | null; // centrar y pintar polígono
  cluster?: boolean;
  repuestos?: Reposicion[];
}


export default function MapaCortes({
  items,
  seleccionada,
  onSelect,
  height = 480,
  focus,
  cluster = true,
  repuestos,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const polyRef = useRef<L.Polygon | null>(null);
  const markersById = useRef<Map<string, L.CircleMarker>>(new Map());
  // Marca cada círculo del mapa con su tipo, para pintar los clusters de desconexiones en azul
  const tipoPorMarcador = useRef<Map<L.CircleMarker, string>>(new Map());
  const hintTimer = useRef<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const isTouch =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-33.02, -71.55],
      zoom: 11,
      zoomControl: true,
      // Desktop: zoom sólo con Ctrl/⌘ + rueda. Mobile: pinch (touchZoom) sigue activo.
      scrollWheelZoom: false,
      touchZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    // Handler personalizado de rueda: zoom sólo con modificador; si no, muestra hint.
    const onWheel = (ev: WheelEvent) => {
      if (isTouch) return;
      if (ev.ctrlKey || ev.metaKey) {
        ev.preventDefault();
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const point = L.point(ev.clientX - rect.left, ev.clientY - rect.top);
        const latlng = map.containerPointToLatLng(point);
        const delta = ev.deltaY < 0 ? 1 : -1;
        map.setZoomAround(latlng, map.getZoom() + delta);
        setShowHint(false);
        return;
      }
      // scroll normal: no bloqueamos la página, sólo avisamos.
      setShowHint(true);
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
      hintTimer.current = window.setTimeout(() => setShowHint(false), 1200);
    };

    const el = containerRef.current;
    el.addEventListener("wheel", onWheel, { passive: false });

    mapRef.current = map;
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
      map.remove();
      mapRef.current = null;
    };
  }, [isTouch]);

  // Pintar puntos
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    markersById.current.clear();
    tipoPorMarcador.current.clear();

    const iconCreateFunction = (cluster: {
      getChildCount: () => number;
      getAllChildMarkers: () => L.CircleMarker[];
    }) => {
      const n = cluster.getChildCount();
      const sizeClass =
        n < 10 ? "marker-cluster-small" : n < 100 ? "marker-cluster-medium" : "marker-cluster-large";
      const size = n < 10 ? 40 : n < 100 ? 50 : 60;
      const markers = cluster.getAllChildMarkers() ?? [];
      const allProgramado =
        markers.length > 0 &&
        markers.every((m) => tipoPorMarcador.current.get(m) === "programado");
      return L.divIcon({
        html: `<div class="marker-cluster ${sizeClass}${allProgramado ? " desconexiones" : ""}"><span>${n}</span></div>`,
        className: "marker-cluster-icon",
        iconSize: [size, size],
      });
    };

    const group = cluster
      ? (L as unknown as {
          markerClusterGroup: (o?: unknown) => L.LayerGroup;
        }).markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 45,
          iconCreateFunction,
        })
      : L.layerGroup();

    items.forEach((it) => {
      const color = colorPorEstado(it);
      const marker = L.circleMarker([it.lat, it.lng], {
        radius: 10,
        color: "var(--surface)",
        weight: 2,
        fillColor: color,
        fillOpacity: 0.95,
      });
      tipoPorMarcador.current.set(marker, it.tipo);
      marker.bindTooltip(
        `<strong>${it.sector}</strong><br/>${it.comuna} · ${it.cant_clientes} clientes`,
        { direction: "top", offset: [0, -6] },
      );
      marker.on("click", () => onSelect?.(it.nr_orden));
      markersById.current.set(it.nr_orden, marker);
      group.addLayer(marker);
    });

    map.addLayer(group);
    layerRef.current = group;

    // Ajustar vista para mostrar todos los cortes cuando no hay uno enfocado
    if (!focus && items.length > 0) {
      const bounds = L.latLngBounds(items.map((i) => [i.lat, i.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    }
  }, [items, cluster, onSelect, focus]);

  // Resaltar seleccionada
  useEffect(() => {
    markersById.current.forEach((m, id) => {
      m.setStyle({ radius: id === seleccionada ? 14 : 10, weight: id === seleccionada ? 3 : 2 });
    });
  }, [seleccionada]);

  // Focus + polígono
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (polyRef.current) {
      map.removeLayer(polyRef.current);
      polyRef.current = null;
    }
    if (focus) {
      const color = colorPorEstado(focus);
      const poly = L.polygon(focus.poligono, {
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.18,
      }).addTo(map);
      polyRef.current = poly;
      map.fitBounds(poly.getBounds(), { padding: [30, 30], maxZoom: 15 });
    }
  }, [focus]);

  // Capa de servicios repuestos (últimas 24h)
  const repuestosLayerRef = useRef<L.LayerGroup | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (repuestosLayerRef.current) {
      map.removeLayer(repuestosLayerRef.current);
      repuestosLayerRef.current = null;
    }
    if (!repuestos || repuestos.length === 0) return;
    const group = L.layerGroup();
    repuestos.forEach((r) => {
      // Ícono verde con check para diferenciar (no depender solo del color)
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:24px;height:24px;border-radius:50%;
          background:var(--status-ok);border:2px solid var(--surface);
          box-shadow:0 1px 4px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
          color:var(--success-foreground);font-weight:900;font-size:14px;line-height:1;
          opacity:0.85;
        ">✓</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker([r.lat, r.lng], { icon, opacity: 1, zIndexOffset: -100 });
      const hace = Math.round((Date.now() - new Date(r.repuesto_at).getTime()) / 60000);
      const haceStr =
        hace < 60 ? `hace ${hace} min` : `hace ${Math.round(hace / 60)} h`;
      marker.bindTooltip(
        `<strong>✓ ${r.sector}</strong><br/>${r.comuna} · repuesto ${haceStr}<br/>${r.cant_clientes} clientes recuperados`,
        { direction: "top", offset: [0, -6] },
      );
      group.addLayer(marker);
    });
    map.addLayer(group);
    repuestosLayerRef.current = group;
  }, [repuestos]);



  return (
    <div
      ref={wrapperRef}
      style={{ height, width: "100%", position: "relative" }}
      className="overflow-hidden rounded-card border border-border bg-muted"
    >
      <div
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
        aria-label="Mapa de cortes de suministro"
      />
      {/* Overlay reactivo: aparece si el usuario intenta hacer zoom con rueda sin modificador */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
           background: "color-mix(in oklab, var(--foreground) 70%, transparent)",
           color: "var(--surface)",
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: 0.2,
          textAlign: "center",
          padding: 24,
          pointerEvents: "none",
          opacity: showHint ? 1 : 0,
          transition: "opacity 180ms ease",
          zIndex: 500,
        }}
      >
        Mantén <kbd style={kbdStyle}>{isMac ? "⌘" : "Ctrl"}</kbd> y usa la rueda para hacer zoom
      </div>
      {/* Hint permanente sutil (sólo desktop) */}
      {!isTouch && (
        <div
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
             background: "color-mix(in oklab, var(--surface) 90%, transparent)",
             color: "var(--foreground)",
            fontSize: 11,
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: 6,
            pointerEvents: "none",
            zIndex: 500,
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          {isMac ? "⌘" : "Ctrl"} + scroll para zoom · o usa + / −
        </div>
      )}
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  margin: "0 6px",
  padding: "2px 8px",
  borderRadius: 6,
  background: "rgba(255,255,255,0.2)",
  border: "1px solid rgba(255,255,255,0.4)",
  fontFamily: "inherit",
  fontWeight: 700,
};
