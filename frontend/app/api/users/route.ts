import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";




// GET USERS

export async function GET(){


const users =
await prisma.user.findMany({

select:{

id:true,
nom:true,
email:true,
role:true,
actif:true,
createdAt:true

},

orderBy:{
createdAt:"desc"
}

});


return NextResponse.json(users);


}






// CREATE USER

export async function POST(
request:Request
){


const body =
await request.json();



const hash =
await bcrypt.hash(
body.password,
10
);




const user =
await prisma.user.create({


data:{


nom:
body.nom,


email:
body.email,


password:
hash,


role:
body.role || "USER"


}


});




return NextResponse.json({

id:user.id,
nom:user.nom,
email:user.email,
role:user.role

});


}