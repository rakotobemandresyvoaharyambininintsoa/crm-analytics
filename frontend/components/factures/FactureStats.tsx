import { Receipt, Wallet, CheckCircle2, type LucideIcon } from "lucide-react";

export default function FactureStats({ data }: any) {
  const ca = data.reduce((a: any, b: any) => a + b.montant, 0);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card
        t="Factures"
        v={data.length}
        icon={Receipt}
        accent="violet"
      />
      <Card
        t="Chiffre d'affaires"
        v={ca.toLocaleString() + " Ar"}
        icon={Wallet}
        accent="emerald"
      />
      <Card
        t="Payées"
        v={data.filter((f: any) => f.statut === "Payée").length}
        icon={CheckCircle2}
        accent="sky"
      />
    </div>
  );
}

const ACCENTS: Record<string, { bg: string; text: string; ring: string }> = {
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
};

function Card({
  t,
  v,
  icon: Icon,
  accent,
}: {
  t: string;
  v: any;
  icon: LucideIcon;
  accent: keyof typeof ACCENTS;
}) {
  const c = ACCENTS[accent];

  return (
    <div className="bg-white/[0.03] border border-white/10 p-5 rounded-xl hover:border-white/20 hover:bg-white/[0.05] transition-colors">
      <div
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.bg} ring-1 ${c.ring} mb-4`}
      >
        <Icon className={`h-4 w-4 ${c.text}`} />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{t}</p>
      <h2 className="text-2xl font-bold text-white mt-1.5 tabular-nums">{v}</h2>
    </div>
  );
}
