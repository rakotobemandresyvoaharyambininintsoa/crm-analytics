"use client";

import { Users, Building2, Phone, type LucideIcon } from "lucide-react";

export default function ClientStats({ clients }: any) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card titre="Clients" valeur={clients.length} icon={Users} accent="violet" />
      <Card
        titre="Entreprises"
        valeur={clients.filter((c: any) => c.entreprise).length}
        icon={Building2}
        accent="sky"
      />
      <Card
        titre="Contacts"
        valeur={clients.filter((c: any) => c.telephone).length}
        icon={Phone}
        accent="emerald"
      />
    </div>
  );
}

const ACCENTS: Record<string, { bg: string; text: string; ring: string }> = {
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
};

function Card({
  titre,
  valeur,
  icon: Icon,
  accent,
}: {
  titre: string;
  valeur: any;
  icon: LucideIcon;
  accent: keyof typeof ACCENTS;
}) {
  const c = ACCENTS[accent];

  return (
    <div className="bg-white/[0.03] border border-white/10 p-5 rounded-xl hover:border-white/20 hover:bg-white/[0.05] transition-colors">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.bg} ring-1 ${c.ring} mb-4`}>
        <Icon className={`h-4 w-4 ${c.text}`} />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{titre}</p>
      <h2 className="text-2xl font-bold text-white mt-1.5 tabular-nums">{valeur}</h2>
    </div>
  );
}
