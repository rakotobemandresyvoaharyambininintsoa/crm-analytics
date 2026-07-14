import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";


export async function GET(){

  try {
    await requireRole(["ADMIN", "MAGASINIER"]);
  } catch {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {


    const produits =
    await prisma.produit.findMany({
      select:{

        id:true,

        quantite:true,

        prixVente:true,

        seuilAlerte:true

      }
    });




    const mouvements =
    await prisma.mouvement.findMany({

      select:{

        type:true,

        quantite:true

      }

    });





    const totalProduits =
    produits.length;




    const valeurStock =
    produits.reduce(
      (a,p)=>
      a + 
      (
        p.quantite *
        p.prixVente
      ),
      0
    );





    const alertes =
    produits.filter(
      p=>
      p.quantite <= p.seuilAlerte
    ).length;






    const entrees =
    mouvements
    .filter(
      m=>m.type==="ENTREE"
    )
    .reduce(
      (a,m)=>
      a+m.quantite,
      0
    );






    const sorties =
    mouvements
    .filter(
      m=>m.type==="SORTIE"
    )
    .reduce(
      (a,m)=>
      a+m.quantite,
      0
    );






    return NextResponse.json({

      totalProduits,

      valeurStock,

      alertes,

      entrees,

      sorties

    });



  }
  catch(error){


    console.error(error);


    return NextResponse.json(
      {
        error:"Erreur dashboard stock"
      },
      {
        status:500
      }
    );


  }


} 
