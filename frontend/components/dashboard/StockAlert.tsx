"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Brain,
  TrendingDown,
  Sparkles
} from "lucide-react";


interface ProduitAlerte {

  id:number;

  nom:string;

  quantite:number;

  venteMoyenne?:number;

  categorie?:string;

}



interface StockAlertProps {

  produits:ProduitAlerte[];

}





function getRisk(quantite:number){


if(quantite <= 3){

return {
label:"Critique",
color:"text-red-300",
bg:"bg-red-500/10",
border:"border-red-500/20"
};

}


if(quantite <= 10){

return {
label:"Attention",
color:"text-orange-300",
bg:"bg-orange-500/10",
border:"border-orange-500/20"
};

}



return {

label:"Surveillance",

color:"text-yellow-300",

bg:"bg-yellow-500/10",

border:"border-yellow-500/20"

};


}







function getPrediction(p:ProduitAlerte){


if(!p.venteMoyenne)
return "Analyse IA en attente";



const jours = Math.floor(
p.quantite / p.venteMoyenne * 30
);



if(jours < 7)

return "Risque de rupture dans moins d'une semaine";


if(jours < 30)

return "Stock faible détecté";


return "Stock stable";


}








export default function StockAlert({

produits

}:StockAlertProps){



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
bg-amber-500/10
"
>

<AlertTriangle

className="
h-5
w-5
text-amber-400
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
Alertes stock IA
</h2>


<p
className="
text-xs
text-gray-400
"
>
Détection intelligente des ruptures
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
produits.length === 0 ? (



<div
className="
flex
items-center
gap-3
bg-emerald-500/10
border
border-emerald-500/20
text-emerald-300
p-4
rounded-xl
"
>


<CheckCircle2
size={18}
/>


<div>

<p
className="
font-medium
"
>
Stock sécurisé
</p>


<p
className="
text-xs
"
>
L'IA ne détecte aucune anomalie.
</p>


</div>



</div>



):(





<div
className="
space-y-4
"
>


{
produits.map((p)=>(



<div

key={p.id}

className="
rounded-xl
border
border-white/10
bg-black/20
p-4
"

>



<div
className="
flex
justify-between
items-start
"
>



<div>

<div
className="
flex
items-center
gap-2
"
>


<Package
size={17}
className="
text-violet-400
"
/>


<h3
className="
font-semibold
text-white
"
>
{p.nom}
</h3>



</div>



<p
className="
text-sm
text-gray-400
mt-2
"
>

Catégorie :
{p.categorie ?? "Non définie"}

</p>


</div>





{
(()=>{

const risk=getRisk(p.quantite);


return (

<span
className={`
text-xs
px-3
py-1
rounded-full
${risk.bg}
${risk.border}
border
${risk.color}
`}
>

{risk.label}

</span>

)

})()
}





</div>







<div
className="
mt-4
grid
grid-cols-2
gap-3
"
>


<div
className="
rounded-lg
bg-red-500/10
p-3
"
>


<p
className="
text-xs
text-gray-400
"
>
Stock actuel
</p>


<p
className="
text-white
font-bold
"
>
{p.quantite}
</p>


</div>






<div
className="
rounded-lg
bg-violet-500/10
p-3
"
>


<p
className="
text-xs
text-gray-400
"
>
Prévision IA
</p>


<p
className="
text-violet-300
text-sm
"
>
{getPrediction(p)}
</p>


</div>



</div>









<div
className="
mt-4
flex
items-start
gap-2
rounded-lg
bg-white/[0.03]
p-3
"
>


<Sparkles
size={16}
className="
text-yellow-400
mt-1
"
/>


<p
className="
text-sm
text-gray-300
"
>

Recommandation IA :
Commander rapidement ce produit pour éviter une interruption des ventes.

</p>



</div>





</div>



))

}



</div>



)

}



</div>


);


}
