"use client";

import { useEffect, useState } from "react";
import { History, Search, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from "lucide-react";

const TYPE_STYLES: Record<string, { badge: string; icon: any }> = {
  ENTREE: { badge: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20", icon: ArrowDownToLine },
  SORTIE: { badge: "bg-red-500/10 text-red-300 ring-red-500/20", icon: ArrowUpFromLine },
};

export default function Mouvements() {
  const [mouvements, setMouvements] = useState<any[]>([]);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch("/api/mouvements");
    const data = await res.json();
    setMouvements(data);
  }

  const liste = mouvements.filter((m) =>
    m.produit?.nom?.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Historique du stock
            </h1>
            <p className="text-sm text-white/40">
              Toutes les entrées et sorties enregistrées
            </p>
          </div>
        </div>

        {/* Recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            className="w-full bg-white/[0.03] border border-white/10 p-4 pl-11 rounded-xl text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            placeholder="Rechercher un produit..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-wide">
                <th className="text-left font-medium pb-3">Date</th>
                <th className="text-left font-medium pb-3">Produit</th>
                <th className="text-left font-medium pb-3">Type</th>
                <th className="text-left font-medium pb-3">Quantité</th>
                <th className="text-left font-medium pb-3">Commentaire</th>
              </tr>
            </thead>

            <tbody>
              {liste.map((m) => {
                const style =
                  TYPE_STYLES[m.type] ??
                  { badge: "bg-amber-500/10 text-amber-300 ring-amber-500/20", icon: RefreshCw };
                const Icon = style.icon;

                return (
                  <tr
                    key={m.id}
                    className="border-t border-white/10 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-3 text-white/60">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="font-medium text-white">{m.produit?.nom}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full ring-1 px-2.5 py-1 text-xs font-semibold ${style.badge}`}
                      >
                        <Icon className="h-3 w-3" />
                        {m.type}
                      </span>
                    </td>
                    <td className="text-white/60">{m.quantite}</td>
                    <td className="text-white/60">{m.commentaire}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

