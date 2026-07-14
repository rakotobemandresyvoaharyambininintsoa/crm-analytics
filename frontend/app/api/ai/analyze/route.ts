import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";


export async function POST(
  request: Request
) {
  try {
    await requireRole(["ADMIN", "COMMERCIAL", "MAGASINIER"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }


  try {


    const body = await request.json();


    const {

      clients = 0,

      revenus = 0,

      stockFaible = 0,

      topProduit = "aucun"

    } = body;





    let score = 50;


    if(clients > 20)
      score += 15;


    if(revenus > 10000000)
      score += 15;


    if(stockFaible === 0)
      score += 10;


    if(score > 100)
      score = 100;








    const insights = [];





    if(revenus > 0){

      insights.push({

        type:"growth",

        title:"Analyse des revenus",

        message:

        `Le chiffre d'affaires actuel est de ${revenus.toLocaleString()} Ar. La tendance commerciale est positive.`

      });


    }






    if(stockFaible > 0){

      insights.push({

        type:"warning",

        title:"Risque stock",

        message:

        `${stockFaible} produit(s) présentent un risque de rupture. Une action de réapprovisionnement est recommandée.`

      });


    }

    else{


      insights.push({

        type:"success",

        title:"Stock optimal",

        message:

        "Aucun risque majeur détecté dans la gestion du stock."

      });


    }








    insights.push({

      type:"recommendation",

      title:"Recommandation IA",

      message:

      `Le produit ${topProduit} doit être surveillé car il représente un potentiel commercial important.`

    });








    return NextResponse.json({

      score,


      summary:

      "Analyse IA terminée. Les indicateurs principaux ont été étudiés.",


      insights


    });







  }

  catch(error){


    console.error(error);


    return NextResponse.json(

      {
        error:"Erreur analyse IA"
      },

      {
        status:500
      }

    );


  }

}
