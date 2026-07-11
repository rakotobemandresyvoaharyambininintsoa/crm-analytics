import { NextResponse } from "next/server";
import { repondreQuestionCRM } from "@/lib/ai/insights";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);

    const { question } = await req.json();
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json({ error: "Question manquante." }, { status: 400 });
    }

    const reponse = await repondreQuestionCRM(question.trim());
    return NextResponse.json({ reponse });
  } catch (error) {
    console.error("[AI Chat] Erreur:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: "Impossible de répondre pour le moment." }, { status });
  }
}
