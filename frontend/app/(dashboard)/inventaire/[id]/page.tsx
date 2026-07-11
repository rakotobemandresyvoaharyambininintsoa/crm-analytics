
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import EmptyState from "@/components/EmptyState";
import {
  ClipboardList,
  Warehouse,
  MapPin,
  User,
  Users,
  Calendar,
  MessageSquare,
  PackageSearch,
  AlertTriangle,
  Wallet,
  ScanLine,
  ShieldCheck,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react";

const STATUT_STYLES: Record<string, string> = {
  Brouillon: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
  "En cours": "bg-blue-500/10 text-blue-300 ring-blue-500/20",
  "À valider": "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  Validé: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  Annulé: "bg-red-500/10 text-red-300 ring-red-500/20",
};

export default function InventaireSession() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    try {
      const res = await fetch(`/api/inventaires/${id}`, { cache: "no-store" });
      const data = await res.json();
      setSession(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  function genererPDF() {
    if (!session) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("CRM PRO - RAPPORT D'INVENTAIRE", 20, 20);

    doc.setFontSize(11);
    doc.text("Session : " + session.nom, 20, 35);
    doc.text("Référence : " + (session.reference || "-"), 20, 42);
    doc.text("Entrepôt : " + (session.entrepot?.nom || "-"), 20, 49);
    doc.text("Responsable : " + (session.responsable?.nom || "-"), 20, 56);
    doc.text("Statut : " + session.statut, 20, 63);

    let y = 78;
    doc.setFontSize(10);
    doc.text("Produit", 20, y);
    doc.text("Système", 100, y);
    doc.text("Compté", 130, y);
    doc.text("Écart", 160, y);
    y += 6;

    (session.lignes || []).forEach((l: any) => {
      doc.text(String(l.nom).slice(0, 30), 20, y);
      doc.text(String(l.stockSysteme), 100, y);
      doc.text(String(l.stockCompte ?? "-"), 130, y);
      doc.text(String(l.ecart ?? "-"), 160, y);
      y += 6;
    });

    doc.save((session.reference || session.nom) + ".pdf");
  }

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-white/50 font-medium text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Chargement de la session...
        </div>
      </div>
    );
  }

  const statutStyle = STATUT_STYLES[session.statut] ?? STATUT_STYLES["Brouillon"];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  {session.nom}
                </h1>
                <span className={`inline-flex items-center rounded-full ring-1 px-2.5 py-1 text-xs font-semibold ${statutStyle}`}>
                  {session.statut}
                </span>
              </div>
              <p className="text-sm text-white/40">
                Référence : {session.reference || "-"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={genererPDF}
              className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/[0.05] transition-colors"
            >
              <Download className="h-4 w-4" />
              Rapport PDF
            </button>

            <Link
              href={`/inventaire/${id}/comptage`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <ScanLine className="h-4 w-4" />
              Comptage
            </Link>

            <Link
              href={`/inventaire/${id}/validation`}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Validation
            </Link>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card
            titre="Produits contrôlés"
            valeur={session.lignes?.length ?? 0}
            icon={PackageSearch}
            accent="violet"
          />
          <Card
            titre="Produits en écart"
            valeur={(session.lignes || []).filter((l: any) => l.ecart && l.ecart !== 0).length}
            icon={AlertTriangle}
            accent="amber"
          />
          <Card
            titre="Valeur des écarts"
            valeur={(session.valeurEcarts ?? 0).toLocaleString() + " Ar"}
            icon={Wallet}
            accent="red"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Infos session */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 md:col-span-1">
            <h2 className="text-lg font-semibold text-white mb-5">
              Informations
            </h2>

            <div className="space-y-4 text-sm">
              <InfoLigne icon={Warehouse} label="Entrepôt" valeur={session.entrepot?.nom || "-"} />
              <InfoLigne icon={MapPin} label="Zone" valeur={session.zone || "-"} />
              <InfoLigne icon={User} label="Responsable" valeur={session.responsable?.nom || "-"} />
              <InfoLigne icon={Users} label="Équipe" valeur={session.equipe || "-"} />
              <InfoLigne
                icon={Calendar}
                label="Date"
                valeur={session.date ? new Date(session.date).toLocaleDateString("fr-FR") : "-"}
              />
              <InfoLigne icon={MessageSquare} label="Commentaire" valeur={session.commentaire || "-"} />
            </div>
          </div>

          {/* Lignes de comptage */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 md:col-span-2 overflow-auto">
            <h2 className="text-lg font-semibold text-white mb-5">
              Produits contrôlés
            </h2>

            {(!session.lignes || session.lignes.length === 0) ? (
              <EmptyState
                icon={PackageSearch}
                titre="Aucun produit compté pour le moment"
                description="Démarre le comptage pour commencer à saisir les quantités."
                action={{
                  label: "Démarrer le comptage",
                  onClick: () => router.push(`/inventaire/${id}/comptage`),
                }}
              />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs uppercase tracking-wide">
                    <th className="text-left font-medium pb-3">Produit</th>
                    <th className="text-left font-medium pb-3">Système</th>
                    <th className="text-left font-medium pb-3">Compté</th>
                    <th className="text-left font-medium pb-3">Écart</th>
                  </tr>
                </thead>
                <tbody>
                  {session.lignes.map((l: any) => (
                    <tr key={l.id} className="border-t border-white/10 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-medium text-white">{l.nom}</td>
                      <td className="text-white/60">{l.stockSysteme}</td>
                      <td className="text-white/60">{l.stockCompte ?? "-"}</td>
                      <td
                        className={
                          l.ecart === undefined || l.ecart === null
                            ? "text-white/40"
                            : l.ecart === 0
                            ? "text-white/60"
                            : l.ecart > 0
                            ? "text-emerald-400 font-semibold"
                            : "text-red-400 font-semibold"
                        }
                      >
                        {l.ecart ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ACCENTS: Record<string, { bg: string; text: string; ring: string }> = {
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20" },
  red: { bg: "bg-red-500/10", text: "text-red-400", ring: "ring-red-500/20" },
};

function Card({ titre, valeur, icon: Icon, accent }: any) {
  const c = ACCENTS[accent];

  return (
    <div className="bg-white/[0.03] border border-white/10 p-5 rounded-xl hover:border-white/20 hover:bg-white/[0.05] transition-colors">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.bg} ring-1 ${c.ring} mb-4`}>
        <Icon className={`h-4 w-4 ${c.text}`} />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{titre}</p>
      <h2 className="text-2xl font-bold text-white mt-1.5 tabular-nums">{valeur}</h2>
    </div>
  );
}

function InfoLigne({ icon: Icon, label, valeur }: any) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-white/10 last:border-b-0">
      <div className="flex items-center gap-2 text-white/50">
        <Icon className="h-4 w-4 flex-shrink-0" />
        {label}
      </div>
      <span className="text-white text-right">{valeur}</span>
    </div>
  );
}