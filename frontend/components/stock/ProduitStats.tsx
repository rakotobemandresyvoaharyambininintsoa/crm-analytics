"use client";

import StatCard from "@/components/ui/StatCard";


interface ProduitStatsProps {

  produits:number;

  valeurStock:number;

  alertes:number;

}


export default function ProduitStats({

  produits,

  valeurStock,

  alertes

}:ProduitStatsProps){


return (

<div className="
grid
md:grid-cols-3
gap-6
mb-8
">


<StatCard

title="Produits"

value={produits}

icon="📦"

/>



<StatCard

title="Valeur Stock"

value={
valeurStock.toLocaleString()+" Ar"
}

icon="💰"

/>



<StatCard

title="Alertes"

value={alertes}

icon="🚨"

/>


</div>

)

}
