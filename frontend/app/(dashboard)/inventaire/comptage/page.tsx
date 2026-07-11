"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ScanLine,
  Save,
  Camera,
  MessageSquare,
  Loader2,
  ArrowLeft,
  PackageSearch,
} from "lucide-react";
import SearchBox from "@/components/SearchBox";
import EmptyState from "@/components/EmptyState";

export default function Comptage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [lignes, setLignes] = useState<any[]>([]);
  const [recherche, setRecherche] = useState("");
  const [codeScan, setCodeScan] = useState("");
  const [comptes, setComptes] = useState<any>({});
  const [commentaires, setCommentaires] = useState<any>({});
  const [enregistrement, setEnregistrement] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    try {
      const res = await fetch(`/api/inventaires/${id}/lignes`, { cache: "no-store" });
      const data = await res.json();
      setLignes(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  function changerCompte(ligneId: number, value: string) {
    setComptes({
      ...comptes,
      [ligneId]: value === "" ? undefined : Number(value),
    });
  }

  function changerCommentaire(ligneId: number, value: string) {
    setCommentaires({
      ...commentaires,
      [ligneId]: value,
    });
  }

  function scannerCode() {
    if (!codeScan) return;

    const ligne = lignes.find((l) => l.codeBarre === codeScan || l.reference === codeScan);

    if (ligne) {
      setRecherche(ligne.nom);
    } else {
      alert("Aucun produit ne correspond à ce code");
    }

    setCodeScan("");
  }

  async function enregistrerComptage() {
    setEnregistrement(true);

    try {
      const payload = Object.keys(comptes)
        .filter((ligneId) => comptes[ligneId] !== undefined)
        .map((ligneId) => ({
          ligneId: Number(ligneId),
          stockCompte: comptes[ligneId],
          commentaire: commentaires[ligneId] || "",
        }));

      await fetch(`/api/inventaires/${id}/lignes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lignes: payload }),
      });

      router.push(`/inventaire/${id}`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement du comptage");
    }

    setEnregistrement(false);
  }

  const liste = lignes.filter((l) =>
    l.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-white/50 font-medium text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Chargement du comptage...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.push(`/inventaire/${id}`)}
            className="flex items-center justify-center h-11 w-11 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <ScanLine className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Comptage
            </h1>
            <p className="text-sm text-white/40">
              Saisissez le stock physique constaté pour chaque produit
            </p>
          </div>
        </div>

        {/* Scanner + recherche */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              className="w-full bg-white/[0.03] border border-white/10 p-4 pl-11 rounded-xl text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
              placeholder="Scanner un code-barres / QR code..."
              value={codeScan}
              onChange={(e) => setCodeScan(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && scannerCode()}
            />
          </div>

          <SearchBox
            value={recherche}
            onChange={setRecherche}
            placeholder="Rechercher un produit..."
          />
        </div>

        {/* Liste des produits */}
        <div className="space-y-3 mb-8">
          {liste.map((l) => {
            const compte = comptes[l.id];
            const ecart = compte !== undefined ? compte - l.stockSysteme : null;

            return (
              <div
                key={l.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{l.nom}</p>
                    <p className="text-xs text-white/40">
                      Réf. {l.reference} {l.emplacement ? `— ${l.emplacement}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-white/40 uppercase tracking-wide">
                        Système
                      </p>
                      <p className="font-semibold text-white">{l.stockSysteme}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                        Compté
                      </p>
                      <input
                        type="number"
                        className="w-24 bg-white/[0.03] border border-white/10 p-2 rounded-lg text-sm text-center outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                        value={compte ?? ""}
                        onChange={(e) => changerCompte(l.id, e.target.value)}
                      />
                    </div>

                    <div className="text-center min-w-[3rem]">
                      <p className="text-xs text-white/40 uppercase tracking-wide">
                        Écart
                      </p>
                      <p
                        className={
                          ecart === null
                            ? "text-white/40"
                            : ecart === 0
                            ? "text-white/60"
                            : ecart > 0
                            ? "text-emerald-400 font-semibold"
                            : "text-red-400 font-semibold"
                        }
                      >
                        {ecart === null ? "-" : ecart}
                      </p>
                    </div>

                    <button
                      className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/[0.03] border border-white/10 text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
                      title="Ajouter une photo"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {ecart !== null && ecart !== 0 && (
                  <div className="relative mt-4">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input
                      className="w-full bg-white/[0.03] border border-white/10 p-2.5 pl-9 rounded-lg text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                      placeholder="Commentaire sur l'écart (recommandé)"
                      value={commentaires[l.id] || ""}
                      onChange={(e) => changerCommentaire(l.id, e.target.value)}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {liste.length === 0 && (
            <EmptyState
              icon={PackageSearch}
              titre="Aucun produit ne correspond à cette recherche"
              description="Essaie un autre terme, ou scanne directement un code-barres."
            />
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={enregistrerComptage}
            disabled={enregistrement}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {enregistrement ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer le comptage
          </button>
        </div>
      </div>
    </div>
  );
}
