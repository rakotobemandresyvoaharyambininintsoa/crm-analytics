import { NextResponse } from "next/server";

import {
  calculerBusinessScore,
  genererResumeExecutif,
  genererActionsIA,
  genererAnalyseStock,
  genererAnalyseClients,
} from "@/lib/ai/dashboard";

import { requireRole } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";


export async function GET(request: Request) {

  try {

    await requireRole([
      "ADMIN",
      "COMMERCIAL",
      "MAGASINIER",
    ]);

    const rateLimit = checkRateLimit(`ai:dashboard-summary:${getClientKey(request)}`, 20, 60_000, 2 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 120) } }
      );
    }



    const [
      businessScore,
      resumeData,
      actionsIA,
      analyseStock,
      analyseClients,

    ] = await Promise.all([


      calculerBusinessScore(),


      genererResumeExecutif(),


      genererActionsIA(),


      genererAnalyseStock(),


      genererAnalyseClients(),


    ]);



    return NextResponse.json({

      businessScore,

      ...resumeData,

      actionsIA,

      analyseStock,

      analyseClients,

    });



  } catch (error) {


    console.error(
      "[AI Dashboard Summary] Erreur:",
      error
    );



    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue";



    const status =
      message === "UNAUTHORIZED"
        ? 401
        : message === "FORBIDDEN"
        ? 403
        : 500;



    return NextResponse.json(

      {
        error:
          "Impossible de générer le résumé IA.",
      },

      {
        status,
      }

    );


  }

}
