"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, Save, Loader2 } from "lucide-react";

export default function Parametres() {
  const [loading, setLoading] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);

  const [params, setParams] = useState({
    frequence: "Mensuelle",
    doubleComptage: true,
    toleranceEcart: "2",
    validationObligatoire: true,
    signatureObligatoire: true,
    notifications: true,
    rappelsAutomatiques: false,
  });

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    try {
      const res = await fetch("/api/inventaires/parametres");

      if (res.ok) {
        setParams(await res.json());
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  function changer(e: any) {
    const { name, value, type, checked } = e.target;

    setParams({
      ...params,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function enregistrer() {
    setEnregistrement(true);

    try {
      await fetch("/api/inventaires/parametres", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
    } catch (error) {
      console.error(error);
    }

    setEnregistrement(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-white/50 font-medium text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Chargement des paramètres...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <SlidersHorizontal className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Paramètres de l'inventaire
            </h1>
            <p className="text-sm text-white/40">
              Configurez les règles de contrôle de stock
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Fréquence & tolérance */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-5">
              Fréquence et tolérance
            </h2>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">
                  Fréquence des inventaires
                </label>
                <select
                  name="frequence"
                  value={params.frequence}
                  onChange={changer}
                  className="bg-white/[0.03] border border-white/10 p-3 rounded-lg w-full text-sm text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                >
                  <option className="bg-slate-900">Hebdomadaire</option>
                  <option className="bg-slate-900">Mensuelle</option>
                  <option className="bg-slate-900">Trimestrielle</option>
                  <option className="bg-slate-900">Annuelle</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">
                  Tolérance des écarts (%)
                </label>
                <input
                  type="number"
                  name="toleranceEcart"
                  value={params.toleranceEcart}
                  onChange={changer}
                  className="bg-white/[0.03] border border-white/10 p-3 rounded-lg w-full text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Contrôles */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-5">
              Contrôles de qualité
            </h2>

            <div className="space-y-4">
              <Toggle
                name="doubleComptage"
                checked={params.doubleComptage}
                onChange={changer}
                label="Double comptage obligatoire"
              />
              <Toggle
                name="validationObligatoire"
                checked={params.validationObligatoire}
                onChange={changer}
                label="Validation obligatoire par un responsable"
              />
              <Toggle
                name="signatureObligatoire"
                checked={params.signatureObligatoire}
                onChange={changer}
                label="Signature électronique obligatoire"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-5">
              Notifications
            </h2>

            <div className="space-y-4">
              <Toggle
                name="notifications"
                checked={params.notifications}
                onChange={changer}
                label="Notifications lors des écarts détectés"
              />
              <Toggle
                name="rappelsAutomatiques"
                checked={params.rappelsAutomatiques}
                onChange={changer}
                label="Rappels automatiques avant chaque inventaire"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={enregistrer}
              disabled={enregistrement}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {enregistrement ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ name, checked, onChange, label }: any) {
  return (
    <label className="flex items-center justify-between text-sm text-white/70 cursor-pointer">
      {label}
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-violet-500"
      />
    </label>
  );
}
