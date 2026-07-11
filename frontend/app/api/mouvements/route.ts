import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(){

try {
  await requireRole(["ADMIN", "MAGASINIER"]);
} catch {
  return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
}

const mouvements =
await prisma.mouvement.findMany({

include:{

produit:true

},

orderBy:{

createdAt:"desc"

}

});


return NextResponse.json(mouvements);


}

export async function POST(
request:Request
){

try {
  await requireRole(["ADMIN", "MAGASINIER"]);
} catch {
  return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
}

const body =
await request.json();



const produit =
await prisma.produit.findUnique({

where:{
id:Number(body.produitId)
}

});



if(!produit){

return NextResponse.json(
{
error:"Produit introuvable"
},
{
status:404
}
);

}




let nouvelleQuantite =
produit.quantite;



if(body.type==="ENTREE"){


nouvelleQuantite +=
Number(body.quantite);


}



if(body.type==="SORTIE"){


nouvelleQuantite -=
Number(body.quantite);


}





if(nouvelleQuantite < 0){

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

where:{
id:produit.id
},

data:{

quantite:nouvelleQuantite

}

});





const mouvement =
await prisma.mouvement.create({

data:{

produitId:produit.id,

type:body.type,

quantite:Number(body.quantite),

commentaire:
body.commentaire || null

}

});




return NextResponse.json(mouvement);

}