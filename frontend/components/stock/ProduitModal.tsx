"use client";


export default function ProduitModal({

ouvert,

fermer,

children


}:any){



if(!ouvert)
return null;



return (


<div className="
fixed
inset-0
bg-black/70
flex
items-center
justify-center
z-50
">



<div className="
bg-slate-900
p-8
rounded-3xl
w-[500px]
">


{children}



<button

onClick={fermer}

className="
mt-5
bg-red-600
px-5
py-3
rounded-xl
"

>

Fermer

</button>



</div>


</div>


)


}