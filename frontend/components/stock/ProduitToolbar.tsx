"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";


interface ProduitToolbarProps {

recherche:string;

setRecherche:(value:string)=>void;

ouvrirForm:()=>void;

}



export default function ProduitToolbar({

recherche,

setRecherche,

ouvrirForm

}:ProduitToolbarProps){



return (

<div className="
bg-slate-900
p-5
rounded-3xl
mb-6
flex
flex-col
md:flex-row
gap-4
justify-between
">



<div className="flex-1">


<Input

placeholder="🔎 Rechercher un produit..."

value={recherche}

onChange={
e=>setRecherche(e.target.value)
}

/>


</div>





<Button

variant="primary"

icon="➕"

onClick={ouvrirForm}

>

Nouveau produit

</Button>





</div>

)

}