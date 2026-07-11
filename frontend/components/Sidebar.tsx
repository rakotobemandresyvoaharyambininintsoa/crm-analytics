"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Target,
  Receipt,
  BarChart3,
   BrainCircuit,
  Package,
  ClipboardList,
  UserCog,
  Settings,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      link: "/dashboard",
      roles: ["ADMIN", "COMMERCIAL", "MAGASINIER"],
    },
    {
      name: "Clients",
      icon: Users,
      link: "/clients",
      roles: ["ADMIN", "COMMERCIAL"],
    },
    {
      name: "Opportunités",
      icon: Target,
      link: "/opportunites",
      roles: ["ADMIN", "COMMERCIAL"],
    },
    {
      name: "Factures",
      icon: Receipt,
      link: "/factures",
      roles: ["ADMIN", "COMMERCIAL"],
    },
    {
      name: "Rapports",
      icon: BarChart3,
      link: "/rapports",
      roles: ["ADMIN", "COMMERCIAL", "MAGASINIER"],
    },
    {
      name: "Stock",
      icon: Package,
      link: "/stock",
      roles: ["ADMIN", "MAGASINIER"],
    },
    {
    name: "Analytic",
    icon: BarChart3,
    link: "/analytics",
    roles: ["ADMIN", "COMMERCIAL", "MAGASINIER"],
  },
  {
    name: "Centre de Commande IA",
    icon: BrainCircuit,
    link: "/ai-command-center",
    roles: ["ADMIN", "COMMERCIAL"],
  },
    {
      name: "Inventaire",
      icon: ClipboardList,
      link: "/inventaire",
      roles: ["ADMIN", "MAGASINIER"],
    },
    {
      name: "Paramètres",
      icon: Settings,
      link: "/parametres",
      roles: ["ADMIN"],
    },
  ];

  const autorises = menus.filter((m) => m.roles.includes(role));

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-slate-950 border-r border-white/10 p-5 text-white font-sans">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white">CRM Pro</h1>
          <p className="text-xs text-white/40">Analytics</p>
        </div>
      </div>

      {/* Nav */}
      <p className="text-xs font-medium uppercase tracking-wide text-white/30 mb-3 px-1">
        Menu
      </p>

      <nav className="space-y-1.5 flex-1">
        {autorises.map((menu) => {
          const Icon = menu.icon;
          const actif = pathname === menu.link;

          return (
            <Link
              key={menu.name}
              href={menu.link}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                actif
                  ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {menu.name}
            </Link>
          );
        })}
      </nav>

      {/* Role badge + déconnexion */}
      <div className="pt-6 mt-6 border-t border-white/10">
        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3">
          <span className="text-xs text-white/40">Rôle</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-300">
              {role}
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}
