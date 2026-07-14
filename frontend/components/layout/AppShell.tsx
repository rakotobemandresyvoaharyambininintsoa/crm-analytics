"use client";


import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";


export default function AppShell({

children,
role

}:{

children:React.ReactNode;
role:string;

}){


return (

<div className="
flex
min-h-screen
bg-slate-950
">


<div className="
hidden
md:block
">


<Sidebar role={role}/>


</div>





<main className="
flex-1
p-4
md:p-8
">



<MobileMenu />



<Header />



{children}



</main>



</div>

)


}
