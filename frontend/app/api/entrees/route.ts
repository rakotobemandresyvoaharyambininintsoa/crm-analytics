import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";



export async function POST(
request: Request
) {


try {



await requireRole([
"ADMIN",
"MAGASINIER"
]);





const body =
await request.json();






const produit =
await prisma.produit.update({

where: {

id:Number(body.produitId)

},


data: {


quantite: {

increment:
Number(body.quantite)

}

}

});







await prisma.mouvement.create({


data: {


produitId:
produit.id,


type:"ENTREE",


quantite:
Number(body.quantite),


commentaire:
body.commentaire || ""


}


});







return NextResponse.json({

success:true

});





}catch(error){



return NextResponse.json(

{

error:"Accès refusé ou erreur entrée stock"

},

{

status:403

}

);


}



}