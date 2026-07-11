"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Hash,
  Calendar,
  Warehouse,
  MapPin,
  User,
  Users,
  MessageSquare,
  Save,
  Loader2,
} from "lucide-react";

export default function NouvelleSession() {
  const router = useRouter();

  const [entrepots, setEntrepots] = useState<any[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [enregistrement, setEnregistrement] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    reference: "",
    date: "",
    heure: "",
    entrepotId: "",
    zone: "",
    responsableId: "",
    equipe: "",
    commentaire: "",
    doubleComptage: false,
  });

  useEffect(() => {
    chargerReferences();
  }, []);

  async function chargerReferences() {
    try {
      const [resEntrepots, resUtilisateurs] = await Promise.all([
        fetch("/api/entrepots"),
        fetch("/api/users"),
      ]);

      setEntrepots(resEntrepots.ok ? await resEntrepots.json() : []);
      setUtilisateurs(resUtilisateurs.ok ? await resUtilisateurs.json() : []);
    } catch (error) {
      console.error(error);
    }
  }

  function changer(e: any) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function creerSession() {
    if (!form.nom) {
      alert("Le nom de la session est obligatoire");
      return;
    }

    setEnregistrement(true);

    try {
      const res = await fetch("/api/inventaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          statut: "Brouillon",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erreur lors de la création");
        setEnregistrement(false);
        return;
      }

      router.push(`/inventaire/${data.id}`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création");
      setEnregistrement(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Nouvelle session d'inventaire
            </h1>
            <p className="text-sm text-white/40">
              Renseignez les informations de la session à lancer
            </p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 space-y-6">
          {/* Identification */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/40 mb-3">
              Identification
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <Field icon={ClipboardList} label="Nom de l'inventaire">
                <input
                  name="nom"
                  value={form.nom}
                  onChange={changer}
                  placeholder="Ex : Inventaire général Q3"
                  className={inputClass}
                />
              </Field>

              <Field icon={Hash} label="Référence">
                <input
                  name="reference"
                  value={form.reference}
                  onChange={changer}
                  placeholder="Ex : INV-2026-014"
                  className={inputClass}
                />
              </Field>

              <Field icon={Calendar} label="Date">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={changer}
                  className={inputClass}
                />
              </Field>

              <Field icon={Calendar} label="Heure">
                <input
                  type="time"
                  name="heure"
                  value={form.heure}
                  onChange={changer}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Localisation */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/40 mb-3">
              Localisation
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <Field icon={Warehouse} label="Entrepôt / Magasin">
                <select
                  name="entrepotId"
                  value={form.entrepotId}
                  onChange={changer}
                  className={inputClass}
                >
                  <option className="bg-slate-900" value="">
                    Choisir un entrepôt
                  </option>
                  {entrepots.map((e) => (
                    <option key={e.id} value={e.id} className="bg-slate-900">
                      {e.nom}
                    </option>
                  ))}
                </select>
              </Field>

              <Field icon={MapPin} label="Zone concernée">
                <input
                  name="zone"
                  value={form.zone}
                  onChange={changer}
                  placeholder="Ex : Zone A - Rayon 3"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Équipe */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/40 mb-3">
              Équipe
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <Field icon={User} label="Responsable">
                <select
                  name="responsableId"
                  value={form.responsableId}
                  onChange={changer}
                  className={inputClass}
                >
                  <option className="bg-slate-900" value="">
                    Choisir un responsable
                  </option>
                  {utilisateurs.map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-900">
                      {u.nom}
                    </option>
                  ))}
                </select>
              </Field>

              <Field icon={Users} label="Équipe de comptage">
                <input
                  name="equipe"
                  value={form.equipe}
                  onChange={changer}
                  placeholder="Noms séparés par une virgule"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Options */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/40 mb-3">
              Options
            </p>

            <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
              <input
                type="checkbox"
                name="doubleComptage"
                checked={form.doubleComptage}
                onChange={changer}
                className="h-4 w-4 accent-violet-500"
              />
              Activer le double comptage
            </label>
          </div>

          {/* Commentaire */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/40 mb-3">
              Commentaire
            </p>

            <Field icon={MessageSquare} label="">
              <textarea
                name="commentaire"
                value={form.commentaire}
                onChange={changer}
                placeholder="Notes ou instructions particulières..."
                rows={3}
                className={inputClass + " resize-none"}
              />
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={creerSession}
              disabled={enregistrement}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {enregistrement ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Lancer la session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "bg-white/[0.03] border border-white/10 p-3 rounded-lg w-full text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors";

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <label className="flex items-center gap-1.5 text-xs text-white/50 mb-1.5">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
