"use client";

import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  titre: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({
  icon: Icon,
  titre,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 mb-4">
          <Icon className="h-5 w-5 text-white/30" />
        </div>
      )}

      <p className="text-white/60 font-medium">{titre}</p>

      {description && (
        <p className="text-white/30 text-sm mt-1 max-w-sm">{description}</p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
