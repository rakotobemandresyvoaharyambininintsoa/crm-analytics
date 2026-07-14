"use client";

import {
  Users,
  Package,
  Target,
  Receipt,
  Gem,
  Boxes,
  Rocket,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";

import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import AIInsights from "@/components/dashboard/AIInsights";
import StockAlert from "@/components/dashboard/StockAlert";
import TopProducts from "@/components/dashboard/TopProducts";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex items-center gap-3 text-white/50 text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Chargement du dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            CRM Dashboard AI
          </h1>
          <p className="text-sm text-white/40">Vue intelligente de votre activité</p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard
          titre="Clients"
          valeur={data.clients ?? 0}
          icone={<Users size={18} />}
          evolution={data.evolutions?.clients}
          insight={data.insights?.clients}
        />
        <StatCard
          titre="Produits"
          valeur={data.produits ?? 0}
          icone={<Package size={18} />}
          insight={data.insights?.produits}
        />
        <StatCard
          titre="Opportunités"
          valeur={data.opportunites ?? 0}
          icone={<Target size={18} />}
          evolution={data.evolutions?.opportunites}
          insight={data.insights?.opportunites}
        />
        <StatCard
          titre="Factures"
          valeur={data.factures ?? 0}
          icone={<Receipt size={18} />}
          evolution={data.evolutions?.factures}
          insight={data.insights?.factures}
        />
        <StatCard
          titre="Stock"
          valeur={`${data.stock ?? 0} unités`}
          icone={<Boxes size={18} />}
          evolution={data.evolutions?.stock}
          insight={data.insights?.stock}
        />
        <StatCard
          titre="Valeur stock"
          valeur={`${(data.valeurStock ?? 0).toLocaleString()} Ar`}
          icone={<Gem size={18} />}
          insight={data.insights?.valeurStock}
        />
      </div>

      {/* REVENUE + AI — AIInsights se charge tout seul, plus besoin de lui passer de données */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <RevenueChart
          data={data.ventes ?? []}
          objectif={data.objectifCA}
          aiSummary={data.revenueInsight}
        />
        <AIInsights />
      </div>

      {/* STOCK + PRODUITS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <StockAlert produits={data.produitsAlertes ?? []} />
        <TopProducts produits={data.topProduits ?? []} />
      </div>

      {/* FACTURES + ACTIVITES */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <RecentInvoices invoices={data.recentInvoices ?? []} />
        <ActivityTimeline activities={data.activities ?? []} />
      </div>
    </div>
  );
}
