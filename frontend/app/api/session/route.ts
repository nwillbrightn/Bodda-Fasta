import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const body = await req.json();

  session.user = body.user;
  session.access_token = body.access_token;
  await session.save();

  return Response.json({ ok: true });
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.destroy();
  return Response.json({ ok: true });
}

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return Response.json({
    user: session.user ?? null,
    access_token: session.access_token ?? null,
  });
}