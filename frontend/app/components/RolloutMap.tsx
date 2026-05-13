"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const cities = [
  { name: "Dodoma", lat: -6.1722, lng: 35.7395, riders: 620, status: "Live" },
  { name: "Dar es Salaam", lat: -6.7924, lng: 39.2083, riders: 1840, status: "Live" },
  { name: "Mwanza", lat: -2.5164, lng: 32.9175, riders: 910, status: "Live" },
  { name: "Arusha", lat: -3.3869, lng: 36.6830, riders: 1120, status: "Live" },
  { name: "Mbeya", lat: -8.9094, lng: 33.4608, riders: 530, status: "Live" },
  { name: "Tanga", lat: -5.0693, lng: 39.1003, riders: 480, status: "Live" },
  { name: "Kilimanjaro", lat: -3.3548, lng: 37.3436, riders: 740, status: "Live" },
];

const TANZANIA_BOUNDS = L.latLngBounds(
  L.latLng(-11.8, 29.3),
  L.latLng(-0.9, 40.5)
);

const INITIAL_CENTER: [number, number] = [-6.3690, 34.8888];
const INITIAL_ZOOM = 6;

function ResetButton() {
  const map = useMap();
  return (
    <div style={{ position: "absolute", bottom: 24, right: 12, zIndex: 1000 }}>
      <button
        onClick={() => map.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { animate: true, duration: 0.8 })}
        title="Reset view"
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: "1px solid #2a2a2a",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        ⊙
      </button>
    </div>
  );
}

export default function RolloutMap() {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const greenDot = L.divIcon({
    className: "",
    html: `<div style="
      width: 14px;
      height: 14px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(34,197,94,0.7);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        minZoom={INITIAL_ZOOM}
        maxZoom={INITIAL_ZOOM}
        maxBounds={TANZANIA_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        dragging={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {cities.map((city) => (
          <Marker key={city.name} position={[city.lat, city.lng]} icon={greenDot}>
            <Popup
              closeButton={false}
              className="dark-popup"
            >
              <div style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                background: "#0d0d0d",
                border: "1px solid #1f1f1f",
                borderRadius: 10,
                padding: "12px 16px",
                minWidth: 160,
                color: "#fff",
              }}>
                {/* City name */}
                <div style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#fff",
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}>
                  {city.name}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#1f1f1f", marginBottom: 10 }} />

                {/* Riders count */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#555" }}>Active Riders</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    {city.riders.toLocaleString()}
                  </span>
                </div>

                {/* Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#555" }}>Status</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#22c55e",
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e" }}>
                      {city.status}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <ResetButton />
      </MapContainer>

      {/* Override leaflet popup default styles */}
      <style>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .dark-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .dark-popup .leaflet-popup-tip-container {
          display: none !important;
        }
      `}</style>
    </div>
  );
}