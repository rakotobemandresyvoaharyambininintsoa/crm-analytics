"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Users,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Target,
  Lightbulb,
} from "lucide-react";

type TopClient = {
  id: number;
  nom: string;
  entreprise?: string | null;
  chiffreAffaire: number;
  opportunites: number;
};

type ClientInactif = {
  id: number;
  nom: string;
  entreprise?: string | null;
  email?: string | null;
};

// ✅ CORRIGÉ : correspond exactement à ce que retourne réellement l'API
// (un objet structuré, pas une chaîne de texte)
type AnalyseIA = {
  resume: string;
  risques: string[];
  actions_prioritaires: string[];
  opportunites: string[];
  confidence: number;
};

type ClientAIData = {
  score: number;
  nombreClientsInactifs: number;
  nouveauxClients: number;
  clientsInactifs: ClientInactif[];
  topClients: TopClient[];
  analyseIA: AnalyseIA;
};

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "Moyen";
  return "À améliorer";
}

function Card({
  titre,
  valeur,
  icon,
}: {
  titre: string;
  valeur: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-3 text-violet-400">{icon}</div>
      <p className="text-xs uppercase text-white/40">{titre}</p>
      <p className="mt-1 text-2xl font-bold text-white">{valeur}</p>
    </div>
  );
}

function ListeAvecPuces({
  titre,
  items,
  icon,
  accent,
}: {
  titre: string;
  items: string[];
  icon: React.ReactNode;
  accent: "red" | "violet" | "emerald";
}) {
  const styles = {
    red: "border-red-500/20 bg-red-500/[0.04] text-red-300",
    violet: "border-violet-500/20 bg-violet-500/[0.04] text-violet-300",
    emerald: "border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-300",
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`rounded-xl border p-4 ${styles[accent]}`}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {titre}
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-white/70">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ClientAI() {
  const [data, setData] = useState<ClientAIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function charger(signal?: AbortSignal) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/clients", { cache: "no-store", signal });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error?.message || json?.error || "Erreur API");
      }

      setData(json);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    charger(controller.signal);
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-white/50">
        <Loader2 className="mr-2 animate-spin" />
        Analyse clients IA...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-100">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} />
          <p className="font-semibold">Impossible de charger l'analyse.</p>
        </div>
        <p className="mt-2 text-sm text-red-100/80">{error}</p>
        <button
          onClick={() => charger()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
        >
          <RefreshCw size={16} />
          Réessayer
        </button>
      </div>
    );
  }

  if (!data) return null;

  const analyse = data.analyseIA;

  return (
    <div className="space-y-6">
      {/* Score global */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-3">
            <Brain className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Client Intelligence Center</h2>
            <p className="text-sm text-white/40">Analyse commerciale par IA</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card titre="Score santé" valeur={`${data.score}/100`} icon={<TrendingUp />} />
          <Card titre="Clients inactifs" valeur={data.nombreClientsInactifs} icon={<AlertTriangle />} />
          <Card titre="Nouveaux clients" valeur={data.nouveauxClients} icon={<Users />} />
        </div>

        <p className="mt-4 text-sm text-white/50">
          Statut : <span className="ml-2 font-semibold text-white">{getScoreLabel(data.score)}</span>
        </p>
      </div>

      {/* Analyse IA structurée */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-300" size={20} />
            <h3 className="font-semibold text-white">Recommandation IA</h3>
          </div>
          {typeof analyse?.confidence === "number" && (
            <span className="rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 px-2.5 py-1 text-xs font-medium text-violet-300">
              Confiance : {analyse.confidence}%
            </span>
          )}
        </div>

        <p className="mb-5 whitespace-pre-line text-sm leading-relaxed text-white/70">
          {analyse?.resume || "Aucun résumé disponible."}
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <ListeAvecPuces
            titre="Risques"
            items={analyse?.risques ?? []}
            icon={<ShieldAlert size={16} />}
            accent="red"
          />
          <ListeAvecPuces
            titre="Actions prioritaires"
            items={analyse?.actions_prioritaires ?? []}
            icon={<Target size={16} />}
            accent="violet"
          />
          <ListeAvecPuces
            titre="Opportunités"
            items={analyse?.opportunites ?? []}
            icon={<Lightbulb size={16} />}
            accent="emerald"
          />
        </div>
      </div>

      {/* Top clients */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="mb-5 font-semibold text-white">Top clients (CA réellement encaissé)</h3>
        {data.topClients.length === 0 ? (
          <p className="text-sm text-white/40">Aucun client avec facture payée pour l'instant.</p>
        ) : (
          <div className="space-y-3">
            {data.topClients.map((client) => (
              <div
                key={client.id}
                className="flex justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div>
                  <p className="font-medium text-white">{client.nom}</p>
                  <p className="text-xs text-white/40">{client.entreprise || "Client"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-violet-300">
                    {client.chiffreAffaire.toLocaleString()} Ar
                  </p>
                  <p className="text-xs text-white/40">{client.opportunites} opportunités</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}