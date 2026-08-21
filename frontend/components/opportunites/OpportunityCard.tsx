import { DollarSign, Target } from "lucide-react";

export default function OpportuniteCard({ o, changer }: any) {
  return (
    <button
      type="button"
      onClick={changer}
      className="bg-slate-800 p-4 rounded-xl cursor-pointer mb-3 w-full text-left"
    >
      <h3 className="font-bold">{o.titre}</h3>

      <p className="flex items-center gap-1.5 text-sm text-white/70 mt-1">
        <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
        {o.montant} Ar
      </p>

      <p className="flex items-center gap-1.5 text-sm text-white/70">
        <Target className="h-3.5 w-3.5 text-violet-400" />
        {o.probabilite}%
      </p>
    </button>
  )
}