import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import jsPDF from "jspdf";

export async function GET() {
  try {
    await requireRole(["ADMIN", "COMMERCIAL"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const clients = await prisma.client.findMany();

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Rapport CRM", 20, 20);
  doc.setFontSize(12);

  let y = 35;
  clients.forEach((c) => {
    doc.text(`Client: ${c.nom}`, 20, y);
    doc.text(`Entreprise: ${c.entreprise || "-"}`, 20, y + 7);
    doc.text(`Email: ${c.email || "-"}`, 20, y + 14);
    y += 25;
  });

  const pdf = doc.output("arraybuffer");

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=rapport-crm.pdf",
    },
  });
}
