"use client";

import { useEffect, useState } from "react";

const images = [
  "/assets/images/photo-01.jfif",
  "/assets/images/photo-02.jfif",
  "/assets/images/photo-03.jfif",
  "/assets/images/photo-04.jfif",
  "/assets/images/photo-05.jfif",
];

const features = [
  { icon: "→", title: "Fast matching", desc: "Get paired with a nearby rider in under 60 seconds." },
  { icon: "✓", title: "Verified riders", desc: "Every rider is background-checked and licensed." },
  { icon: "◎", title: "Live tracking", desc: "Follow your ride in real time from pickup to drop-off." },
  { icon: "♡", title: "Rated & reviewed", desc: "Community ratings keep quality consistently high." },
  { icon: "⊕", title: "Easy payments", desc: "Pay by mobile money, card, or cash — your choice." },
];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState<boolean[]>(features.map(() => false));

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    features.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 300 + i * 400);
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#f5f5f5",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px",
          paddingTop: "100px",
          position: "relative",
          overflow: "hidden",
          gap: "40px",
        }}
      >
        {/* LEFT FADED BACKGROUND */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "55%",
            height: "100%",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              style={{
                position: "absolute",
                inset: 0,
                opacity: i === index ? 0.6 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            >
              <img
                src={src}
                alt={`bg-${i}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scale(1.05)",
                  filter: "brightness(0.9)",
                }}
              />
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(11,11,11,0.85), rgba(11,11,11,0.2), transparent)",
            }}
          />
        </div>

        {/* TEXT CONTENT */}
        <div style={{ maxWidth: 520, zIndex: 2 }}>
          <h1 style={{ fontSize: 42, fontWeight: 800 }}>Skip the wait!</h1>
          <p style={{ marginTop: 12, opacity: 0.7, fontSize: 16, lineHeight: 1.6 }}>
            A modern rider platform built for fast, reliable transport across the city.
          </p>
        </div>

        {/* RIGHT PANEL — free floating animated feature list */}
        <div
          style={{
            zIndex: 2,
            width: "320px",
            flexShrink: 0,
            padding: "24px",
            marginRight:'10%',
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "20px",
            }}
          >
            Why choose us
          </p>

          {features.map((f, i) => (
            <div
              key={f.title}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                marginBottom: "18px",
                opacity: visible[i] ? 1 : 0,
                transform: visible[i] ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#f5f5f5" }}>
                  {f.title}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888", lineHeight: 1.5 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}