"use client";

import { useState, useEffect } from "react";

interface Ride {
  id: number;
  customer_id: number;
  rider_id: number;
  contact: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  riderId: number;
  onClose: () => void;
}

const statusLabel: Record<number, string> = {
  0: "Pending",
  1: "Accepted",
  2: "In Progress",
  3: "Completed",
  4: "Cancelled",
};

export default function RequestRideModal({ riderId, onClose }: Props) {
  const [rides, setRides]       = useState<Ride[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const fetchRides = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`http://localhost:5000/api/rides/rider/${riderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch rides");
      setRides(data.rides);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRides(); }, [riderId]);

  const handleAccept = async (rideId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/rides/${rideId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 1 }),
      });
      if (!res.ok) throw new Error("Failed to accept ride");
      await fetchRides(); // refresh
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 3000, display: "flex",
        alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        background: "#111", border: "1px solid #222",
        borderRadius: "16px", padding: "28px",
        width: "380px", maxHeight: "80vh",
        display: "flex", flexDirection: "column", gap: "16px",
        overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#f5f5f5" }}>
            Ride Requests
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={fetchRides}
              style={{ background: "none", border: "none", color: "#888", fontSize: "18px", cursor: "pointer" }}
              title="Refresh"
            >
              ↺
            </button>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", color: "#888", fontSize: "20px", cursor: "pointer" }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ textAlign: "center", color: "#888", fontSize: "14px", padding: "24px 0" }}>
            Loading requests...
          </p>
        )}

        {/* Error */}
        {error && (
          <p style={{ textAlign: "center", color: "#ef4444", fontSize: "13px" }}>{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && rides.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: "36px" }}>🏍️</span>
            <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>No ride requests right now.</p>
          </div>
        )}

        {/* Ride cards */}
        {!loading && rides.map((ride) => (
          <div key={ride.id} style={{
            background: "#1a1a1a", border: "1px solid #2a2a2a",
            borderRadius: "12px", padding: "14px 16px",
            display: "flex", flexDirection: "column", gap: "10px",
          }}>

            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "#888" }}>Ride #{ride.id}</span>
              <span style={{
                fontSize: "11px", fontWeight: 600,
                padding: "3px 10px", borderRadius: "20px",
                background: ride.status === 0 ? "rgba(234,179,8,0.1)"  : "rgba(34,197,94,0.1)",
                color:      ride.status === 0 ? "#eab308"               : "#22c55e",
                border:     `1px solid ${ride.status === 0 ? "rgba(234,179,8,0.2)" : "rgba(34,197,94,0.2)"}`,
              }}>
                {statusLabel[ride.status]}
              </span>
            </div>

            {/* Info rows */}
            {[
              { icon: "👤", label: "Customer ID", value: `#${ride.customer_id}` },
            { icon: "📞", label: "Contacts", value: ride.contact },
              { icon: "🕐", label: "Requested",   value: new Date(ride.created_at).toLocaleTimeString() },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "16px" }}>{icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: "11px", color: "#666" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#f5f5f5", fontWeight: 500 }}>{value}</p>
                </div>
              </div>
            ))}

            {/* Accept button — only for pending */}
            {ride.status === 0 && (
              <button
                onClick={() => handleAccept(ride.id)}
                style={{
                  background: "#fff", color: "#111",
                  border: "none", borderRadius: "8px",
                  padding: "10px", fontWeight: 700,
                  fontSize: "13px", cursor: "pointer",
                  marginTop: "4px",
                }}
              >
                Accept Ride
              </button>
            )}

            {ride.status === 1 && (
              <p style={{ margin: 0, fontSize: "12px", color: "#22c55e", textAlign: "center" }}>
                ✓ You accepted this ride
              </p>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}