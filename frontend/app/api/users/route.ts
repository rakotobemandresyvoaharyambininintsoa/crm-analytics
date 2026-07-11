import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/auth";

const ROLES_VALIDES = ["ADMIN", "COMMERCIAL", "MAGASINIER", "USER"];

// ======================
// GET - LISTE UTILISATEURS (ADMIN uniquement)
// ======================
export async function GET() {
  try {
    await requireRole(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      actif: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

// ======================
// CREATE USER (ADMIN uniquement)
// ======================
export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();

  if (!body.nom || !body.email || !body.password) {
    return NextResponse.json(
      { error: "Nom, email et mot de passe sont obligatoires" },
      { status: 400 }
    );
  }

  if (body.password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères" },
      { status: 400 }
    );
  }

  const role = ROLES_VALIDES.includes(body.role) ? body.role : "USER";

  try {
    const hash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        nom: body.nom,
        email: body.email,
        password: hash,
        role,
      },
    });

    return NextResponse.json({
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de créer l'utilisateur (email déjà utilisé ?)" },
      { status: 400 }
    );
  }
}
