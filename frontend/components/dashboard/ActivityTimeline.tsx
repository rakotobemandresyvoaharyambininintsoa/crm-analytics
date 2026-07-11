"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ShoppingCart,
  UserPlus,
  FileText,
  Package,
  Brain,
  Sparkles,
  Loader2,
} from "lucide-react";

interface ActivityItem {
  id: number;
  type: "vente" | "client" | "facture" | "stock";
  titre: string;
  description: string;
  date: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "vente":
      return <ShoppingCart size={17} className="text-green-400" />;
    case "client":
      return <UserPlus size={17} className="text-blue-400" />;
    case "facture":
      return <FileText size={17} className="text-violet-400" />;
    case "stock":
      return <Package size={17} className="text-orange-400" />;
  }
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const [commentaires, setCommentaires] = useState<Record<number, string>>({});
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!activities || activities.length === 0) {
      setChargement(false);
      return;
    }

    fetch("/api/ai/activity-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activites: activities.map((a) => ({
          id: a.id,
          type: a.type,
          titre: a.titre,
          description: a.description,
        })),
      }),
    })
      .then((r) => r.json())
      .then((data) => setCommentaires(data.commentaires ?? {}))
      .catch(() => setCommentaires({}))
      .finally(() => setChargement(false));
  }, [activities]);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10">
            <Activity size={20} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Activités récentes</h2>
            <p className="text-xs text-white/40">Historique intelligent de l'entreprise</p>
          </div>
        </div>
        <Brain size={20} className="text-violet-400" />
      </div>

      {!activities || activities.length === 0 ? (
        <p className="text-sm text-white/40">Aucune activité récente</p>
      ) : (
        <div className="relative space-y-6">
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/10" />

          {activities.map((item) => (
            <div key={item.id} className="relative flex gap-4">
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black border border-white/10">
                {getActivityIcon(item.type)}
              </div>

              <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.05] transition">
                <div className="flex justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{item.titre}</h3>
                  <span className="text-xs text-white/30">{item.date}</span>
                </div>

                <p className="mt-2 text-sm text-white/40">{item.description}</p>

                {/* Commentaire IA réel, généré en un seul appel groupé */}
                {chargement ? (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/5 p-3">
                    <Loader2 size={12} className="animate-spin text-white/30" />
                    <p className="text-xs text-white/30">Analyse IA en cours...</p>
                  </div>
                ) : commentaires[item.id] ? (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-violet-500/10 border border-violet-500/20 p-3">
                    <Sparkles size={14} className="text-violet-300 shrink-0" />
                    <p className="text-xs text-white/70">{commentaires[item.id]}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
