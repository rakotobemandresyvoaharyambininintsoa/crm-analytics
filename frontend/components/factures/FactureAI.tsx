"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Sparkles,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Target,
} from "lucide-react";

type AnalyseFinanciere = {
  resume: string;
  risques: string[];
  recommandations: string[];
  indicateurs: {
    total_factures: number;
    factures_payees: number;
    factures_en_retard: number;
    montant_total: number;
  };
  niveauRisqueGlobal: "faible" | "moyen" | "eleve";
};

type FactureAIResponse = {
  analyseFinance: AnalyseFinanciere;
};

const RISQUE_STYLE = {
  faible: "bg-emerald-500/10 ring-emerald-500/20 text-emerald-300",
  moyen: "bg-amber-500/10 ring-amber-500/20 text-amber-300",
  eleve: "bg-red-500/10 ring-red-500/20 text-red-300",
};

function ListeAvecPuces({
  titre,
  items,
  icon,
  accent,
}: {
  titre: string;
  items: string[];
  icon: React.ReactNode;
  accent: "red" | "violet";
}) {
  const styles = {
    red: "border-red-500/20 bg-red-500/[0.04] text-red-300",
    violet: "border-violet-500/20 bg-violet-500/[0.04] text-violet-300",
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`rounded-xl border p-4 ${styles[accent]}`}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {titre}
      </div>
      <ul className="space-y-2 text-sm text-white/70">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FactureAI() {
  const [data, setData] = useState<FactureAIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function charger() {
      try {
        setErreur(null);
        setLoading(true);

        const res = await fetch("/api/ai/factures", { cache: "no-store", signal: controller.signal });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error?.message || json?.error || "Erreur lors du chargement");
        }

        setData(json);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setErreur(e instanceof Error ? e.message : "Erreur IA");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    charger();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-2 text-white/50">
          <Loader2 size={18} className="animate-spin" />
          Analyse des factures...
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-300">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{erreur}</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 inline-flex items-center gap-2 text-xs text-red-200 hover:text-white"
        >
          <RefreshCw size={14} />
          Réessayer
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { analyseFinance } = data;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-2">
            <Brain size={22} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Factures AI Assistant</h2>
            <p className="text-xs text-white/40">Analyse financière Gemma</p>
          </div>
        </div>

        <span
          className={`inline-flex items-center rounded-full ring-1 px-3 py-1 text-xs font-semibold uppercase ${RISQUE_STYLE[analyseFinance.niveauRisqueGlobal]}`}
        >
          Risque {analyseFinance.niveauRisqueGlobal}
        </span>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-white/[0.02] border border-white/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400" />
            <span className="text-sm font-semibold text-white">Analyse financière</span>
          </div>

          <p className="whitespace-pre-line text-sm text-white/60">{analyseFinance.resume}</p>

          <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-white/40">
            <div>Total factures: {analyseFinance.indicateurs.total_factures}</div>
            <div>Payées: {analyseFinance.indicateurs.factures_payees}</div>
            <div>En retard: {analyseFinance.indicateurs.factures_en_retard}</div>
            <div>Montant total: {analyseFinance.indicateurs.montant_total.toLocaleString()} MGA</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ListeAvecPuces
            titre="Risques"
            items={analyseFinance.risques}
            icon={<ShieldAlert size={16} />}
            accent="red"
          />
          <ListeAvecPuces
            titre="Recommandations"
            items={analyseFinance.recommandations}
            icon={<Target size={16} />}
            accent="violet"
          />
        </div>

        <p className="text-xs text-white/30 italic">
          💡 Pour relancer une facture précise, utilisez le bouton dédié directement sur la ligne
          concernée dans le tableau ci-dessous.
        </p>
      </div>
    </div>
  );
}