"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import {
  Receipt,
  User,
  Wallet,
  Percent,
  Tag,
  Download,
  Loader2,
} from "lucide-react";

const STATUT_STYLES: Record<string, string> = {
  Brouillon: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
  Envoyée: "bg-blue-500/10 text-blue-300 ring-blue-500/20",
  Payée: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  "En retard": "bg-red-500/10 text-red-300 ring-red-500/20",
};

export default function FactureDetail() {
  const params = useParams();
  const id = params.id;

  const [facture, setFacture] = useState<any>(null);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch(`/api/factures/${id}`);
    const data = await res.json();
    setFacture(data);
  }

  function genererPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("CRM PRO - FACTURE", 20, 20);

    doc.setFontSize(12);

    doc.text("Numero : " + facture.numero, 20, 40);
    doc.text("Client : " + (facture.client?.nom || "-"), 20, 50);
    doc.text("Montant : " + facture.montant + " Ar", 20, 60);
    doc.text("TVA : " + facture.tva + " %", 20, 70);
    doc.text("Remise : " + facture.remise + " Ar", 20, 80);

    const total =
      facture.montant + (facture.montant * facture.tva) / 100 - facture.remise;

    doc.text("TOTAL TTC : " + total + " Ar", 20, 95);
    doc.text("Statut : " + facture.statut, 20, 110);

    doc.save(facture.numero + ".pdf");
  }

  if (!facture) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-white/50 font-medium text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Chargement de la facture...
        </div>
      </div>
    );
  }

  const statutStyle =
    STATUT_STYLES[facture.statut] ??
    "bg-slate-500/10 text-slate-300 ring-slate-500/20";

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <Receipt className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {facture.numero}
            </h1>
            <p className="text-sm text-white/40">Détail de la facture</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium uppercase tracking-wide text-white/40">
              Statut
            </span>
            <span
              className={`inline-flex items-center rounded-full ring-1 px-3 py-1 text-xs font-semibold ${statutStyle}`}
            >
              {facture.statut}
            </span>
          </div>

          <div className="space-y-4">
            <Ligne
              icon={User}
              label="Client"
              valeur={facture.client?.nom || "-"}
            />
            <Ligne
              icon={Wallet}
              label="Montant"
              valeur={facture.montant.toLocaleString() + " Ar"}
            />
            <Ligne icon={Percent} label="TVA" valeur={facture.tva + " %"} />
            <Ligne
              icon={Tag}
              label="Remise"
              valeur={facture.remise + " Ar"}
            />
          </div>

          <button
            onClick={genererPDF}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 px-6 py-3 rounded-xl mt-8 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" />
            Télécharger le PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function Ligne({
  icon: Icon,
  label,
  valeur,
}: {
  icon: any;
  label: string;
  valeur: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
      <div className="flex items-center gap-2 text-white/50 text-sm">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <span className="font-semibold text-white">{valeur}</span>
    </div>
  );
}
