"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";

const PAR_PAGE = 15;

export default function Audit() {
  const [logs, setLogs] = useState<any[]>([]);
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    try {
      const res = await fetch("/api/inventaires/audit", { cache: "no-store" });
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  const liste = logs.filter(
    (l) =>
      l.utilisateur?.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
      l.action?.toLowerCase().includes(recherche.toLowerCase())
  );

  const totalPages = Math.ceil(liste.length / PAR_PAGE);
  const listePage = liste.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Journal d'audit
            </h1>
            <p className="text-sm text-white/40">
              Traçabilité complète des actions sur l'inventaire
            </p>
          </div>
        </div>

        <SearchBox
          value={recherche}
          onChange={(v) => {
            setRecherche(v);
            setPage(1);
          }}
          placeholder="Rechercher par utilisateur ou action..."
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
              icon={ShieldCheck}
              titre="Aucune entrée d'audit trouvée"
              description="Chaque action sur l'inventaire (comptage, validation, ajustement) sera tracée ici."
            />
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs uppercase tracking-wide">
                    <th className="text-left font-medium pb-3">Date / Heure</th>
                    <th className="text-left font-medium pb-3">Utilisateur</th>
                    <th className="text-left font-medium pb-3">Action</th>
                    <th className="text-left font-medium pb-3">Ancienne valeur</th>
                    <th className="text-left font-medium pb-3">Nouvelle valeur</th>
                    <th className="text-left font-medium pb-3">Adresse IP</th>
                  </tr>
                </thead>

                <tbody>
                  {listePage.map((l) => (
                    <tr
                      key={l.id}
                      className="border-t border-white/10 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-3 text-white/60">
                        {new Date(l.createdAt).toLocaleString("fr-FR")}
                      </td>
                      <td className="font-medium text-white">
                        {l.utilisateur?.nom || "-"}
                      </td>
                      <td>
                        <span className="inline-flex items-center rounded-full ring-1 bg-violet-500/10 text-violet-300 ring-violet-500/20 px-2.5 py-1 text-xs font-semibold">
                          {l.action}
                        </span>
                      </td>
                      <td className="text-white/60">{l.ancienneValeur ?? "-"}</td>
                      <td className="text-white/60">{l.nouvelleValeur ?? "-"}</td>
                      <td className="text-white/40 font-mono text-xs">
                        {l.adresseIp || "-"}
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

