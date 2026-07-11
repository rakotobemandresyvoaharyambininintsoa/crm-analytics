import { Building2, Bell, SlidersHorizontal, Save } from "lucide-react";

export default function Parametres() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <SlidersHorizontal className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Paramètres
            </h1>
            <p className="text-sm text-white/40">
              Configurez votre espace de travail
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PROFIL ENTREPRISE */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">
                Profil entreprise
              </h2>
            </div>

            <div className="space-y-3">
              <input
                className="w-full bg-white/[0.03] border border-white/10 p-3 rounded-lg text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                placeholder="Nom entreprise"
              />

              <input
                className="w-full bg-white/[0.03] border border-white/10 p-3 rounded-lg text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                placeholder="Email"
              />

              <input
                className="w-full bg-white/[0.03] border border-white/10 p-3 rounded-lg text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                placeholder="Téléphone"
              />
            </div>

            <button className="inline-flex items-center gap-2 mt-5 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              <Save className="h-4 w-4" />
              Enregistrer
            </button>
          </div>

          {/* PREFERENCES */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">Préférences</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-violet-500" />
                Notifications email
              </label>

              <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-violet-500" />
                Alertes stock faible
              </label>

              <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-violet-500" />
                Rapport automatique
              </label>
            </div>
          </div>

          {/* SYSTEME CRM */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">
                Système CRM
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-violet-500" />
                Mode sombre
              </label>

              <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-violet-500" />
                Sauvegarde automatique
              </label>

              <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-violet-500" />
                Synchronisation données
              </label>

              <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-violet-500" />
                Protection suppression
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

