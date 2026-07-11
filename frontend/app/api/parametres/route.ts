import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";


export async function GET(){


const param =
await prisma.parametre.findFirst();


return NextResponse.json(param);

}




export async function POST(
request:Request
){


const body =
await request.json();



const param =
await prisma.parametre.create({

data:{

nomEntreprise:
body.nomEntreprise,

email:
body.email,

telephone:
body.telephone,

adresse:
body.adresse,

devise:
body.devise || "Ar"

}

});



return NextResponse.json(param);


}