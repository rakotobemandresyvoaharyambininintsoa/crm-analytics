import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET() {

  const activites =
  await prisma.activite.findMany({

    include:{
      client:true
    },

    orderBy:{
      date:"desc"
    }

  });

  return NextResponse.json(activites);

}



export async function POST(
  request:Request
){

  const body =
  await request.json();

  const activite =
  await prisma.activite.create({

    data:{

      titre:body.titre,

      type:body.type,

      description:
      body.description || null,

      date:new Date(body.date),

      clientId:Number(
        body.clientId
      )

    }

  });

  return NextResponse.json(
    activite
  );

}