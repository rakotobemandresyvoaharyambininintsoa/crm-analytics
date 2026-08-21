"use client";

import StatCard from "@/components/dashboard/StatCard";
import { Package, Wallet, AlertTriangle } from "lucide-react";

interface ProduitStatsProps {
  produits: number;
  valeurStock: number;
  alertes: number;
}

export default function ProduitStats({ produits, valeurStock, alertes }: ProduitStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <StatCard titre="Produits" valeur={produits} icone={<Package size={20} />} color="blue" />
      <StatCard
        titre="Valeur Stock"
        valeur={valeurStock.toLocaleString() + " Ar"}
        icone={<Wallet size={20} />}
        color="green"
      />
      <StatCard titre="Alertes" valeur={alertes} icone={<AlertTriangle size={20} />} color="red" />
    </div>
  );
}
