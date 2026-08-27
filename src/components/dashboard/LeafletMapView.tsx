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
      // Center map over India (Default coordinates ~ 20.5937, 78.9629)
      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([20.5937, 78.9629], 5);

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

    // Add Hotspot Markers
    hotspots.forEach(h => {
      const color = h.priorityScore >= 85 ? '#EF4444' : h.priorityScore >= 75 ? '#F59E0B' : '#10B981';
      
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 15px ${color};
            display: flex;
            align-items: center;
            justify-content: center;
            color: black;
            font-weight: 900;
            font-size: 11px;
            font-family: sans-serif;
          ">
            ${h.priorityScore.toFixed(0)}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([h.centerLat, h.centerLng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 220px; color: #0F172A; padding: 4px;">
          <div style="font-weight: 800; font-size: 13px; margin-bottom: 4px; color: #1E3A8A;">
            ${h.title}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            📍 ${h.villageOrWard}, ${h.district}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span>Priority Score:</span>
            <strong style="color: ${color}; font-size: 13px;">${h.priorityScore.toFixed(1)} / 100</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span>Affected Pop:</span>
            <strong>${h.totalAffectedPopulation.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px;">
            <span>Est. Cost:</span>
            <strong>₹${h.estimatedCostLakhs} Lakhs</strong>
          </div>
          <div style="background-color: #F1F5F9; padding: 4px 6px; border-radius: 4px; font-size: 10px; color: #334155; margin-bottom: 8px;">
            Matched: ${h.matchedScheme?.schemeName || 'State Infrastructure Fund'}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => onSelectHotspotRef.current(h));
      markersRef.current.push(marker);
    });

    // If a hotspot is selected, pan to it
    if (selectedHotspot) {
      map.setView([selectedHotspot.centerLat, selectedHotspot.centerLng], 8, { animate: true });
    }
  }, [hotspots, selectedHotspot, isDisasterMode]);

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
      <div ref={containerRef} className="w-full h-full" />

      {/* Map Overlay Badge */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white shadow-lg flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-bold">Live DBSCAN Geo-Cluster Map ({hotspots.length} Hotspots)</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-2.5 text-[11px] text-slate-300 shadow-lg space-y-1">
        <div className="font-bold text-white mb-1">Priority Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" /> High Critical (&gt; 85 Score)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" /> High Urgency (75 - 85 Score)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" /> Medium ( &lt; 75 Score)
        </div>
      </div>
    </div>
  );
};
