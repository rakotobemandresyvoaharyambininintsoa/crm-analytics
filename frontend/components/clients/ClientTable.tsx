"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2, Users } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";

const PAR_PAGE = 8;

export default function ClientTable({ clients, supprimer, modifier, voir }: any) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(clients.length / PAR_PAGE);
  const listePage = clients.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  if (clients.length === 0) {
    return (
      <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
        <EmptyState
          icon={Users}
          titre="Aucun client trouvé"
          description="Ajoute un client avec le formulaire ci-dessus, ou modifie ta recherche."
        />
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/40 text-xs uppercase tracking-wide">
            <th className="text-left font-medium pb-3">Nom</th>
            <th className="text-left font-medium pb-3">Entreprise</th>
            <th className="text-left font-medium pb-3">Email</th>
            <th className="text-left font-medium pb-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {listePage.map((c: any) => (
            <tr
              key={c.id}
              className="border-t border-white/10 hover:bg-white/[0.02] transition-colors"
            >
              <td className="p-3 font-medium text-white">{c.nom}</td>
              <td className="text-white/60">{c.entreprise}</td>
              <td className="text-white/60">{c.email}</td>

              <td>
                <div className="flex gap-2 py-1">
                  <button
                    onClick={() => voir(c.id)}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    title="Voir"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => modifier(c)}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => supprimer(c.id)}
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
