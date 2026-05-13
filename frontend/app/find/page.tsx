"use client";

import { useState } from "react";
import axios from "axios";

export default function FindRiderPage() {
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState(false);
  const [rider, setRider] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const findRider = async () => {
    setLoading(true);
    setMatched(false);
    setError(null);

    try {
      // 1. Get user location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const payload = {
        pickup_lat: position.coords.latitude,
        pickup_lng: position.coords.longitude,
      };

      // 2. Call backend to match rider
      const res = await axios.post(
        "http://127.0.0.1:5000/api/rides/request",
        payload
      );

      // 3. Backend returns matched rider
      setRider(res.data.rider);
      setMatched(true);
    } catch (err: any) {
      console.error(err);
      setError("Failed to find rider. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Find a Rider</h1>

      <p style={{ color: "#555", marginTop: 8 }}>
        Request a nearby rider instantly.
      </p>

      {!loading && !matched && (
        <button
          onClick={findRider}
          style={{
            marginTop: 20,
            padding: "12px 18px",
            borderRadius: 10,
            border: "none",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Find Rider
        </button>
      )}

      {loading && (
        <p style={{ marginTop: 20 }}>
          🔍 Finding nearest rider...
        </p>
      )}

      {error && (
        <p style={{ marginTop: 20, color: "red" }}>
          {error}
        </p>
      )}

      {matched && rider && (
        <div style={{ marginTop: 20 }}>
          <h2>🚴 Rider Found!</h2>

          <p><b>Name:</b> {rider.name}</p>
          <p><b>Plate:</b> {rider.plate_number}</p>
          <p><b>Phone:</b> {rider.phone}</p>

          <p style={{ marginTop: 10 }}>
            Rider is on the way to your location.
          </p>
        </div>
      )}
    </div>
  );
}