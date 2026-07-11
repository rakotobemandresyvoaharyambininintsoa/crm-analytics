"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import EmptyState from "@/components/EmptyState";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Target,
  Download,
  FileText,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";

const PIE_COLORS = ["#ef4444", "#10b981", "#64748b"];

export default function Rapports() {
  const [rapport, setRapport] = useState<any>({
    valeurPertes: 0,
    valeurGains: 0,
    tauxPrecision: 0,
    evolution: [],
    repartitionEcarts: [],
    performanceEquipes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    try {
      const res = await fetch("/api/inventaires/rapports", { cache: "no-store" });
      const data = await res.json();
      setRapport(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-white/50 font-medium text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Chargement des rapports...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Rapports d'inventaire
              </h1>
              <p className="text-sm text-white/40">
                Analyse de la précision et des écarts de stock
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => (window.location.href = "/api/inventaires/export/excel")}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </button>

            <button
              onClick={() => (window.location.href = "/api/inventaires/export/pdf")}
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors"
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>

            <button
              onClick={() => (window.location.href = "/api/inventaires/export/csv")}
              className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/[0.05] transition-colors"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card
            titre="Valeur des pertes"
            valeur={rapport.valeurPertes.toLocaleString() + " Ar"}
            icon={TrendingDown}
            accent="red"
          />
          <Card
            titre="Valeur des gains"
            valeur={rapport.valeurGains.toLocaleString() + " Ar"}
            icon={TrendingUp}
            accent="emerald"
          />
          <Card
            titre="Taux de précision"
            valeur={rapport.tauxPrecision + " %"}
            icon={Target}
            accent="violet"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Evolution des écarts */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">
              Évolution mensuelle des écarts
            </h2>

            {rapport.evolution.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                titre="Aucune donnée disponible"
                description="L'évolution apparaîtra après quelques sessions d'inventaire."
              />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={rapport.evolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
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
                    <linearGradient id="rapportInvBarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="ecart" fill="url(#rapportInvBarFill)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Répartition des écarts */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">
              Répartition des écarts
            </h2>

            {rapport.repartitionEcarts.length === 0 ? (
              <EmptyState
                icon={Target}
                titre="Aucune donnée disponible"
                description="La répartition des écarts apparaîtra après quelques sessions."
              />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={rapport.repartitionEcarts}
                    dataKey="valeur"
                    nameKey="label"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {rapport.repartitionEcarts.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Performance des équipes */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">
            Performance des équipes
          </h2>

          {rapport.performanceEquipes.length === 0 ? (
            <EmptyState
              titre="Aucune donnée disponible"
              description="La performance par équipe apparaîtra après quelques sessions comptées."
            />
          ) : (
            <div className="space-y-3">
              {rapport.performanceEquipes.map((e: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/[0.03] border border-white/10 p-4 rounded-lg"
                >
                  <span className="font-medium text-white">{e.nom}</span>
                  <span className="text-sm text-white/60">
                    Précision : <span className="text-emerald-400 font-semibold">{e.precision}%</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ACCENTS: Record<string, { bg: string; text: string; ring: string }> = {
  red: { bg: "bg-red-500/10", text: "text-red-400", ring: "ring-red-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
};

function Card({ titre, valeur, icon: Icon, accent }: any) {
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
