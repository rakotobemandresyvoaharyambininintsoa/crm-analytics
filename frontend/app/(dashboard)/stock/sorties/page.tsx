"use client";

import { useEffect, useState } from "react";
import { ArrowUpFromLine, CheckCircle2 } from "lucide-react";

export default function Sorties() {
  const [produits, setProduits] = useState<any[]>([]);

  const [produitId, setProduitId] = useState("");
  const [quantite, setQuantite] = useState("");
  const [motif, setMotif] = useState("");

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch("/api/produits");
    const data = await res.json();
    setProduits(data);
  }

  async function sortie() {
    const res = await fetch("/api/mouvements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produitId,
        quantite,
        commentaire: motif,
        type: "SORTIE",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Sortie enregistrée");

    setQuantite("");
    setMotif("");

    charger();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <ArrowUpFromLine className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Sortie stock
            </h1>
            <p className="text-sm text-white/40">
              Enregistrez une sortie de marchandise
            </p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-xl max-w-xl">
          <div className="space-y-3">
            <select
              className="bg-white/[0.03] border border-white/10 p-3 rounded-lg w-full text-sm text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
              value={produitId}
              onChange={(e) => setProduitId(e.target.value)}
            >
              <option className="bg-slate-900">Choisir produit</option>
              {produits.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.nom} (Stock:{p.quantite})
                </option>
              ))}
            </select>

            <input
              className="bg-white/[0.03] border border-white/10 p-3 rounded-lg w-full text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
              placeholder="Quantité"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
            />

            <select
              className="bg-white/[0.03] border border-white/10 p-3 rounded-lg w-full text-sm text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
            >
              <option className="bg-slate-900">Motif</option>
              <option className="bg-slate-900">Vente</option>
              <option className="bg-slate-900">Perte</option>
              <option className="bg-slate-900">Retour</option>
              <option className="bg-slate-900">Correction</option>
            </select>
          </div>

          <button
            onClick={sortie}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/20 px-6 py-3 rounded-xl mt-5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <CheckCircle2 className="h-4 w-4" />
            Valider la sortie
          </button>
        </div>
      </div>
    </div>
  );
}

