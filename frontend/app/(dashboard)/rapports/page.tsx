"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  BarChart3,
  TrendingUp,
  Trophy,
  Boxes,
  Download,
  FileText,
} from "lucide-react";

const EvolutionChart = dynamic(() => import("@/components/rapports/EvolutionCharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-xl bg-white/[0.03] border border-white/10 animate-pulse" />
  ),
});

export default function Rapports() {
  const [rapport, setRapport] = useState<any>({
    chiffreAffaires: 0,
    topClients: [],
    produits: [],
  });

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch("/api/rapports");
    const data = await res.json();
    setRapport(data);
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
                Rapports
              </h1>
              <p className="text-sm text-white/40">
                Analyse de votre performance
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                window.location.href = "/api/export/excel";
              }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </button>

            <button
              onClick={() => {
                window.location.href = "/api/export/pdf";
              }}
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card
            titre="Chiffre d'affaires"
            valeur={rapport.chiffreAffaires.toLocaleString() + " Ar"}
            icon={TrendingUp}
            accent="emerald"
          />
          <Card
            titre="Produits"
            valeur={rapport.produits.length}
            icon={Boxes}
            accent="sky"
          />
          <Card
            titre="Clients"
            valeur={rapport.topClients.length}
            icon={Trophy}
            accent="violet"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Evolution CA */}
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">
                Évolution du CA
              </h2>
            </div>

            <EvolutionChart data={rapport.topClients} />
          </div>

          {/* Top clients */}
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Top clients</h2>
            </div>

            <div className="space-y-3">
              {rapport.topClients.map((c: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/[0.03] border border-white/10 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-300 text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-white">{c.nom}</span>
                  </div>
                  <span className="text-white/60 text-sm tabular-nums">
                    {c.ca.toLocaleString()} Ar
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Etat stock */}
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Boxes className="h-5 w-5 text-sky-400" />
              <h2 className="text-lg font-semibold text-white">État du stock</h2>
            </div>

            <div className="divide-y divide-white/10">
              {rapport.produits.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-white/70">{p.nom}</span>
                  <span className="font-semibold text-white tabular-nums">
                    {p.quantite}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ACCENTS: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
};

function Card({
  titre,
  valeur,
  icon: Icon,
  accent,
}: {
  titre: string;
  valeur: any;
  icon: any;
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
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{titre}</p>
      <h2 className="text-2xl font-bold text-white mt-1.5 tabular-nums">{valeur}</h2>
    </div>
  );
}

