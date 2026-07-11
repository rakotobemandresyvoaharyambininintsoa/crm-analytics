"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ShoppingCart, CheckCircle2 } from "lucide-react";

export default function Alertes() {
  const [produits, setProduits] = useState<any[]>([]);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch("/api/produits");
    const data = await res.json();
    setProduits(data);
  }

  const alertes = produits
    .filter((p) => p.quantite <= p.seuilAlerte)
    .sort((a, b) => a.quantite - b.quantite);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Alertes stock
            </h1>
            <p className="text-sm text-white/40">
              Produits sous le seuil minimum
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {alertes.map((p) => (
            <div
              key={p.id}
              className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl"
            >
              <h2 className="text-lg font-semibold text-white">{p.nom}</h2>

              <p className="mt-3 text-sm text-white/60">
                Stock :{" "}
                <span className="text-red-300 font-semibold">
                  {p.quantite}
                </span>
              </p>

              <p className="text-sm text-white/60">
                Minimum : <span className="text-white/80">{p.seuilAlerte}</span>
              </p>

              <button className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-2 rounded-lg mt-4 text-sm font-semibold hover:bg-red-500/20 transition-colors">
                <ShoppingCart className="h-4 w-4" />
                Commander
              </button>
            </div>
          ))}
        </div>

        {alertes.length === 0 && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-6 rounded-xl">
            <CheckCircle2 className="h-4 w-4" />
            Aucun stock faible
          </div>
        )}
      </div>
    </div>
  );
}

