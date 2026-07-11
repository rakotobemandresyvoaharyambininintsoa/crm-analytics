import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const activites = await prisma.activite.findMany({
    include: { client: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(activites);
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();

  const activite = await prisma.activite.create({
    data: {
      titre: body.titre,
      type: body.type,
      description: body.description || null,
      date: new Date(body.date),
      clientId: Number(body.clientId),
    },
  });

  return NextResponse.json(activite);
}
