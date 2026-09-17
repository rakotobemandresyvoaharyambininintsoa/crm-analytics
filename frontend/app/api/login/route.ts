import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signSession } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const rateLimit = checkRateLimit(`login:${clientKey}`, 5, 60_000, 5 * 60_000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 300) },
      }
    );
  }

  const body = await request.json();

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "email ou mot de passe incorrect" },
      { status: 401 }
    );
  }

  if (!user.actif) {
    return NextResponse.json(
      { error: "Compte désactivé" },
      { status: 403 }
    );
  }

  const valid = await bcrypt.compare(body.password, user.password);

  if (!valid) {
    return NextResponse.json(
      { error: "email ou mot de passe incorrect" },
      { status: 401 }
    );
  }

  const token = await signSession({
    id: user.id,
    nom: user.nom,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    id: user.id,
    nom: user.nom,
    email: user.email,
    role: user.role,
  });

  response.cookies.set("crm_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
