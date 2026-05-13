"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: number;
  name: string;
  email: string;
  user_type: "customer" | "rider";
  rider_id?: number;
  account_status: number;
  access_privileges: number;
}

type Props = {
  onSuccess?: (user: User, token: string) => void;
};

export default function OAuthButton({ onSuccess }: Props) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={async (res) => {
          if (!res.credential) return;

          try {
            const decoded: any = jwtDecode(res.credential);

            const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                credential: res.credential,
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              console.error("Backend error:", JSON.stringify(data, null, 2));
              throw new Error(`Login failed: ${response.status}`);
            }

            const user: User = data.user;

            await fetch("/api/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user, access_token: data.access_token }),
            });

            onSuccess?.(user, data.access_token);
          } catch (err) {
            console.error("Backend login error:", err);
          }
        }}
        onError={() => console.log("Google Login Failed")}
      />
    </GoogleOAuthProvider>
  );
}