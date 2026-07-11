"use client";

import {
  Package,
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
  Trophy
} from "lucide-react";


interface Produit {

  id?:number;

  nom:string;

  quantite:number;

  revenu?:number;

  tendance?:number;

}



interface TopProductsProps {

  produits:Produit[];

}




function formatMoney(value:number){

return new Intl.NumberFormat(
"fr-FR",
{
notation:"compact"
}
).format(value)+" Ar";

}







function getPerformance(tendance:number=0){


if(tendance >= 10){

return {
text:"En forte croissance",
icon:<TrendingUp size={15}/>,
color:"text-green-400"
};

}


if(tendance < 0){

return {
text:"En baisse",
icon:<TrendingDown size={15}/>,
color:"text-red-400"
};

}



return {

text:"Stable",

icon:<TrendingUp size={15}/>,

color:"text-yellow-400"

};


}








export default function TopProducts({

produits

}:TopProductsProps){



return (

<div

className="
bg-white/[0.03]
border
border-white/10
rounded-2xl
p-6
"

>




{/* HEADER */}

<div

className="
flex
items-center
justify-between
mb-6
"

>



<div

className="
flex
items-center
gap-3
"

>


<div

className="
p-2
rounded-xl
bg-violet-500/10
"

>


<Package

className="
h-5
w-5
text-violet-400
"

/>


</div>




<div>


<h2

className="
text-lg
font-semibold
text-white
"

>
Top produits IA
</h2>


<p

className="
text-xs
text-gray-400
"

>
Analyse des performances commerciales
</p>



</div>



</div>





<Brain

size={20}

className="
text-violet-400
"

/>




</div>









{
!produits || produits.length===0 ? (


<p

className="
text-white/40
text-sm
"

>
Aucune donnée disponible
</p>



):(





<div

className="
space-y-4
"

>


{
produits.map(
(p,index)=>{



const performance =
getPerformance(
p.tendance
);



return (


<div

key={p.id ?? index}

className="
rounded-xl
border
border-white/10
bg-black/20
p-4
hover:bg-white/[0.05]
transition
"

>



<div

className="
flex
items-center
justify-between
"

>




<div

className="
flex
items-center
gap-3
"

>



<div

className="
flex
h-8
w-8
items-center
justify-center
rounded-full
bg-violet-500/10
border
border-violet-500/20
"

>


{
index===0
?
<Trophy
size={15}
className="
text-yellow-400
"
/>

:

<span

className="
text-xs
font-bold
text-violet-300
"

>
{index+1}
</span>

}


</div>






<div>


<p

className="
font-semibold
text-white
"

>
{p.nom}
</p>


<div

className="
flex
items-center
gap-2
mt-1
"

>

<span

className="
text-xs
text-gray-400
"

>
Ventes :
{p.quantite}
</span>


<span

className={`
flex
items-center
gap-1
text-xs
${performance.color}
`}

>

{performance.icon}

{performance.text}

</span>



</div>



</div>



</div>






<div

className="
text-right
"

>


<p

className="
text-indigo-400
font-bold
tabular-nums
"

>
{p.quantite}
</p>


<p

className="
text-xs
text-gray-500
"

>
unités
</p>



</div>



</div>









{/* IA ANALYSIS */}


<div

className="
mt-4
flex
items-center
gap-2
rounded-lg
bg-violet-500/10
border
border-violet-500/20
p-3
"

>


<Sparkles

size={15}

className="
text-violet-300
"

/>



<p

className="
text-xs
text-gray-300
"

>


{
index===0
?
"L'IA identifie ce produit comme un produit stratégique à fort potentiel."
:
"L'IA recommande de surveiller les ventes de ce produit."
}



</p>



</div>





</div>



)


}

)

}



</div>



)

}



</div>

);


}