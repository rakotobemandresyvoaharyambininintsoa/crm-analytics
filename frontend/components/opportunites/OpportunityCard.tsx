export default function OpportunityCard({
o,
changer
}:any){


return (

<div

onClick={changer}

className="
bg-slate-800
p-4
rounded-xl
cursor-pointer
mb-3
">


<h3 className="font-bold">

{o.titre}

</h3>


<p>
💰 {o.montant} Ar
</p>


<p>
🎯 {o.probabilite} %
</p>


</div>


)

}