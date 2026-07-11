"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ChevronRight, Loader2 } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";

const PAR_PAGE = 10;

const STATUT_STYLES: Record<string, string> = {
  Brouillon: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
  "En cours": "bg-blue-500/10 text-blue-300 ring-blue-500/20",
  "À valider": "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  Validé: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  Annulé: "bg-red-500/10 text-red-300 ring-red-500/20",
};

export default function Historique() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    try {
      const res = await fetch("/api/inventaires/historique", { cache: "no-store" });
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  const liste = sessions.filter(
    (s) =>
      s.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      s.responsable?.nom?.toLowerCase().includes(recherche.toLowerCase())
  );

  const totalPages = Math.ceil(liste.length / PAR_PAGE);
  const listePage = liste.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Historique des inventaires
            </h1>
            <p className="text-sm text-white/40">
              Toutes les sessions passées et en cours
            </p>
          </div>
        </div>

        <SearchBox
          value={recherche}
          onChange={(v) => {
            setRecherche(v);
            setPage(1);
          }}
          placeholder="Rechercher par nom ou responsable..."
          className="mb-6"
        />

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center gap-3 text-white/50 text-sm py-10 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
              Chargement...
            </div>
          ) : liste.length === 0 ? (
            <EmptyState
              icon={History}
              titre="Aucune session trouvée"
              description="Lance ta première session d'inventaire depuis le tableau de bord."
            />
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs uppercase tracking-wide">
                    <th className="text-left font-medium pb-3">Session</th>
                    <th className="text-left font-medium pb-3">Entrepôt</th>
                    <th className="text-left font-medium pb-3">Responsable</th>
                    <th className="text-left font-medium pb-3">Date</th>
                    <th className="text-left font-medium pb-3">Produits</th>
                    <th className="text-left font-medium pb-3">Écarts</th>
                    <th className="text-left font-medium pb-3">Statut</th>
                    <th className="text-left font-medium pb-3"></th>
                  </tr>
                </thead>

                <tbody>
                  {listePage.map((s) => (
                    <tr
                      key={s.id}
                      className="border-t border-white/10 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-3 font-medium text-white">{s.nom}</td>
                      <td className="text-white/60">{s.entrepot?.nom || "-"}</td>
                      <td className="text-white/60">{s.responsable?.nom || "-"}</td>
                      <td className="text-white/60">
                        {new Date(s.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="text-white/60">{s.nbProduits ?? "-"}</td>
                      <td className="text-white/60">{s.nbEcarts ?? 0}</td>
                      <td>
                        <span
                          className={`inline-flex items-center rounded-full ring-1 px-2.5 py-1 text-xs font-semibold ${
                            STATUT_STYLES[s.statut] ?? STATUT_STYLES["Brouillon"]
                          }`}
                        >
                          {s.statut}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/inventaire/${s.id}`}
                          className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors"
                          title="Ouvrir"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
