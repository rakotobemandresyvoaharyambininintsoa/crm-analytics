"use client";

import { Plus } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ClientForm({ form, changer, ajouter }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-5">
        <Plus className="h-5 w-5 text-violet-400" />
        <h2 className="text-lg font-semibold text-white">Nouveau client</h2>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <Input name="nom" value={form.nom} onChange={changer} placeholder="Nom" />

        <Input
          name="entreprise"
          value={form.entreprise}
          onChange={changer}
          placeholder="Entreprise"
        />

        <Input name="email" value={form.email} onChange={changer} placeholder="Email" />

        <Input
          name="telephone"
          value={form.telephone}
          onChange={changer}
          placeholder="Téléphone"
        />

        <Input name="ville" value={form.ville} onChange={changer} placeholder="Ville" />

        <Input name="pays" value={form.pays} onChange={changer} placeholder="Pays" />
      </div>

      <Button onClick={ajouter} className="mt-5" icon={<Plus className="h-4 w-4" />}>
        Enregistrer
      </Button>
    </div>
  );
}
