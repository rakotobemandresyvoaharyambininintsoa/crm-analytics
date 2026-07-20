import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";




// =========================
// GET - LISTE PRODUITS
// =========================

export async function GET(){


try{


await requireRole([
"ADMIN",
"MAGASINIER"
]);



const produits =
await prisma.produit.findMany({

orderBy:{
createdAt:"desc"
},


include:{

mouvements:{

orderBy:{
createdAt:"desc"
}

}

}

});



return NextResponse.json(produits);



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









// =========================
// POST - AJOUT PRODUIT
// =========================


export async function POST(
request:Request
){


try{


await requireRole([
"ADMIN",
"MAGASINIER"
]);



const body =
await request.json();




if(!body.nom){


return NextResponse.json(
{
error:"Nom obligatoire"
},
{
status:400
}
);


}







const produit =
await prisma.$transaction(async(tx)=>{





const nouveauProduit =
await tx.produit.create({


data:{


reference:

body.reference ||

"REF-"+Date.now(),



codeBarre:

body.codeBarre || null,



nom:

body.nom,



categorie:

body.categorie || "Autre",



marque:

body.marque || null,



fournisseur:

body.fournisseur || "Non défini",



emplacement:

body.emplacement || null,



prixAchat:

Number(body.prixAchat || 0),



prixVente:

Number(body.prixVente || 0),



quantite:

Number(body.quantite || 0),



seuilAlerte:

Number(body.seuilAlerte || 10)



}

});







await tx.mouvement.create({


data:{


produitId:

nouveauProduit.id,



type:"ENTREE",



quantite:

nouveauProduit.quantite,



commentaire:

"Création produit"



}


});




return nouveauProduit;



});






return NextResponse.json(produit);




}catch(error){



console.log(error);



return NextResponse.json(
{
error:"Erreur création produit"
},
{
status:500
}
);


}


}











// =========================
// PUT - MODIFICATION
// =========================


export async function PUT(
request:Request
){



try{



await requireRole([
"ADMIN",
"MAGASINIER"
]);




const body =
await request.json();





const produit =
await prisma.produit.update({



where:{

id:Number(body.id)

},




data:{



nom:

body.nom,



categorie:

body.categorie,



fournisseur:

body.fournisseur,



marque:

body.marque,



emplacement:

body.emplacement,



prixAchat:

Number(body.prixAchat),



prixVente:

Number(body.prixVente),



seuilAlerte:

Number(body.seuilAlerte)



}


});







await prisma.mouvement.create({


data:{


produitId:

produit.id,



type:"MODIFICATION",



quantite:0,



commentaire:

"Produit modifié"


}


});





return NextResponse.json(produit);




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












// =========================
// DELETE - SUPPRESSION
// =========================


export async function DELETE(
request:Request
){



try{



await requireRole([
"ADMIN"
]);






const id =

Number(

new URL(request.url)

.searchParams

.get("id")

);








await prisma.$transaction(async(tx)=>{






await tx.mouvement.deleteMany({


where:{

produitId:id

}


});






await tx.inventaireLigne.deleteMany({


where:{

produitId:id

}


});







await tx.produit.delete({


where:{

id

}


});






});







return NextResponse.json({

success:true

});





}catch(error){



return NextResponse.json(
{
error:"Suppression impossible"
},
{
status:500
}
);


}



}
