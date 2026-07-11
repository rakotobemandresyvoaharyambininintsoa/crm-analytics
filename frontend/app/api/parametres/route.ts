import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const param = await prisma.parametre.findFirst();
  return NextResponse.json(param);
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();

  const param = await prisma.parametre.create({
    data: {
      nomEntreprise: body.nomEntreprise,
      email: body.email,
      telephone: body.telephone,
      adresse: body.adresse,
      devise: body.devise || "Ar",
    },
  });

  return NextResponse.json(param);
}
