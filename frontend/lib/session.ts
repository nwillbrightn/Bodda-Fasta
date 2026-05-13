import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "app_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

export type SessionData = {
  user?: {
    id: number;
    name: string;
    email: string;
    user_type: string;
  };
  access_token?: string;
};