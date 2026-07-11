"use client";

import { Plus } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function FactureForm({ form, changer, creer }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-5">
        <Plus className="h-5 w-5 text-violet-400" />
        <h2 className="text-lg font-semibold text-white">Nouvelle facture</h2>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <Input
          name="montant"
          value={form.montant}
          onChange={changer}
          placeholder="Montant"
        />

        <Input name="tva" value={form.tva} onChange={changer} placeholder="TVA" />

        <Input
          name="remise"
          value={form.remise}
          onChange={changer}
          placeholder="Remise"
        />

        <select
          name="statut"
          value={form.statut}
          onChange={changer}
          className="bg-white/[0.03] border border-white/10 p-3 rounded-lg text-sm text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
        >
          <option className="bg-slate-900">Brouillon</option>
          <option className="bg-slate-900">Payée</option>
          <option className="bg-slate-900">Retard</option>
        </select>
      </div>

      <Button onClick={creer} className="mt-5" icon={<Plus className="h-4 w-4" />}>
        Créer facture
      </Button>
    </div>
  );
}
