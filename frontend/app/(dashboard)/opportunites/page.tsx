"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";

import OpportunityStats from "@/components/opportunites/OpportunityStats";
import Pipeline from "@/components/opportunites/Pipeline";

export default function Opportunites() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch("/api/opportunites");
    setData(await res.json());
  }

  async function changerStatut(id: number, statut: string) {
    await fetch("/api/opportunites/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statut,
      }),
    });

    charger();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Pipeline commercial
            </h1>
            <p className="text-sm text-white/40">
              Suivez vos opportunités en cours
            </p>
          </div>
        </div>

        <OpportunityStats data={data} />

        <Pipeline data={data} changerStatut={changerStatut} />
      </div>
    </div>
  );
}

