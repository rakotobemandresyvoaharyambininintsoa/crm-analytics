"use client";


import OpportunityCard
from "./OpportunityCard";



const colonnes=[

"Nouveau",

"Qualification",

"Proposition",

"Négociation",

"Gagné",

"Perdu"

];




export default function Pipeline({

data,

changerStatut

}:any){



return (

<div className="
grid
md:grid-cols-6
gap-4
overflow-auto
">


{

colonnes.map(col=>(


<div

key={col}

className="
bg-slate-900
p-4
rounded-3xl
min-h-[350px]
"


>


<h2 className="
font-bold
mb-4
">

{col}

</h2>



{


data

.filter(
(o:any)=>
o.statut===col
)

.map((o:any)=>(


<OpportunityCard

key={o.id}

o={o}

changer={()=>{


const index =
colonnes.indexOf(
o.statut
);


const suivant =
colonnes[index+1];


if(suivant)

changerStatut(
o.id,
suivant
);


}}


/>



))


}




</div>


))


}



</div>


)

}
