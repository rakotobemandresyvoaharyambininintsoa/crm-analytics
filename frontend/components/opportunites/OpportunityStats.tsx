export default function OpportunityStats({
data
}:any){


const total =
data.reduce(
(a:any,b:any)=>a+b.montant,
0
);


return (

<div className="
grid
md:grid-cols-3
gap-5
mb-6
">


<Card
t="Opportunités"
v={data.length}
/>


<Card
t="Pipeline"
v={
total.toLocaleString()+" Ar"
}
/>


<Card
t="Gagnées"
v={
data.filter(
(x:any)=>x.statut==="Gagné"
).length
}
/>


</div>

)

}



function Card({t,v}:any){

return (

<div className="
bg-slate-900
p-6
rounded-3xl
">

<p>{t}</p>

<h2 className="text-3xl font-bold">

{v}

</h2>

</div>

)

}
