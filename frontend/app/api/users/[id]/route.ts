import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";




// =====================
// MODIFIER USER
// =====================

export async function PUT(
request:Request,
context:any
){


const id =
Number(
context.params.id
);



const body =
await request.json();




const data:any = {

nom:
body.nom,

role:
body.role

};





if(body.password){


data.password =
await bcrypt.hash(
body.password,
10
);


}






const user =
await prisma.user.update({

where:{
id
},


data

});





return NextResponse.json({

id:user.id,
nom:user.nom,
email:user.email,
role:user.role,
actif:user.actif

});

}





// =====================
// ACTIVER / DESACTIVER
// =====================


export async function PATCH(
request:Request,
context:any
){



const id =
Number(
context.params.id
);





const user =
await prisma.user.findUnique({

where:{
id
}

});





if(!user){

return NextResponse.json(
{
error:"Utilisateur introuvable"
},
{
status:404
}
);

}






const updated =
await prisma.user.update({

where:{
id
},


data:{

actif:
!user.actif

}

});





return NextResponse.json(updated);



}









// =====================
// SUPPRIMER USER
// =====================


export async function DELETE(
request:Request,
context:any
){



const id =
Number(
context.params.id
);






await prisma.user.delete({

where:{
id
}

});






return NextResponse.json({

success:true

});


}