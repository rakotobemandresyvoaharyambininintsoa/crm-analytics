"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import EmptyState from "@/components/EmptyState";
import {
  ClipboardList,
  CheckCircle2,
  PackageSearch,
  AlertTriangle,
  Wallet,
  Plus,
  History,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  User,
  Calendar,
  Loader2,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

const STATUT_STYLES: Record<string, string> = {
  Brouillon: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
  "En cours": "bg-blue-500/10 text-blue-300 ring-blue-500/20",
  "À valider": "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  Validé: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  Annulé: "bg-red-500/10 text-red-300 ring-red-500/20",
};

export default function InventaireDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    try {
      const res = await fetch("/api/inventaires/dashboard", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Erreur API inventaire");
      }

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);

      setData({
        enCours: 0,
        termines: 0,
        produitsControles: 0,
        produitsEcarts: 0,
        valeurEcarts: 0,
        dernierInventaire: null,
        evolution: [],
        sessions: [],
      });
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-white/50 font-medium text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Chargement de l'inventaire...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Inventaire
              </h1>
              <p className="text-sm text-white/40">
                Contrôlez et ajustez votre stock physique
              </p>
            </div>
          </div>

          <Link
            href="/inventaire/nouveau"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Nouvelle session
          </Link>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card titre="En cours" valeur={data.enCours} icon={ClipboardList} accent="blue" />
          <Card titre="Terminés" valeur={data.termines} icon={CheckCircle2} accent="emerald" />
          <Card
            titre="Produits contrôlés"
            valeur={data.produitsControles}
            icon={PackageSearch}
            accent="violet"
          />
          <Card
            titre="Produits en écart"
            valeur={data.produitsEcarts}
            icon={AlertTriangle}
            accent="amber"
          />
          <Card
            titre="Valeur des écarts"
            valeur={data.valeurEcarts.toLocaleString() + " Ar"}
            icon={Wallet}
            accent="red"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Evolution des écarts */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">
                Évolution des écarts
              </h2>
            </div>

            {data.evolution.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                titre="Aucune donnée disponible"
                description="L'évolution des écarts apparaîtra ici après quelques sessions."
              />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.evolution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="mois"
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#e2e8f0",
                    }}
                  />
                  <defs>
                    <linearGradient id="ecartBarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="ecart"
                    fill="url(#ecartBarFill)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Dernier inventaire */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <History className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">
                Dernier inventaire
              </h2>
            </div>

            {!data.dernierInventaire ? (
              <EmptyState
                icon={History}
                titre="Aucun inventaire réalisé"
                description="Lance ta première session pour voir apparaître son résumé ici."
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    {data.dernierInventaire.nom}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full ring-1 px-2.5 py-1 text-xs font-semibold ${
                      STATUT_STYLES[data.dernierInventaire.statut] ??
                      STATUT_STYLES["Brouillon"]
                    }`}
                  >
                    {data.dernierInventaire.statut}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Calendar className="h-4 w-4" />
                  {new Date(data.dernierInventaire.date).toLocaleDateString(
                    "fr-FR"
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-white/50">
                  <User className="h-4 w-4" />
                  {data.dernierInventaire.responsable || "-"}
                </div>

                <Link
                  href={`/inventaire/${data.dernierInventaire.id}`}
                  className="inline-flex items-center gap-1 text-violet-400 text-sm font-semibold hover:text-violet-300 transition-colors"
                >
                  Voir le détail
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sessions en cours */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-8 overflow-auto">
          <div className="flex items-center gap-2 mb-5">
            <ClipboardList className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">
              Sessions récentes
            </h2>
          </div>

          {data.sessions.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              titre="Aucune session d'inventaire pour le moment"
            
              action={{ label: "Nouvelle session", onClick: () => (window.location.href = "/inventaire/nouveau") }}
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-wide">
                  <th className="text-left font-medium pb-3">Session</th>
                  <th className="text-left font-medium pb-3">Entrepôt</th>
                  <th className="text-left font-medium pb-3">Responsable</th>
                  <th className="text-left font-medium pb-3">Date</th>
                  <th className="text-left font-medium pb-3">Statut</th>
                  <th className="text-left font-medium pb-3"></th>
                </tr>
              </thead>

              <tbody>
                {data.sessions.map((s: any) => (
                  <tr
                    key={s.id}
                    className="border-t border-white/10 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-3 font-medium text-white">{s.nom}</td>
                    <td className="text-white/60">{s.entrepot || "-"}</td>
                    <td className="text-white/60">{s.responsable || "-"}</td>
                    <td className="text-white/60">
                      {new Date(s.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center rounded-full ring-1 px-2.5 py-1 text-xs font-semibold ${
                          STATUT_STYLES[s.statut] ?? STATUT_STYLES["Brouillon"]
                        }`}
                      >
                        {s.statut}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/inventaire/${s.id}`}
                        className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors"
                        title="Ouvrir"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Menu rapide */}
        <div className="grid md:grid-cols-4 gap-4">
          <Menu href="/inventaire/nouveau" icon={Plus} titre="Nouvelle session" accent="violet" />
          <Menu href="/inventaire/historique" icon={History} titre="Historique" accent="sky" />
          <Menu href="/inventaire/audit" icon={ShieldCheck} titre="Audit" accent="amber" />
          <Menu href="/inventaire/rapports" icon={BarChart3} titre="Rapports" accent="emerald" />
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-4">
          <Menu
            href="/inventaire/parametres"
            icon={SlidersHorizontal}
            titre="Paramètres"
            accent="blue"
          />
        </div>
      </div>
    </div>
  );
}

const ACCENTS: Record<string, { bg: string; text: string; ring: string }> = {
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
  red: { bg: "bg-red-500/10", text: "text-red-400", ring: "ring-red-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", ring: "ring-blue-500/20" },
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

function Menu({
  href,
  icon: Icon,
  titre,
  accent,
}: {
  href: string;
  icon: LucideIcon;
  titre: string;
  accent: keyof typeof ACCENTS;
}) {
  const c = ACCENTS[accent];

  return (
    <Link
      href={href}
      className="bg-white/[0.03] border border-white/10 p-6 rounded-xl hover:border-white/20 hover:bg-white/[0.05] transition-colors block"
    >
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ring-1 ${c.ring} mb-4`}>
        <Icon className={`h-5 w-5 ${c.text}`} />
      </div>
      <h2 className="text-base font-semibold text-white">{titre}</h2>
    </Link>
  );
}
