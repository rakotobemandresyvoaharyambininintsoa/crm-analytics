import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import * as XLSX from "xlsx";



export async function GET(){


const clients =
await prisma.client.findMany();



const data =
clients.map(c=>({


Nom:c.nom,

Entreprise:c.entreprise,

Email:c.email,

Telephone:c.telephone,


}));



const workbook =
XLSX.utils.book_new();



const sheet =
XLSX.utils.json_to_sheet(data);



XLSX.utils.book_append_sheet(
workbook,
sheet,
"Clients"
);



const buffer =
XLSX.write(
workbook,
{
type:"buffer",
bookType:"xlsx"
}
);



return new NextResponse(
buffer,
{

headers:{

"Content-Type":
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",


"Content-Disposition":
"attachment; filename=clients.xlsx"

}

}

);


}