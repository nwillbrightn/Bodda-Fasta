"use client";

import { useState } from "react";
import axios from "axios";
import {
  MagnifyingGlass,
  Motorcycle,
  Phone,
  Star,
  CheckCircle,
  X,
  MapPin,
  UserCircle,
  NavigationArrow,
} from "@phosphor-icons/react";

interface Rider {
  id: number;
  name: string;
  plate_number: string;
  phone: string;
  avg_rating: number;
  total_ratings: number;
  distance_m: number;
  distance_label: string;
  user_id: number;
}

export default function FindRiderPage() {
  const [loading, setLoading]             = useState(false);
  const [matched, setMatched]             = useState(false);
  const [riders, setRiders]               = useState<Rider[]>([]);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [error, setError]                 = useState<string | null>(null);
  const [requesting, setRequesting]       = useState(false);
  const [rideCreated, setRideCreated]     = useState(false);

  // 👇 phone state
  const [phone, setPhone]       = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (val: string) => {
    if (val.length !== 9)        return "Enter exactly 9 digits after +255";
    if (!/^\d{9}$/.test(val))    return "Digits only — no spaces or dashes";
    return "";
  };

  const findRider = async () => {
    // enforce phone before searching
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    setPhoneError("");

    setLoading(true);
    setMatched(false);
    setError(null);
    setRiders([]);
    setSelectedRider(null);
    setRideCreated(false);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const res = await axios.post("http://127.0.0.1:5000/api/rides/request", {
        pickup_lat: position.coords.latitude,
        pickup_lng: position.coords.longitude,
      });

      setRiders(res.data.riders);
      setMatched(true);
    } catch (err: any) {
      console.error(err);
      setError("Failed to find riders. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRider = async (rider: Rider) => {
    setSelectedRider(rider);
    setRequesting(true);
    setError(null);

    try {
      const sessionRes  = await fetch("/api/session");
      const sessionData = await sessionRes.json();
      const customerId  = sessionData?.user?.id;

      if (!customerId) throw new Error("You must be logged in to request a ride.");

      const res = await fetch("http://127.0.0.1:5000/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rider_id:    rider.id,
          customer_id: customerId,
          status:      0,
          contact:     `+255${phone}`,   // 👈 full number
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create ride");

      setRideCreated(true);
    } catch (err: any) {
      setError(err.message);
      setSelectedRider(null);
    } finally {
      setRequesting(false);
    }
  };

  const handleReset = () => {
    setMatched(false);
    setRiders([]);
    setSelectedRider(null);
    setRideCreated(false);
    setError(null);
    setPhone("");
    setPhoneError("");
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={13}
        weight={i < Math.round(rating) ? "fill" : "regular"}
        color={i < Math.round(rating) ? "#f5a623" : "#444"}
      />
    ));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#fff",
      padding: "32px 20px",
      paddingTop: "100px",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "#1a1a1a", borderRadius: "50%",
            width: 56, height: 56, marginBottom: 14, border: "1px solid #2a2a2a",
          }}>
            <Motorcycle size={28} color="#fff" weight="duotone" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>Find a Rider</h1>
          <p style={{ color: "#666", marginTop: 8, fontSize: 14 }}>Request a nearby boda boda instantly</p>
        </div>

        {/* Phone input + Find button */}
        {!loading && !matched && !rideCreated && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Phone field */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "#888" }}>Your phone number</label>
              <div style={{
                display: "flex", alignItems: "center",
                border: `1px solid ${phoneError ? "#ef4444" : "#2a2a2a"}`,
                borderRadius: 10, overflow: "hidden",
                background: "#0d0d0d",
              }}>
                {/* prefix */}
                <div style={{
                  padding: "12px 14px",
                  borderRight: "1px solid #2a2a2a",
                  color: "#aaa", fontSize: 14, fontWeight: 600,
                  whiteSpace: "nowrap",
                }}>
                  +255
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="7XXXXXXXX"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setPhone(val);
                    if (phoneError) setPhoneError(validatePhone(val));
                  }}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    fontSize: 15,
                    padding: "12px 14px",
                    letterSpacing: 1,
                  }}
                />
                {phone.length === 9 && (
                  <div style={{ paddingRight: 14, color: "#22c55e" }}>
                    <Phone size={16} weight="fill" />
                  </div>
                )}
              </div>
              {phoneError && (
                <p style={{ margin: 0, fontSize: 12, color: "#ef4444" }}>{phoneError}</p>
              )}
              {phone.length === 9 && !phoneError && (
                <p style={{ margin: 0, fontSize: 12, color: "#22c55e" }}>
                  +255{phone}
                </p>
              )}
            </div>

            {/* Find button */}
            <button
              onClick={findRider}
              style={{
                width: "100%", padding: "15px", borderRadius: 12,
                border: "1px solid #2a2a2a", background: "#fff",
                color: "#000", cursor: "pointer", fontWeight: 700,
                fontSize: 15, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <MapPin size={20} weight="fill" />
              Find Nearby Rider
            </button>
          </div>
        )}

        {/* Loading — finding riders */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <MagnifyingGlass size={40} color="#fff" />
            <p style={{ fontSize: 15, color: "#aaa" }}>Finding nearest riders...</p>
          </div>
        )}

        {/* Loading — creating ride */}
        {requesting && (
          <div style={{ textAlign: "center", marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Motorcycle size={40} color="#fff" weight="duotone" />
            <p style={{ fontSize: 15, color: "#aaa" }}>Sending ride request...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 20, padding: "12px 16px", borderRadius: 10,
            background: "#1a0000", border: "1px solid #3a0000",
            color: "#ff4444", textAlign: "center", fontSize: 14,
          }}>
            {error}
          </div>
        )}

        {/* Rider List */}
        {matched && !selectedRider && !requesting && riders.length > 0 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>Nearby Riders</h2>
              <p style={{ color: "#555", fontSize: 13, marginTop: 4 }}>{riders.length} riders found · tap to select</p>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {riders.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleSelectRider(r)}
                  style={{
                    flex: "1 1 190px", border: "1px solid #1f1f1f",
                    borderRadius: 16, padding: "22px 16px",
                    cursor: "pointer", background: "#0d0d0d",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 10, position: "relative",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.background = "#141414"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.background = "#0d0d0d"; }}
                >
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: "#1a1a1a", border: "1px solid #2a2a2a",
                    borderRadius: 20, padding: "3px 8px",
                    fontSize: 11, color: "#aaa",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <NavigationArrow size={10} color="#aaa" weight="fill" />
                    {r.distance_label}
                  </div>

                  <div style={{
                    background: "#1a1a1a", borderRadius: "50%",
                    width: 68, height: 68, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    border: "1px solid #2a2a2a", marginTop: 8,
                  }}>
                    <UserCircle size={50} color="#fff" weight="duotone" />
                  </div>

                  <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", textAlign: "center" }}>{r.name}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#777", fontSize: 13 }}>
                    <Motorcycle size={14} color="#777" />
                    {r.plate_number}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#777", fontSize: 13 }}>
                    <Phone size={14} color="#777" />
                    {r.phone ?? "N/A"}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {renderStars(r.avg_rating)}
                    <span style={{ fontSize: 12, color: "#555", marginLeft: 4 }}>
                      {r.avg_rating} ({r.total_ratings})
                    </span>
                  </div>

                  <div style={{
                    marginTop: 6, width: "100%", padding: "9px 0",
                    borderRadius: 8, background: "#fff", color: "#000",
                    textAlign: "center", fontSize: 13, fontWeight: 700,
                  }}>
                    Select
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleReset}
              style={{
                width: "100%", marginTop: 16, padding: "13px",
                borderRadius: 12, border: "1px solid #222",
                background: "transparent", cursor: "pointer",
                fontWeight: 600, fontSize: 14, color: "#777",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}

        {/* Confirmed + Ride Created */}
        {selectedRider && rideCreated && (
          <div style={{ border: "1px solid #1f1f1f", borderRadius: 16, padding: 24, background: "#0d0d0d" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <CheckCircle size={26} color="#22c55e" weight="fill" />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>Ride Requested!</h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
              <div style={{
                background: "#1a1a1a", borderRadius: "50%",
                width: 76, height: 76, display: "flex",
                alignItems: "center", justifyContent: "center",
                border: "1px solid #2a2a2a", flexShrink: 0,
              }}>
                <UserCircle size={58} color="#fff" weight="duotone" />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>{selectedRider.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#777", fontSize: 14 }}>
                  <Motorcycle size={14} color="#777" />
                  {selectedRider.plate_number}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#777", fontSize: 14 }}>
                  <Phone size={14} color="#777" />
                  {selectedRider.phone ?? "N/A"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {renderStars(selectedRider.avg_rating)}
                  <span style={{ fontSize: 12, color: "#555", marginLeft: 4 }}>
                    {selectedRider.avg_rating} · {selectedRider.total_ratings} reviews
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 14px", borderRadius: 10,
              background: "#111", border: "1px solid #1f1f1f", marginBottom: 12,
            }}>
              <NavigationArrow size={16} color="#aaa" weight="fill" />
              <span style={{ fontSize: 14, color: "#aaa" }}>{selectedRider.distance_label} away</span>
            </div>

            {/* Contact confirmed */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 14px", borderRadius: 10,
              background: "#111", border: "1px solid #1f1f1f", marginBottom: 12,
            }}>
              <Phone size={16} color="#aaa" weight="fill" />
              <span style={{ fontSize: 14, color: "#aaa" }}>+255{phone}</span>
            </div>

            {/* Ride status pill */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "10px 14px", borderRadius: 10,
              background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)",
              marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#eab308", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 13, color: "#eab308", fontWeight: 600 }}>Waiting for rider to accept...</span>
            </div>

            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>

            <button
              onClick={handleReset}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                border: "none", background: "#fff", color: "#000",
                cursor: "pointer", fontWeight: 700, fontSize: 14,
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}