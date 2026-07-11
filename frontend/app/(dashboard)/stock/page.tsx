"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Wallet,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  ClipboardList,
  Boxes,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import StockAI from "@/components/stock/StockAI";
export default function StockDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    try {
      const res = await fetch("/api/stock/dashboard", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Erreur API stock");
      }

      const json = await res.json();

      setData(json);
      setLoading(false);
    } catch (error) {
      console.error(error);

      setData({
        totalProduits: 0,
        valeurStock: 0,
        alertes: 0,
        entrees: 0,
        sorties: 0,
      });

      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-white/50 font-medium text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Chargement du stock...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Stock
            </h1>
            <p className="text-sm text-white/40">
              Vue d'ensemble de votre inventaire
            </p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <Card titre="Produits" valeur={data.totalProduits} icon={Package} accent="violet" />
          <Card
            titre="Valeur stock"
            valeur={data.valeurStock.toLocaleString() + " Ar"}
            icon={Wallet}
            accent="emerald"
          />
          <Card titre="Alertes" valeur={data.alertes} icon={AlertTriangle} accent="red" />
          <Card titre="Entrées" valeur={data.entrees} icon={ArrowDownToLine} accent="sky" />
          <Card titre="Sorties" valeur={data.sorties} icon={ArrowUpFromLine} accent="amber" />
        </div>
        <StockAI />
        {/* Menu */}
        <div className="grid md:grid-cols-3 gap-4">
          <Menu href="/stock/produits" icon={Package} titre="Produits" accent="violet" />
          <Menu href="/stock/entrees" icon={ArrowDownToLine} titre="Entrées" accent="sky" />
          <Menu href="/stock/sorties" icon={ArrowUpFromLine} titre="Sorties" accent="amber" />
          <Menu href="/stock/mouvements" icon={History} titre="Mouvements" accent="blue" />
          <Menu href="/stock/inventaire" icon={ClipboardList} titre="Inventaire" accent="emerald" />
          <Menu href="/stock/alertes" icon={AlertTriangle} titre="Alertes" accent="red" />
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
      <h2 className="text-lg font-semibold text-white">{titre}</h2>
    </Link>
  );
}

