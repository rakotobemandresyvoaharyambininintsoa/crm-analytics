"use client";


interface Produit {


id:number;

reference:string;

nom:string;

categorie:string;

fournisseur:string;

quantite:number;

prixAchat:number;

prixVente:number;

seuilAlerte:number;


}



interface ProduitTableProps {


produits:Produit[];

supprimer:(id:number)=>void;

mouvementStock:
(
id:number,
type:string
)=>void;


}



export default function ProduitTable({

produits,

supprimer,

mouvementStock


}:ProduitTableProps){



return (


<div className="
bg-slate-900
p-6
rounded-3xl
overflow-auto
">



<table className="w-full">



<thead>


<tr className="
text-slate-400
">


<th>Référence</th>

<th>Nom</th>

<th>Catégorie</th>

<th>Fournisseur</th>

<th>Stock</th>

<th>Achat</th>

<th>Vente</th>

<th>Actions</th>


</tr>


</thead>





<tbody>


{

produits.map(p=>(


<tr

key={p.id}

className="
border-t
border-slate-800
"


>



<td className="p-3">

{p.reference}

</td>




<td>

{p.nom}

</td>





<td>

{p.categorie}

</td>





<td>

{p.fournisseur}

</td>





<td

className={
p.quantite <= p.seuilAlerte
?
"text-red-400 font-bold"
:
"text-green-400"
}

>


{p.quantite}


</td>





<td>

{p.prixAchat} Ar

</td>




<td>

{p.prixVente} Ar

</td>






<td>


<div className="flex gap-2">



<button

onClick={()=>
mouvementStock(
p.id,
"ENTREE"
)
}

className="
bg-green-600
px-3
py-2
rounded-xl
"

>

+

</button>





<button

onClick={()=>
mouvementStock(
p.id,
"SORTIE"
)
}

className="
bg-orange-600
px-3
py-2
rounded-xl
"

>

-

</button>







<button

onClick={()=>
supprimer(p.id)
}

className="
bg-red-600
px-3
py-2
rounded-xl
"

>

X

</button>





</div>


</td>






</tr>


))


}



</tbody>


</table>



</div>


)

}