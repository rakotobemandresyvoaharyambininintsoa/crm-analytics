import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
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
      { error: "Mot de passe incorrect" },
      { status: 401 }
    );
  }

  // Le token contient les infos utiles ET signées : impossible à falsifier
  // sans connaître JWT_SECRET.
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
    maxAge: 60 * 60 * 8, // 8h, aligné sur l'expiration du JWT
  });

  return response;
}
