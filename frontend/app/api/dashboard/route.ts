import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {


    const [

      clients,

      produits,

      opportunites,

      factures,

      activites,

      produitsStock,

      facturesRecentes,

      lignesProduits


    ] = await Promise.all([


      prisma.client.count(),


      prisma.produit.count(),


      prisma.opportunite.count(),


      prisma.facture.count(),


      prisma.activite.findMany({

        orderBy:{
          createdAt:"desc"
        },

        take:10,

        include:{
          client:true
        }

      }),



      prisma.produit.findMany(),



      prisma.facture.findMany({

        orderBy:{
          createdAt:"desc"
        },

        take:5,

        include:{
          client:true
        }

      }),



      prisma.factureLigne.findMany({

        include:{
          produit:true
        }

      })


    ]);









    // ============================
    // STOCK
    // ============================


    const stock = produitsStock.reduce(

      (total,p)=>
        total + p.quantite,

      0

    );




    const valeurStock = produitsStock.reduce(

      (total,p)=>

        total +

        (
          p.quantite *
          p.prixVente
        ),

      0

    );









    // ============================
    // ALERTES STOCK
    // ============================


    const produitsAlertes = produitsStock.filter(

      p =>
      p.quantite <= p.seuilAlerte

    )
    .map(p=>({

      id:p.id,

      nom:p.nom,

      quantite:p.quantite,

      categorie:
      p.categorieId
      ? "Catégorie"
      :
      "Non définie",

      venteMoyenne:5

    }));









    // ============================
    // TOP PRODUITS
    // ============================


    const mapProduits:any={};



    lignesProduits.forEach(l=>{


      if(!mapProduits[l.produitId]){

        mapProduits[l.produitId]={

          id:l.produitId,

          nom:l.produit.nom,

          quantite:0,

          revenu:0,

          tendance:10

        };

      }



      mapProduits[l.produitId].quantite
      += l.quantite;



      mapProduits[l.produitId].revenu
      += l.quantite * l.prix;



    });




    const topProduits = Object.values(mapProduits)

    .sort(
      (a:any,b:any)=>
      b.quantite-a.quantite
    )

    .slice(0,5);









    // ============================
    // REVENUS
    // ============================


    const ventes = facturesRecentes.map(f=>({


      mois:
      new Date(f.createdAt)
      .toLocaleString(
        "fr-FR",
        {
          month:"short"
        }
      ),


      ca:f.montant,


      prediction:
      Math.round(
        f.montant * 1.12
      )


    }));









    // ============================
    // FACTURES
    // ============================


    const recentInvoices =
    facturesRecentes.map(f=>({


      id:f.id,


      client:
      f.client?.nom
      ??
      "Client inconnu",


      montant:f.montant,


      statut:

      f.statut==="Payée"
      ?
      "Payée"
      :
      "En attente",


      date:
      f.createdAt
      .toLocaleDateString(
        "fr-FR"
      )


    }));









    // ============================
    // ACTIVITES
    // ============================


    const activities = activites.map(a=>({


      id:a.id,


      type:

      a.type.includes("vente")
      ?
      "vente"
      :
      a.type.includes("client")
      ?
      "client"
      :
      "facture",


      titre:a.titre,


      description:

      a.description
      ??
      "Nouvelle activité CRM",


      date:

      a.date
      .toLocaleDateString(
        "fr-FR"
      )


    }));









    // ============================
    // SCORE IA
    // ============================


    let businessScore = 50;



    if(clients > 10)
      businessScore +=10;


    if(factures > 10)
      businessScore +=10;


    if(produitsAlertes.length===0)
      businessScore +=15;


    if(opportunites > 5)
      businessScore +=10;




    if(businessScore>100)
      businessScore=100;









    // ============================
    // INSIGHTS IA
    // ============================


    const aiInsights=[


      {

        type:"growth",

        title:"Analyse commerciale",

        message:

        `Votre entreprise possède ${clients} clients actifs.`

      },


      {


        type:"warning",

        title:"Stock",

        message:

        produitsAlertes.length > 0

        ?

        `${produitsAlertes.length} produits nécessitent un réapprovisionnement.`

        :

        "Votre stock est actuellement stable."

      },


      {


        type:"recommendation",

        title:"Optimisation IA",

        message:

        "L'IA recommande de suivre les produits les plus vendus."

      }


    ];









    return NextResponse.json({

      clients,

      produits,

      opportunites,

      factures,


      stock,


      valeurStock,


      ventes,


      objectifCA:10000000,


      revenueInsight:

      "L'IA prévoit une progression basée sur vos tendances commerciales.",


      businessScore,


      aiInsights,


      produitsAlertes,


      topProduits,


      recentInvoices,


      activities


    });





  }


  catch(error){


    console.error(error);



    return NextResponse.json(

      {

        error:
        "Erreur dashboard"

      },


      {
        status:500
      }

    );


  }


}