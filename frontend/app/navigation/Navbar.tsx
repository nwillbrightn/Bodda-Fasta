"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import OAuthButton from "@/app/oauth/OAuthButton";
import RequestRideModal from "@/app/components/RequestRideModal";

export default function Navbar() {
  const [user, setUser]                   = useState<any>(null);
  const [showAuth, setShowAuth]           = useState(false);
  const [showRideModal, setShowRideModal] = useState(false);
  const authRef    = useRef<HTMLDivElement>(null);
  const socketRef  = useRef<Socket | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  useEffect(() => {
    if (user?.user_type === "rider" && user?.rider_id) {
      startLocationTracking(user.rider_id);
    } else {
      stopLocationTracking();
    }

    return () => stopLocationTracking();
  }, [user]);

  const startLocationTracking = (riderId: number) => {
    console.log("🚀 Starting location tracking for rider_id:", riderId);

    const socket = io("http://127.0.0.1:5000", {
      transports: ["polling", "websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected, id:", socket.id);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log("📍 Initial GPS:", lat, lng);
          socket.emit("rider_location_update", { rider_id: riderId, lat, lng });
          console.log("📡 Emitted initial location");
        },
        (err) => console.error("❌ Initial GPS error:", err),
        { enableHighAccuracy: true }
      );
    });

    socket.on("location_updated", (data) => {
      console.log("✅ Backend confirmed location update:", data);
    });

    socket.on("error", (data) => {
      console.error("❌ Socket error:", data);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("📍 GPS update:", lat, lng, "| Socket connected:", socket.connected);

        if (socket.connected) {
          socket.emit("rider_location_update", { rider_id: riderId, lat, lng });
          console.log("📡 Emitted location update:", { rider_id: riderId, lat, lng });
        } else {
          console.warn("⚠️ Socket not connected, skipping emit");
        }
      },
      (err) => console.error("❌ GPS watch error:", err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log("🛑 GPS watch cleared");
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("🛑 Socket disconnected");
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(e.target as Node)) {
        setShowAuth(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    stopLocationTracking();
    await fetch("/api/session", { method: "DELETE" });
    setUser(null);
  };

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!user) {
      e.preventDefault();
      setShowAuth(true);
    }
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: "14px 20px",
          display: "flex",
          gap: "14px",
          alignItems: "center",
          background: "#0b0b0b",
          borderBottom: "1px solid #222",
          color: "#f5f5f5",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        <Link href="/" style={{ color: "#f5f5f5", textDecoration: "none" }}>Home</Link>

        <Link
          href="/profile"
          onClick={(e) => handleProtectedClick(e, "/profile")}
          style={{ color: "#f5f5f5", textDecoration: "none" }}
        >
          Profile
        </Link>

        <Link
          href="/rollout"
          onClick={(e) => handleProtectedClick(e, "/settings")}
          style={{ color: "#f5f5f5", textDecoration: "none" }}
        >
          Rollout
        </Link>

        <Link
          href="/regulations"
          style={{ color: "#f5f5f5", textDecoration: "none" }}
        >
          Rules & Regulations
        </Link>

        {/* unchanged */}
        <Link
          href="/rider/find"
          onClick={(e) => handleProtectedClick(e, "/rider/find")}
          style={{
            color: "#111", background: "#fff",
            padding: "6px 10px", borderRadius: "8px",
            textDecoration: "none", fontWeight: 600,
          }}
        >
          Find Rider
        </Link>

        {/* 👇 only for riders — shows their incoming ride requests */}
        {user?.user_type === "rider" && (
          <button
            onClick={() => setShowRideModal(true)}
            style={{
              color: "#fff",
              background: "transparent",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid #444",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Ride Requests
          </button>
        )}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {!user ? (
            <OAuthButton onSuccess={(u) => { setUser(u); setShowAuth(false); }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

              {user.user_type === "rider" && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: "11px",
                  color: "#22c55e",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 20,
                  padding: "3px 10px",
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    animation: "pulse 1.5s infinite",
                  }} />
                  Live
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{user.name}</span>
                <span style={{ fontSize: "11px", color: "#aaa", textTransform: "capitalize" }}>
                  {user.user_type}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  color: "#fff",
                  borderWidth: 0.5,
                  borderStyle: "solid",
                  borderColor: "#ccc",
                  background: "transparent",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginRight: 10,
                  marginLeft: 10,
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      {/* Auth modal — unchanged */}
      {showAuth && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            ref={authRef}
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "16px",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              minWidth: "300px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#f5f5f5", margin: 0 }}>
              Sign in to continue
            </h2>
            <p style={{ fontSize: "13px", color: "#888", margin: 0, textAlign: "center" }}>
              You need to be logged in to access this page.
            </p>
            <OAuthButton
              onSuccess={(u) => {
                setUser(u);
                setShowAuth(false);
              }}
            />
            <button
              onClick={() => setShowAuth(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#666",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Ride requests modal — riders only */}
      {showRideModal && user?.rider_id && (
        <RequestRideModal
          riderId={user.rider_id}
          onClose={() => setShowRideModal(false)}
        />
      )}
    </>
  );
}