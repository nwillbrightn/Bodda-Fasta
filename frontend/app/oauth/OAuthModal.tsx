"use client";

import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
};

export default function OAuthModal({ isOpen, onClose, onSuccess }: Props) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setUser(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  return (
    <GoogleOAuthProvider clientId={clientId}>
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
            background: "#111",
            padding: 30,
            borderRadius: 12,
            textAlign: "center",
            minWidth: 320,
            color: "#f5f5f5",
            border: "1px solid #2a2a2a",
          }}
        >
          {!user && (
            <>
              <h2 style={{ marginBottom: 15 }}>
                Sign in with Google
              </h2>

              <GoogleLogin
                onSuccess={(res) => {
                  if (!res.credential) return;

                  const decoded: any = jwtDecode(res.credential);

                  setUser(decoded);

                  // send user back to parent if needed
                  onSuccess?.(decoded);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </>
          )}

          {user && (
            <div>
              <h2>Welcome 🎉</h2>

              <img
                src={user.picture}
                width={70}
                style={{ borderRadius: "50%", marginTop: 10 }}
              />

              <p style={{ marginTop: 10 }}>
                <b>{user.name}</b>
              </p>

              <p style={{ opacity: 0.7 }}>{user.email}</p>

              <button
                onClick={onClose}
                style={{
                  marginTop: 15,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#fff",
                  color: "#111",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}