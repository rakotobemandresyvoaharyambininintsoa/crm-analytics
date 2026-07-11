"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  Phone,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  Save,
  type LucideIcon,
} from "lucide-react";
import ClientAI from "@/components/clients/ClientAI";
export default function Clients() {
  const router = useRouter();

  const [clients, setClients] = useState<any[]>([]);
  const [recherche, setRecherche] = useState("");
  const [selection, setSelection] = useState<any>(null);

  const [form, setForm] = useState({
    nom: "",
    entreprise: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    pays: "",
    notes: "",
  });

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  }

  async function ajouter() {
    if (!form.nom) return;

    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      nom: "",
      entreprise: "",
      email: "",
      telephone: "",
      adresse: "",
      ville: "",
      pays: "",
      notes: "",
    });

    charger();
  }

  async function supprimer(id: number) {
    if (!confirm("Supprimer ce client ?")) return;

    await fetch(`/api/clients/${id}`, { method: "DELETE" });

    charger();
  }

  async function modifier() {
    await fetch(`/api/clients/${selection.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selection),
    });

    setSelection(null);
    charger();
  }

  const liste = clients.filter((c) =>
    c.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Clients
            </h1>
            <p className="text-sm text-white/40">
              Gérez votre portefeuille clients
            </p>
          </div>
        </div>
        <ClientAI />
        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card titre="Clients" valeur={clients.length} icon={Users} accent="violet" />
          <Card
            titre="Entreprises"
            valeur={clients.filter((c) => c.entreprise).length}
            icon={Building2}
            accent="sky"
          />
          <Card
            titre="Contacts"
            valeur={clients.filter((c) => c.telephone).length}
            icon={Phone}
            accent="emerald"
          />
        </div>

        {/* Ajouter client */}
        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Plus className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Ajouter un client</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-3">
            {Object.keys(form).map((key) => (
              <input
                key={key}
                className="bg-white/[0.03] border border-white/10 p-3 rounded-lg text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                placeholder={key}
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]: e.target.value,
                  })
                }
              />
            ))}
          </div>

          <button
            onClick={ajouter}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 px-6 py-3 rounded-xl mt-5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {/* Recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            className="w-full bg-white/[0.03] border border-white/10 p-4 pl-11 rounded-xl text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            placeholder="Rechercher un client..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-wide">
                <th className="text-left font-medium pb-3">Nom</th>
                <th className="text-left font-medium pb-3">Entreprise</th>
                <th className="text-left font-medium pb-3">Email</th>
                <th className="text-left font-medium pb-3">Téléphone</th>
                <th className="text-left font-medium pb-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {liste.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-white/10 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-3 font-medium text-white">{client.nom}</td>
                  <td className="text-white/60">{client.entreprise}</td>
                  <td className="text-white/60">{client.email}</td>
                  <td className="text-white/60">{client.telephone}</td>

                  <td>
                    <div className="flex gap-2 py-1">
                      <button
                        onClick={() => router.push("/clients/" + client.id)}
                        className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
                        title="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setSelection(client)}
                        className="flex items-center justify-center h-8 w-8 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => supprimer(client.id)}
                        className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-500/10 ring-1 ring-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal modifier */}
        {selection && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-950 border border-white/10 p-8 rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white">Modifier le client</h2>
                <button
                  onClick={() => setSelection(null)}
                  className="flex items-center justify-center h-8 w-8 rounded-lg text-white/40 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {Object.keys(selection)
                  .filter((k) => k !== "id")
                  .map((key) => (
                    <input
                      key={key}
                      className="bg-white/[0.03] border border-white/10 p-3 rounded-lg w-full text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                      placeholder={key}
                      value={selection[key] || ""}
                      onChange={(e) =>
                        setSelection({
                          ...selection,
                          [key]: e.target.value,
                        })
                      }
                    />
                  ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={modifier}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg shadow-emerald-500/20 px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </button>

                <button
                  onClick={() => setSelection(null)}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-white/60 bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ACCENTS: Record<string, { bg: string; text: string; ring: string }> = {
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
};

function Card({
  titre,
  valeur,
  icon: Icon,
  accent = "sky",
}: {
  titre: string;
  valeur: any;
  icon: LucideIcon;
  accent?: keyof typeof ACCENTS;
}) {
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

