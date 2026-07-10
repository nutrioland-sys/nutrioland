"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoPin } from "@/lib/types";
import { CrosshairIcon } from "./icons";

// Default map center: Islamabad, Pakistan.
const DEFAULT_CENTER: GeoPin = { lat: 33.6844, lng: 73.0479 };

const pinIcon = L.divIcon({
  html: '<svg viewBox="0 0 24 24" width="32" height="32" fill="#1F7A3D" stroke="white" stroke-width="1"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.6" fill="white"/></svg>',
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function ClickHandler({ onSelect }: { onSelect: (pin: GeoPin) => void }) {
  useMapEvents({
    click(event) {
      onSelect({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

function RecenterOnChange({ pin }: { pin?: GeoPin }) {
  const map = useMap();
  useEffect(() => {
    if (pin) {
      map.setView([pin.lat, pin.lng], Math.max(map.getZoom(), 15));
    }
  }, [pin, map]);
  return null;
}

export default function LocationPicker({
  value,
  onChange,
}: {
  value?: GeoPin;
  onChange: (pin: GeoPin) => void;
}) {
  const center = value ?? DEFAULT_CENTER;
  const [isLocating, setIsLocating] = useState(false);

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden rounded-xl border border-slate-200">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={value ? 15 : 12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={onChange} />
          <RecenterOnChange pin={value} />
          {value && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const position = event.target.getLatLng();
                  onChange({ lat: position.lat, lng: position.lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          {value
            ? `Pinned: ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`
            : "Tap the map to drop a pin, or use your current location."}
        </p>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand/30 px-3 py-1.5 text-xs font-semibold text-brand-dark transition hover:bg-brand-50 disabled:opacity-60"
        >
          <CrosshairIcon className="h-3.5 w-3.5" />
          {isLocating ? "Locating…" : "Use my location"}
        </button>
      </div>
    </div>
  );
}
