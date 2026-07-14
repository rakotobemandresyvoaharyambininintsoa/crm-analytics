"use client";


interface StatCardProps {

  title:string;

  value:any;

  icon:string;

}



export default function StatCard({

  title,

  value,

  icon

}:StatCardProps){



return (

<div className="
bg-slate-900
border
border-slate-800
p-6
rounded-3xl
">


  <div className="
  flex
  items-center
  gap-3
  text-slate-400
  ">


    <span className="
    text-3xl
    ">

      {icon}

    </span>



    <p className="
    text-sm
    ">

      {title}

    </p>


  </div>





  <h2 className="
  text-3xl
  font-bold
  text-white
  mt-4
  ">

    {value}

  </h2>




</div>

)


}
