import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";




// ======================
// GET FACTURES
// ======================

export async function GET(){


try{


await requireRole([
"ADMIN",
"COMMERCIAL"
]);




const factures =
await prisma.facture.findMany({


include:{


client:true,

opportunite:true


},



orderBy:{

createdAt:"desc"

}


});





return NextResponse.json(
factures
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









// ======================
// CREATE FACTURE
// ======================


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






const montant =
Number(body.montant || 0);



const tva =
Number(body.tva || 20);



const remise =
Number(body.remise || 0);






if(montant <= 0){


return NextResponse.json(

{
error:"Montant invalide"
},

{
status:400
}

);


}






const numero =

"FAC-" +

new Date()
.getFullYear()

+

"-"

+

Date.now();







const facture =
await prisma.facture.create({



data:{



numero,



montant,



tva,



remise,



statut:
body.statut || "Brouillon",




clientId:

body.clientId
?
Number(body.clientId)
:
null,





opportuniteId:

body.opportuniteId
?
Number(body.opportuniteId)
:
null




}

});







return NextResponse.json(

facture

);







}catch(error){


console.error(error);



return NextResponse.json(

{
error:"Erreur création facture"
},

{
status:500
}

);



}


}