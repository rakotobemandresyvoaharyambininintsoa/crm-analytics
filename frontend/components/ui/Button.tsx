"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps
extends ButtonHTMLAttributes<HTMLButtonElement>{

children:React.ReactNode;

variant?:
| "primary"
| "secondary"
| "success"
| "danger"
| "warning"
| "outline";

fullWidth?:boolean;

loading?:boolean;

icon?:React.ReactNode;

}



export default function Button({

children,

variant="primary",

fullWidth=false,

loading=false,

icon,

className="",

...props

}:ButtonProps){



const couleurs={

primary:
"bg-violet-600 hover:bg-violet-700 text-white",

secondary:
"bg-slate-700 hover:bg-slate-600 text-white",

success:
"bg-green-600 hover:bg-green-700 text-white",

danger:
"bg-red-600 hover:bg-red-700 text-white",

warning:
"bg-orange-500 hover:bg-orange-600 text-white",

outline:
"border border-slate-700 text-white hover:bg-slate-800"

};




return(

<button

{

...props

}

disabled={
loading ||
props.disabled
}

className={`

flex

items-center

justify-center

gap-2

px-5

py-3

rounded-xl

font-medium

transition-all

duration-200

disabled:opacity-50

disabled:cursor-not-allowed

${fullWidth ? "w-full":""}

${couleurs[variant]}

${className}

`}

>

{

loading ?

<span>

⏳

</span>

:

icon

}



{

loading ?

"Chargement..."

:

children

}



</button>

);

}
