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
await prisma.produit.findUnique({

where: {

id:Number(body.produitId)

},

});







if (!produit) {


return NextResponse.json(

{
error:"Produit introuvable"
},

{
status:404
}

);


}









if (
produit.quantite <
Number(body.quantite)
) {


return NextResponse.json(

{
error:"Stock insuffisant"
},

{
status:400
}

);


}









await prisma.produit.update({

where: {

id:produit.id

},


data: {


quantite: {

decrement:
Number(body.quantite)

}

}


});









await prisma.mouvement.create({

data: {


produitId:
produit.id,


type:"SORTIE",


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

error:"Accès refusé ou erreur sortie stock"

},

{

status:403

}

);


}



}