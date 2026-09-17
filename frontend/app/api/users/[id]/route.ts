import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/auth";

const ROLES_VALIDES = ["ADMIN", "COMMERCIAL", "MAGASINIER", "USER"];

export async function PUT(request: Request, context: any) {
  let session;
  try {
    session = await requireRole(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const id = Number(context.params.id);
  const body = await request.json();

  const data: Record<string, unknown> = {
    nom: body.nom,
  };

  if (body.role !== undefined) {
    if (!ROLES_VALIDES.includes(body.role)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }
    if (id === session.id && body.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Vous ne pouvez pas retirer votre propre rôle admin" },
        { status: 400 }
      );
    }
    data.role = body.role;
  }

  if (body.password) {
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }
    data.password = await bcrypt.hash(body.password, 10);
  }

  try {
    const user = await prisma.user.update({ where: { id }, data });

    return NextResponse.json({
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      actif: user.actif,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Modification impossible" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request, context: any) {
  let session;
  try {
    session = await requireRole(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const id = Number(context.params.id);

  if (id === session.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas désactiver votre propre compte" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { actif: !user.actif },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, context: any) {
  let session;
  try {
    session = await requireRole(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const id = Number(context.params.id);

  if (id === session.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas supprimer votre propre compte" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Suppression impossible" },
      { status: 400 }
    );
  }
}
