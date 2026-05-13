"use client";

import { useState, useEffect, useRef } from "react";
import RiderRegistrationModal from "@/app/rider/RiderRegistrationModal";
import {
  RocketLaunchIcon,
  MegaphoneIcon,
  StarIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ConfettiIcon,
  CreditCardIcon,
  WrenchIcon,
} from "@phosphor-icons/react";

type User = {
  id: number;
  name: string;
  email: string;
  user_type: string;
};

type Rider = {
  id: number;
  user_id: number;
  registered_name: string;
  plate_number: string;
  city: string;
  created_at: string;
  updated_at: string;
};

const ANNOUNCEMENTS = [
  {
    icon: <RocketLaunchIcon size={18} weight="duotone" />,
    text: "Bodda Fasta is now available in Tanga and Kilimanjaro regions!",
  },
  {
    icon: <MegaphoneIcon size={18} weight="duotone" />,
    text: "Riders: Don't forget to update your availability status in order to appear in search results.",
  },
  {
    icon: <StarIcon size={18} weight="duotone" />,
    text: "New rating system launched!! Customers can now rate riders after every trip.",
  },
  {
    icon: <ShieldCheckIcon size={18} weight="duotone" />,
    text: "Safety reminder: Always wear your helmet on every trip, no exceptions.",
  },
  {
    icon: <MapPinIcon size={18} weight="duotone" />,
    text: "Live location tracking is now active for all riders on duty.",
  },
  {
    icon: <ConfettiIcon size={18} weight="duotone" />,
    text: "Over 7,000 active riders across Tanzania!!! Thank you for being part of Bodda Fasta!",
  },
  {
    icon: <CreditCardIcon size={18} weight="fill" />,
    text: "New payment methods coming soon :) Stay tuned for mobile money integration.",
  },
  {
    icon: <WrenchIcon size={18} weight="fill" />,
    text: "Platform maintenance scheduled for Sunday 2:00 AM – 4:00 AM EAT.",
  },
];

