import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { DemandHotspot } from '../../types';

interface LeafletMapViewProps {
  hotspots: DemandHotspot[];
  selectedHotspot: DemandHotspot | null;
  onSelectHotspot: (hotspot: DemandHotspot) => void;
  isDisasterMode: boolean;
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  isDisasterMode
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const onSelectHotspotRef = useRef(onSelectHotspot);
  onSelectHotspotRef.current = onSelectHotspot;

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      // Center map over India (Default coordinates ~ 22.0, 78.9629)
      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([22.5, 78.9], 5);

      // Dark Mode Map Tiles from CartoDB Dark Matter
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a> | JanSetu GeoEngine',
        maxZoom: 18
      }).addTo(map);

      mapRef.current = map;
    }

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const map = mapRef.current;

    // Add Hotspot Markers matching Stitch design tokens
    hotspots.forEach(h => {
      const isCritical = h.priorityScore >= 85;
      const isHigh = h.priorityScore >= 75 && h.priorityScore < 85;
      const color = isCritical ? '#ffb4ab' : isHigh ? '#f4a261' : '#6fd8c8';
      const bgColor = isCritical ? '#93000a' : isHigh ? '#6f3800' : '#003731';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${bgColor};
            border: 2px solid ${color};
            box-shadow: 0 0 12px ${color}88, inset 0 0 4px rgba(255,255,255,0.4);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${color};
            font-weight: 800;
            font-size: 11px;
            font-family: 'Public Sans', sans-serif;
            cursor: pointer;
            transition: transform 0.2s;
          " class="${isCritical ? 'map-marker' : ''}">
            ${h.priorityScore.toFixed(0)}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([h.centerLat, h.centerLng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; min-width: 240px; color: #d7e2ff; padding: 4px;">
          <div style="font-size: 10px; color: ${color}; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; margin-bottom: 2px;">
            ${isCritical ? 'Critical Priority Hotspot' : isHigh ? 'High Demand Sector' : 'Moderate Priority Area'}
          </div>
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #ffffff; font-family: 'Public Sans', sans-serif;">
            ${h.title}
          </div>
          <div style="font-size: 11px; color: #d8c2b5; margin-bottom: 8px;">
            📍 ${h.villageOrWard}, ${h.district}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">
            <span style="color: #d8c2b5;">Priority Score:</span>
            <strong style="color: ${color}; font-size: 13px;">${h.priorityScore.toFixed(1)} / 100</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span style="color: #d8c2b5;">Population Impacted:</span>
            <strong>${h.totalAffectedPopulation.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px;">
            <span style="color: #d8c2b5;">Est. Scheme Cost:</span>
            <strong>₹${h.estimatedCostLakhs} Lakhs</strong>
          </div>
          <div style="background-color: rgba(255,255,255,0.06); padding: 4px 6px; border-radius: 4px; font-size: 10px; color: #6fd8c8;">
            🏛️ ${h.matchedScheme?.schemeName || 'State Infrastructure Fund'}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => onSelectHotspotRef.current(h));
      markersRef.current.push(marker);
    });

    // Pan to selected hotspot
    if (selectedHotspot) {
      map.setView([selectedHotspot.centerLat, selectedHotspot.centerLng], 7, { animate: true });
    }
  }, [hotspots, selectedHotspot, isDisasterMode]);

  return (
    <div className="relative w-full h-[450px] overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {/* Map Overlay Badge */}
      <div className="absolute top-3 left-3 z-[1000] bg-surface-container/90 backdrop-blur border border-white/10 rounded-lg px-3 py-1.5 text-xs text-on-surface shadow-xl flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
        <span className="font-semibold">Live DBSCAN Geo-Cluster Map ({hotspots.length} Nodes)</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-surface-container/90 backdrop-blur border border-white/10 rounded-lg p-2.5 text-[11px] text-on-surface-variant shadow-xl space-y-1">
        <div className="font-bold text-on-surface mb-1">Priority Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-error" /> Critical (&gt; 85)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container" /> High (75 - 85)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Moderate (&lt; 75)
        </div>
      </div>
    </div>
  );
};
