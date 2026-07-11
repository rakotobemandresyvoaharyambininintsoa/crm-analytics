"use client";


import {
  InputHTMLAttributes,
  ReactNode
} from "react";



interface InputProps
extends InputHTMLAttributes<HTMLInputElement>{


label?:string;

icon?:ReactNode;

error?:string;


}




export default function Input({

label,

icon,

error,

className="",

...props


}:InputProps){



return (


<div className="flex flex-col gap-2">



{
label && (

<label className="
text-sm
text-slate-300
">

{label}

</label>

)
}




<div className="relative">



{
icon && (

<span className="
absolute
left-3
top-1/2
-translate-y-1/2
">

{icon}

</span>

)

}




<input


{...props}


className={`

w-full

bg-slate-800

border

border-slate-700

rounded-xl

px-4

py-3

text-white

outline-none

focus:border-violet-500

${icon ? "pl-10":""}

${className}

`}


/>


</div>




{
error && (

<p className="
text-red-400
text-sm
">

{error}

</p>

)

}




</div>


)


}