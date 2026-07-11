"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  TrendingUp,
  Brain,
  Target,
  Sparkles,
} from "lucide-react";


interface RevenueData {
  mois: string;
  ca: number;
  prediction?: number;
}


interface RevenueChartProps {
  data: RevenueData[];
  objectif?: number;
  aiSummary?: string;
}



function formatMoney(value:number){

  return new Intl.NumberFormat(
    "fr-FR",
    {
      notation:"compact",
      maximumFractionDigits:1
    }
  ).format(value) + " Ar";

}



function CustomTooltip({
  active,
  payload,
  label
}:any){


  if(!active || !payload)
    return null;


  return (

    <div
      className="
      rounded-xl
      border
      border-white/10
      bg-slate-950
      p-4
      shadow-xl
      "
    >

      <p
        className="
        mb-3
        text-sm
        text-gray-400
        "
      >
        {label}
      </p>


      {
        payload.map(
          (item:any,index:number)=>(

            <div
              key={index}
              className="
              flex
              justify-between
              gap-6
              text-sm
              mb-1
              "
            >

              <span
                className="text-gray-300"
              >
                {
                  item.dataKey === "ca"
                  ?
                  "CA réel"
                  :
                  "Prévision IA"
                }
              </span>


              <span
                className="
                font-semibold
                text-white
                "
              >
                {
                  formatMoney(item.value)
                }
              </span>

            </div>

          )
        )
      }


    </div>

  );

}




export default function RevenueChart({

 data,

 objectif = 10000000,

 aiSummary =
 "L'IA analyse vos ventes et prévoit une évolution positive."

}:RevenueChartProps){


const lastRevenue =
data[data.length - 1]?.ca ?? 0;


const lastPrediction =
data[data.length - 1]?.prediction 
?? lastRevenue * 1.1;



const growth =
lastRevenue > 0
?
Math.round(
(
(lastPrediction - lastRevenue)
/ lastRevenue
)
*100
)
:
0;



const chartData =
data.map(item=>({

 ...item,

 prediction:
 item.prediction
 ??
 Math.round(
 item.ca * 1.1
 )

}));




return (

<div
className="
bg-white/[0.03]
border
border-white/10
rounded-2xl
p-6
"
>


{/* HEADER */}

<div
className="
flex
items-center
justify-between
mb-6
"
>


<div
className="
flex
items-center
gap-3
"
>

<div
className="
p-2
rounded-xl
bg-violet-500/10
"
>

<TrendingUp
className="
h-5
w-5
text-violet-400
"
/>

</div>


<div>

<h2
className="
text-lg
font-semibold
text-white
"
>
Chiffre d'affaires IA
</h2>


<p
className="
text-xs
text-gray-400
"
>
Analyse et prévision automatique
</p>


</div>


</div>



<div
className="
flex
items-center
gap-2
text-green-400
"
>

<Brain size={18}/>

<span
className="
text-sm
font-medium
"
>
+{growth}%
</span>


</div>


</div>





{/* KPI CARDS */}


<div
className="
grid
grid-cols-3
gap-3
mb-6
"
>


<div
className="
rounded-xl
bg-black/20
border
border-white/5
p-3
"
>

<p
className="
text-xs
text-gray-400
"
>
CA actuel
</p>


<p
className="
text-white
font-bold
"
>
{formatMoney(lastRevenue)}
</p>


</div>





<div
className="
rounded-xl
bg-black/20
border
border-white/5
p-3
"
>


<p
className="
text-xs
text-gray-400
"
>
Prévision IA
</p>


<p
className="
text-violet-300
font-bold
"
>
{formatMoney(lastPrediction)}
</p>


</div>






<div
className="
rounded-xl
bg-black/20
border
border-white/5
p-3
"
>


<p
className="
text-xs
text-gray-400
"
>
Objectif
</p>


<p
className="
text-blue-300
font-bold
"
>
{formatMoney(objectif)}
</p>


</div>


</div>





{/* GRAPH */}


<div
className="
h-[300px]
"
>


<ResponsiveContainer
width="100%"
height="100%"
>


<ComposedChart
data={chartData}
>


<defs>


<linearGradient
id="revenueGradient"
x1="0"
y1="0"
x2="0"
y2="1"
>


<stop
offset="0%"
stopColor="#8b5cf6"
stopOpacity={0.5}
/>


<stop
offset="100%"
stopColor="#8b5cf6"
stopOpacity={0}
/>


</linearGradient>


</defs>



<CartesianGrid
strokeDasharray="3 3"
stroke="rgba(255,255,255,0.06)"
vertical={false}
/>



<XAxis

dataKey="mois"

stroke="rgba(255,255,255,0.3)"

tick={{
fill:"rgba(255,255,255,0.5)",
fontSize:12
}}

axisLine={false}

tickLine={false}

/>




<YAxis

stroke="rgba(255,255,255,0.3)"

tick={{
fill:"rgba(255,255,255,0.5)",
fontSize:12
}}

tickFormatter={
(value)=>`${value/1000000}M`
}

axisLine={false}

tickLine={false}

/>




<Tooltip
content={<CustomTooltip/>}
/>





<Area

type="monotone"

dataKey="ca"

stroke="#8b5cf6"

fill="url(#revenueGradient)"

strokeWidth={3}

animationDuration={1500}

/>





<Line

type="monotone"

dataKey="prediction"

stroke="#22c55e"

strokeWidth={3}

strokeDasharray="8 6"

dot={{
r:4,
fill:"#22c55e"
}}

animationDuration={1800}

/>



</ComposedChart>


</ResponsiveContainer>


</div>







{/* AI SUMMARY */}


<div
className="
mt-6
rounded-xl
border
border-violet-500/20
bg-violet-500/10
p-4
"
>


<div
className="
flex
items-center
gap-2
mb-2
"
>

<Sparkles
size={18}
className="
text-violet-300
"
/>


<p
className="
text-sm
font-semibold
text-white
"
>
Résumé IA
</p>


</div>



<p
className="
text-sm
text-gray-300
"
>
{aiSummary}
</p>


</div>






</div>


);


}