"use client";

import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function OAuthPage() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setOpen(true);
  }, []);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {open && !user && (
          <div
            style={{
              padding: 30,
              border: "1px solid #ddd",
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <h2>Sign in with Google</h2>

            <GoogleLogin
              onSuccess={(res) => {
                if (!res.credential) return;

                const decoded: any = jwtDecode(res.credential);
                console.log("USER:", decoded);

                setUser(decoded);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        )}

        {user && (
          <div style={{ textAlign: "center" }}>
            <h2>Welcome 🎉</h2>
            <img
              src={user.picture}
              alt="profile"
              width={80}
              style={{ borderRadius: "50%" }}
            />
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}