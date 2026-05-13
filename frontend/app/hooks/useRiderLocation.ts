import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useRiderLocation(riderId: number | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!riderId) return;

    // Connect to backend
    socketRef.current = io("http://127.0.0.1:5000");

    const socket = socketRef.current;

    // Start watching GPS
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        socket.emit("rider_location_update", {
          rider_id: riderId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => console.error("GPS error:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    socket.on("location_updated", (data) => {
      console.log("Location synced:", data);
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data);
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.disconnect();
    };
  }, [riderId]);
}