import { NextResponse } from "next/server";

import {
  calculerBusinessScore,
  genererResumeExecutif,
  genererActionsIA,
  genererAnalyseStock,
  genererAnalyseClients,
} from "@/lib/ai/dashboard";

import { requireRole } from "@/lib/auth";


export async function GET() {

  try {

    await requireRole([
      "ADMIN",
      "COMMERCIAL",
      "MAGASINIER",
    ]);



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
