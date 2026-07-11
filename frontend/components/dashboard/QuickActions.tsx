"use client";

import {
  UserPlus,
  PackagePlus,
  FilePlus2,
  BrainCircuit,
  BarChart3,
  Receipt,
  ArrowRight,
} from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Nouveau client",
    description: "Créer une fiche client",
    icon: UserPlus,
    href: "/clients/new",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Ajouter un produit",
    description: "Mettre à jour le catalogue",
    icon: PackagePlus,
    href: "/stock/new",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Créer une facture",
    description: "Facturation rapide",
    icon: FilePlus2,
    href: "/factures/new",
    color: "from-emerald-500 to-green-500",
  },
  {
    title: "AI Command Center",
    description: "Lancer un diagnostic",
    icon: BrainCircuit,
    href: "/ai-command-center", // ✅ route corrigée
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Analytics",
    description: "Visualiser les statistiques",
    icon: BarChart3,
    href: "/analytics", // ✅ déjà correcte
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Factures",
    description: "Voir toutes les factures",
    icon: Receipt,
    href: "/factures", // ✅ remplace /exports qui n'existait pas
    color: "from-indigo-500 to-blue-500",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Actions rapides</h2>
          <p className="text-sm text-white/40 mt-1">Les opérations les plus utilisées.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={action.href}
                className="group block rounded-2xl border border-white/10 bg-slate-900 hover:border-violet-500/40 transition-all duration-300 p-5 h-full"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mt-5">{action.title}</h3>
                <p className="text-white/45 text-sm mt-2">{action.description}</p>
                <div className="flex items-center gap-2 mt-5 text-violet-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                  Ouvrir <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
