"use client";

import dynamic from "next/dynamic";

const ROLLOUT_CITIES = [
  "Dodoma",
  "Dar es Salaam",
  "Mwanza",
  "Arusha",
  "Mbeya",
  "Tanga",
  "Kilimanjaro",
];

const RolloutMap = dynamic(() => import("@/app/components/RolloutMap"), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#333",
      fontSize: 14,
    }}>
      Loading map...
    </div>
  ),
});

export default function SettingsPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#f5f5f5",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      padding: "100px 24px 80px",
    }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Header */}
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#444",
          marginBottom: 12,
        }}>
          Availability · Rollout
        </p>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#fff",
          margin: "0 0 10px",
        }}>
          Where are we?
        </h1>
        <p style={{
          fontSize: 15,
          color: "#555",
          lineHeight: 1.7,
          maxWidth: 520,
          marginBottom: 36,
        }}>
          Bodda Fasta is currently live in {ROLLOUT_CITIES.length} cities across Tanzania.
          More regions are coming soon.
        </p>

        {/* City pills */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 36,
        }}>
          {ROLLOUT_CITIES.map((city) => (
            <div key={city} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 16px",
              borderRadius: 20,
              background: "#0d0d0d",
              border: "1px solid #1f1f1f",
              fontSize: 13,
              color: "#fff",
              fontWeight: 500,
            }}>
              <div style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 6px rgba(34,197,94,0.6)",
              }} />
              {city}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex",
          gap: 32,
          marginBottom: 36,
        }}>
          {[
            { value: `${ROLLOUT_CITIES.length}`, label: "Cities Live" },
            { value: "2026", label: "Expansion Year" },
            { value: "TZ", label: "Country" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}>
                {s.value}
              </p>
              <p style={{
                margin: "3px 0 0",
                fontSize: 12,
                color: "#444",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div style={{
          height: 520,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #1a1a1a",
        }}>
          <RolloutMap />
        </div>

        {/* Footer */}
        <p style={{
          marginTop: 24,
          fontSize: 13,
          color: "#333",
          lineHeight: 1.7,
        }}>
          Expansion to additional regions is planned for late 2026.
          Interested in bringing Bodda Fasta to your city? Contact us.
        </p>

      </div>
    </div>
  );
}