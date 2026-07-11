"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Mail,
  Loader2,
  X,
  Copy,
  Check,
} from "lucide-react";

interface Invoice {
  id: number;
  client: string;
  montant: number;
  statut: "Payée" | "En attente" | "Retard";
  date: string;
}

interface RecentInvoicesProps {
  invoices: Invoice[];
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(value) + " Ar";
}

function StatusBadge({ statut }: { statut: Invoice["statut"] }) {
  if (statut === "Payée")
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
        <CheckCircle2 size={13} /> Payée
      </span>
    );
  if (statut === "En attente")
    return (
      <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
        <Clock size={13} /> En attente
      </span>
    );
  return (
    <span className="flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs text-red-300">
      <AlertCircle size={13} /> Retard
    </span>
  );
}

export default function RecentInvoices({ invoices }: RecentInvoicesProps) {
  const [panneauOuvert, setPanneauOuvert] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [email, setEmail] = useState("");
  const [copie, setCopie] = useState(false);

  async function genererRelance(factureId: number) {
    setPanneauOuvert(true);
    setChargement(true);
    setEmail("");
    setCopie(false);

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

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <FileText size={20} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Factures récentes</h2>
            <p className="text-xs text-white/40">Suivi des paiements</p>
          </div>
        </div>
      </div>

      {!invoices || invoices.length === 0 ? (
        <p className="text-sm text-white/40">Aucune facture disponible</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.05] transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">{invoice.client}</p>
                  <p className="text-xs text-white/40 mt-1">{invoice.date}</p>
                </div>
                <StatusBadge statut={invoice.statut} />
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-white/40">Montant</p>
                  <p className="text-lg font-bold text-white">{formatMoney(invoice.montant)}</p>
                </div>
              </div>

              {/* Action réelle uniquement pour les factures en retard */}
              {invoice.statut === "Retard" && (
                <button
                  onClick={() => genererRelance(invoice.id)}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 ring-1 ring-violet-500/30 px-4 py-2 text-xs font-medium text-violet-300 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Générer l'email de relance (IA)
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Panneau modal */}
      {panneauOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                Email de relance généré par l'IA
              </h3>
              <button onClick={() => setPanneauOuvert(false)} className="text-white/40 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 max-h-96 overflow-y-auto">
              {chargement ? (
                <div className="flex items-center gap-2 text-white/50 text-sm py-6 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" /> Génération en cours...
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
