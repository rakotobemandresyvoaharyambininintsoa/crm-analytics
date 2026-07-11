import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";




// =======================
// GET OPPORTUNITES
// =======================

export async function GET(){


try{


await requireRole([
"ADMIN",
"COMMERCIAL"
]);




const opportunites =
await prisma.opportunite.findMany({

include:{

client:true

},

orderBy:{

createdAt:"desc"

}

});




return NextResponse.json(
opportunites
);




}catch(error){


return NextResponse.json(

{
error:"Accès refusé"
},

{
status:403
}

);


}


}








// =======================
// CREATE OPPORTUNITE
// =======================


export async function POST(
request:Request
){


try{


await requireRole([
"ADMIN",
"COMMERCIAL"
]);




const body =
await request.json();





const opportunite =
await prisma.opportunite.create({


data:{


nom:
body.nom,



montant:
Number(body.montant || 0),



probabilite:
Number(body.probabilite || 0),



statut:
body.statut || "Prospection",




clientId:
body.clientId
?
Number(body.clientId)
:
null



}


});






return NextResponse.json(
opportunite
);





}catch(error){



console.error(error);



return NextResponse.json(

{
error:"Erreur création opportunité"
},

{
status:500
}

);


}


}