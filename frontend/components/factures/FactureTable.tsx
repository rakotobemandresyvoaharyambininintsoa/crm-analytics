"use client";

import { useState } from "react";
import { Receipt, Mail, Sparkles, X, Copy, Check, Loader2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";

const PAR_PAGE = 8;

const STATUT_STYLES: Record<string, string> = {
  Brouillon: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
  Payée: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  Retard: "bg-red-500/10 text-red-300 ring-red-500/20",
};

export default function FactureTable({ factures }: any) {
  const [page, setPage] = useState(1);

  // --- Panneau relance IA ---
  const [panneauOuvert, setPanneauOuvert] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [email, setEmail] = useState("");
  const [copie, setCopie] = useState(false);
  const [factureNumero, setFactureNumero] = useState("");

  const totalPages = Math.ceil(factures.length / PAR_PAGE);
  const listePage = factures.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  async function genererRelance(factureId: number, numero: string) {
    setPanneauOuvert(true);
    setChargement(true);
    setEmail("");
    setCopie(false);
    setFactureNumero(numero);

    try {
      const res = await fetch("/api/ai/actions/relance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factureId }),
      });
      const data = await res.json();
      setEmail(data.error ?? data.email);
    } catch {
      setEmail("Erreur lors de la génération. Réessayez.");
    } finally {
      setChargement(false);
    }
  }

  function copier() {
    navigator.clipboard.writeText(email);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  }

  if (factures.length === 0) {
    return (
      <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
        <EmptyState
          icon={Receipt}
          titre="Aucune facture trouvée"
          description="Crée ta première facture avec le formulaire ci-dessus."
        />
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl overflow-auto relative">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/40 text-xs uppercase tracking-wide">
            <th className="text-left font-medium pb-3">Numéro</th>
            <th className="text-left font-medium pb-3">Client</th>
            <th className="text-left font-medium pb-3">Montant</th>
            <th className="text-left font-medium pb-3">Statut</th>
            <th className="text-left font-medium pb-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {listePage.map((f: any) => {
            const style = STATUT_STYLES[f.statut] ?? "bg-slate-500/10 text-slate-300 ring-slate-500/20";

            return (
              <tr key={f.id} className="border-t border-white/10 hover:bg-white/[0.02] transition-colors">
                <td className="p-3 font-medium text-white">{f.numero}</td>
                <td className="text-white/60">{f.client?.nom}</td>
                <td className="text-white/60">{f.montant.toLocaleString()} Ar</td>
                <td>
                  <span className={`inline-flex items-center rounded-full ring-1 px-2.5 py-1 text-xs font-semibold ${style}`}>
                    {f.statut}
                  </span>
                </td>
                <td>
                  {f.statut === "Retard" && (
                    <button
                      onClick={() => genererRelance(f.id, f.numero)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 ring-1 ring-violet-500/30 px-3 py-1.5 text-xs font-medium text-violet-300 transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Relance IA
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal relance IA */}
      {panneauOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-white">
                <Sparkles className="h-4 w-4 text-violet-400" />
                Email de relance — Facture {factureNumero}
              </h3>
              <button onClick={() => setPanneauOuvert(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 max-h-96 overflow-y-auto">
              {chargement ? (
                <div className="flex items-center gap-2 text-white/50 text-sm py-6 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération en cours...
                </div>
              ) : (
                <p className="text-sm text-white/80 whitespace-pre-line">{email}</p>
              )}
            </div>

            {!chargement && email && (
              <button
                onClick={copier}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 ring-1 ring-violet-500/30 px-4 py-2.5 text-sm font-medium text-violet-300 transition-colors"
              >
                {copie ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copie ? "Copié !" : "Copier le texte"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
