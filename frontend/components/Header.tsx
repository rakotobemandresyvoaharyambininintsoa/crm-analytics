"use client";

import {
  Search,
  Bell,
  UserCircle
} from "lucide-react";
import type { SessionPayload } from "@/lib/auth";

export default function Header({ user }: { user: SessionPayload | null }) {

  return (
    <header className="
      h-20
      bg-slate-900/70
      border
      border-white/10
      backdrop-blur-xl
      rounded-2xl
      mb-6
      px-6
      flex
      items-center
      justify-between
      text-white
    ">

      {/* gauche */}
      <div>
        <h2 className="font-bold text-2xl">CRM Analytics</h2>
        <p className="text-white/40 text-sm">Gestion commerciale intelligente</p>
      </div>

      {/* centre recherche */}
      <div className="
        hidden
        lg:flex
        items-center
        gap-3
        bg-slate-800/70
        px-4
        py-2
        rounded-xl
        w-80
      ">
        <Search size={18} className="text-white/40" />
        <input
          placeholder="Rechercher..."
          className="bg-transparent outline-none text-sm w-full text-white"
        />
      </div>

      {/* droite */}
      <div className="flex items-center gap-4">

        <button className="
          relative
          bg-slate-800
          p-3
          rounded-xl
          hover:bg-slate-700
          transition
        ">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="
          flex
          items-center
          gap-3
          bg-violet-600
          px-4
          py-2
          rounded-xl
        ">
          <UserCircle size={26} />
          <div className="hidden md:block">
            <p className="text-sm font-semibold">{user?.nom ?? "Utilisateur"}</p>
            <p className="text-xs text-white/60">{user?.role ?? "CRM Pro"}</p>
          </div>
        </div>

      </div>

    </header>
  );
}