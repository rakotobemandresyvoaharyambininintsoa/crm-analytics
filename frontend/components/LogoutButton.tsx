"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);

  async function deconnexion() {
    setChargement(true);

    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error(error);
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={deconnexion}
      disabled={chargement}
      className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/[0.03] border border-white/10 text-white/40 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-300 transition-colors disabled:opacity-50"
      title="Se déconnecter"
    >
      {chargement ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </button>
  );
}
