"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function RiderRegistrationModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    registered_name: "",
    plate_number: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      // Get session to retrieve user_id and access_token
      const sessionRes = await fetch("/api/session");
      const sessionData = await sessionRes.json();

      if (!sessionData.user) {
        setError("You must be logged in to register as a rider.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/api/riders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.access_token}`,
        },
        body: JSON.stringify({
          user_id: sessionData.user.id,
          registered_name: form.registered_name,
          plate_number: form.plate_number,
          city: form.city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Registration failed.");
        setLoading(false);
        return;
      }

      // Update session user_type to "rider"
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { ...sessionData.user, user_type: data.user_type },
          access_token: sessionData.access_token,
        }),
      });

      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "420px",
          borderRadius: "16px",
          padding: "28px",
          color: "#111",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 500,
          fontSize: "14.5px",
          lineHeight: "1.6",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
          Rider Registration
        </h2>
        <p style={{ color: "#444", marginBottom: "18px" }}>
          Fill in your details to register as a rider.
        </p>

        {success ? (
          <div
            style={{
              background: "#f0fff4",
              border: "1px solid #68d391",
              borderRadius: "10px",
              padding: "16px",
              textAlign: "center",
              color: "#276749",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            🎉 Successfully registered as a rider!
          </div>
        ) : (
          <>
            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
              {[
                { label: "Full Name", name: "registered_name", placeholder: "e.g. Riley Freeman" },
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
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "14px",
                      outline: "none",
                      color: "#111",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <p style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
            )}
          </>
        )}

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {success ? "Close" : "Cancel"}
          </button>

          {!success && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                background: loading ? "#555" : "#111",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}