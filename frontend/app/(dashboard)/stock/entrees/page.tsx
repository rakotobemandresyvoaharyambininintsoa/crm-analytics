"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, CheckCircle2 } from "lucide-react";

export default function Entrees() {
  const [produits, setProduits] = useState<any[]>([]);

  const [produitId, setProduitId] = useState("");
  const [quantite, setQuantite] = useState("");
  const [commentaire, setCommentaire] = useState("");

  useEffect(() => {
    chargerProduits();
  }, []);

  async function chargerProduits() {
    const res = await fetch("/api/produits");
    const data = await res.json();
    setProduits(data);
  }

  async function ajouterEntree() {
    await fetch("/api/mouvements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produitId,
        quantite,
        commentaire,
      }),
    });

    alert("Entrée enregistrée");

    setQuantite("");
    setCommentaire("");

    chargerProduits();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <ArrowDownToLine className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Entrée stock
            </h1>
            <p className="text-sm text-white/40">
              Enregistrez une réception de marchandise
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

            <input
              className="bg-white/[0.03] border border-white/10 p-3 rounded-lg w-full text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
              placeholder="Commentaire"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>

          <button
            onClick={ajouterEntree}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg shadow-emerald-500/20 px-6 py-3 rounded-xl mt-5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <CheckCircle2 className="h-4 w-4" />
            Valider l'entrée
          </button>
        </div>
      </div>
    </div>
  );
}

