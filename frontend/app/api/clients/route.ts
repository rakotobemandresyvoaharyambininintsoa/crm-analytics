import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";




// ======================
// LIRE CLIENTS
// ======================

export async function GET() {


  await requireRole([
    "ADMIN",
    "COMMERCIAL"
  ]);



  const clients =
  await prisma.client.findMany({

    orderBy:{
      createdAt:"desc"
    }

  });



  return NextResponse.json(clients);

}





// ======================
// AJOUTER CLIENT
// ======================

export async function POST(
  request:Request
){


  await requireRole([
    "ADMIN",
    "COMMERCIAL"
  ]);



  const body =
  await request.json();




  const client =
  await prisma.client.create({


    data:{


      nom:body.nom,


      entreprise:
      body.entreprise || null,


      email:
      body.email || null,


      telephone:
      body.telephone || null,


      adresse:
      body.adresse || null,


      ville:
      body.ville || null,


      pays:
      body.pays || null,


      notes:
      body.notes || null


    }


  });





  return NextResponse.json(client);


}