function AnnouncementBar() {
  const [paused, setPaused] = useState(false);

  const AnnouncementContent = () => (
    <>
      {ANNOUNCEMENTS.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginRight: 25,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              color: "#f5f5f5",
            }}
          >
            {item.icon}
          </span>

          <span>{item.text}</span>
        </div>
      ))}
    </>
  );

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "fixed",
        top: 50,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "#0a0a0a",
        borderBottom: "1px solid #1a1a1a",
        overflow: "hidden",
        paddingBottom: 10,
        display: "flex",
        color: "#9ca3af",
        paddingTop: 30,
        alignItems: "center",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          animation: "ticker 180s linear infinite",
          animationPlayState: paused ? "paused" : "running",
          fontSize: 16,
        }}
      >
        <AnnouncementContent />

        <div
          style={{
            width: 80,
            flexShrink: 0,
          }}
        />

        <AnnouncementContent />
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [rider, setRider] = useState<Rider | null>(null);
  const [openRiderModal, setOpenRiderModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.user) return;
        setUser(data.user);

        if (data.user.user_type === "rider") {
          const riderRes = await fetch(
            `http://127.0.0.1:5000/api/riders/${data.user.id}`,
            { headers: { Authorization: `Bearer ${data.access_token}` } }
          );
          if (riderRes.ok) {
            const riderData = await riderRes.json();
            setRider(riderData);
          }
        }
      });
  }, []);

  const handleDeleteRider = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to stop being a rider? This cannot be undone.")) return;

    setLoadingDelete(true);
    setError(null);

    try {
      const sessionRes = await fetch("/api/session");
      const sessionData = await sessionRes.json();

      const res = await fetch(`http://127.0.0.1:5000/api/riders/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${sessionData.access_token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Failed to remove rider.");
        return;
      }

      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { ...sessionData.user, user_type: "customer" },
          access_token: sessionData.access_token,
        }),
      });

      setUser((u) => u ? { ...u, user_type: "customer" } : u);
      setRider(null);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #2a2a2a",
    background: "#141414",
    color: "#f5f5f5",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  };

  const cardStyle: React.CSSProperties = {
    background: "#111",
    border: "1px solid #222",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#888",
    marginBottom: "4px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <>
      <AnnouncementBar />

      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "132px 20px 60px",   // extra top padding for navbar + announcement bar
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "6px" }}>
          My Profile
        </h1>
        <p style={{ color: "#666", marginBottom: "32px", fontSize: "14px" }}>
          Manage your account and rider status.
        </p>

        {/* Account Info */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
            Account Info
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <p style={labelStyle}>Full Name</p>
              <input style={inputStyle} value={user?.name ?? "—"} readOnly />
            </div>
            <div>
              <p style={labelStyle}>Email</p>
              <input style={inputStyle} value={user?.email ?? "—"} readOnly />
            </div>
            <div>
              <p style={labelStyle}>Account Type</p>
              <input
                style={{
                  ...inputStyle,
                  textTransform: "capitalize",
                  color: user?.user_type === "rider" ? "#68d391" : "#f5f5f5",
                }}
                value={user?.user_type ?? "—"}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Rider Info */}
        {user?.user_type === "rider" && rider ? (
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Rider Details</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setOpenEditModal(true)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    background: "transparent",
                    color: "#f5f5f5",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteRider}
                  disabled={loadingDelete}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#e53e3e",
                    color: "#fff",
                    cursor: loadingDelete ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    opacity: loadingDelete ? 0.6 : 1,
                  }}
                >
                  {loadingDelete ? "Removing..." : "Stop Being a Rider"}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <p style={labelStyle}>Registered Name</p>
                <input style={inputStyle} value={rider.registered_name} readOnly />
              </div>
              <div>
                <p style={labelStyle}>Plate Number</p>
                <input style={inputStyle} value={rider.plate_number} readOnly />
              </div>
              <div>
                <p style={labelStyle}>City</p>
                <input style={inputStyle} value={rider.city} readOnly />
              </div>
              <div>
                <p style={labelStyle}>Member Since</p>
                <input
                  style={inputStyle}
                  value={new Date(rider.created_at).toLocaleDateString()}
                  readOnly
                />
              </div>
            </div>
          </div>
        ) : (
          user?.user_type !== "rider" && (
            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
                Become a Rider
              </h2>
              <p style={{ color: "#888", fontSize: "14px", marginBottom: "16px" }}>
                Register as a rider to start accepting delivery and transport requests.
              </p>
              <button
                onClick={() => setOpenRiderModal(true)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#f5f5f5",
                  color: "#111",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                Register as Rider
              </button>
            </div>
          )
        )}

        {/* Ride History */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
            Ride History
          </h2>
          <p style={{ color: "#555", fontSize: "14px" }}>
            Your past rides will appear here. — Coming soon
          </p>
        </div>

        {/* Modals */}
        <RiderRegistrationModal
          isOpen={openRiderModal}
          onClose={() => setOpenRiderModal(false)}
          onSuccess={() => {
            setOpenRiderModal(false);
            window.location.reload();
          }}
        />

        {openEditModal && rider && (
          <EditRiderModal
            rider={rider}
            onClose={() => setOpenEditModal(false)}
            onSuccess={(updated) => {
              setRider(updated);
              setOpenEditModal(false);
            }}
          />
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────
// Inline Edit Modal
// ─────────────────────────────────────────
function EditRiderModal({
  rider,
  onClose,
  onSuccess,
}: {
  rider: Rider;
  onClose: () => void;
  onSuccess: (updated: Rider) => void;
}) {
  const [form, setForm] = useState({
    registered_name: rider.registered_name,
    plate_number: rider.plate_number,
    city: rider.city,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const sessionRes = await fetch("/api/session");
      const sessionData = await sessionRes.json();

      const res = await fetch(`http://127.0.0.1:5000/api/riders/${rider.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.access_token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Update failed.");
        return;
      }

      onSuccess(data.rider);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", width: "420px", borderRadius: "16px",
          padding: "28px", color: "#111",
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "18px" }}>
          Edit Rider Details
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
          {[
            { label: "Registered Name", name: "registered_name", placeholder: "e.g. Riley Freeman" },
            { label: "Plate Number", name: "plate_number", placeholder: "e.g. MC1235" },
            { label: "City", name: "city", placeholder: "e.g. Dodoma" },
          ].map(({ label, name, placeholder }) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>{label}</label>
              <input
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                placeholder={placeholder}
                style={{
                  padding: "9px 12px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "14px",
                  outline: "none", color: "#111",
                }}
              />
            </div>
          ))}
        </div>

        {error && (
          <p style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 12px", borderRadius: "8px",
              border: "1px solid #ddd", background: "#fff",
              cursor: "pointer", fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "8px 14px", borderRadius: "8px",
              border: "none", background: loading ? "#555" : "#111",
              color: "#fff", cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}