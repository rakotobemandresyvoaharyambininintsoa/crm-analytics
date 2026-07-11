"use client";

import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import FactureAI from "@/components/factures/FactureAI";
import FactureStats from "@/components/factures/FactureStats";
import FactureForm from "@/components/factures/FactureForm";
import FactureTable from "@/components/factures/FactureTable";

export default function Factures() {
  const [factures, setFactures] = useState<any[]>([]);

  const [form, setForm] = useState({
    montant: "",
    tva: "20",
    remise: "0",
    statut: "Brouillon",
  });

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch("/api/factures", {
      cache: "no-store",
    });

    setFactures(await res.json());
  }

  function changer(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function creer() {
    await fetch("/api/factures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      montant: "",
      tva: "20",
      remise: "0",
      statut: "Brouillon",
    });

    charger();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <Receipt className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Factures
            </h1>
            <p className="text-sm text-white/40">
              Suivez et gérez votre facturation
            </p>
          </div>
        </div>

        <FactureStats data={factures} />
        <FactureAI />
        <FactureForm form={form} changer={changer} creer={creer} />

        <FactureTable factures={factures} />
      </div>
    </div>
  );
}

