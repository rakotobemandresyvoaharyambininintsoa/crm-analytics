import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";




// =======================
// MODIFIER OPPORTUNITE
// =======================

export async function PUT(
request:Request,
context:any
){


try{


await requireRole([
"ADMIN",
"COMMERCIAL"
]);



const body =
await request.json();



const id =
Number(
context.params.id
);





const opportunite =
await prisma.opportunite.update({


where:{

id

},



data:{


statut:
body.statut,


}

});






return NextResponse.json(
opportunite
);





}catch(error){


console.error(error);



return NextResponse.json(

{
error:"Modification impossible"
},

{
status:500
}

);


}

}