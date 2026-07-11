"use client";


import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";


export default function ProduitForm({

form,

changer,

ajouter

}:any){



return (


<div className="
bg-slate-900
p-6
rounded-3xl
mb-6
">


<h2 className="
text-xl
font-bold
mb-5
">

➕ Ajouter produit

</h2>




<div className="
grid
md:grid-cols-4
gap-3
">


<Input
name="reference"
value={form.reference}
onChange={changer}
placeholder="Référence"
/>



<Input
name="nom"
value={form.nom}
onChange={changer}
placeholder="Nom"
/>




<Input
name="categorie"
value={form.categorie}
onChange={changer}
placeholder="Catégorie"
/>





<Input
name="fournisseur"
value={form.fournisseur}
onChange={changer}
placeholder="Fournisseur"
/>





<Input
name="prixAchat"
value={form.prixAchat}
onChange={changer}
placeholder="Prix achat"
/>





<Input
name="prixVente"
value={form.prixVente}
onChange={changer}
placeholder="Prix vente"
/>





<Input
name="quantite"
value={form.quantite}
onChange={changer}
placeholder="Quantité"
/>




</div>






<Button

onClick={ajouter}

icon="💾"

className="mt-5"

>

Enregistrer

</Button>



</div>


)


}