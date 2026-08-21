"use client";

import { X } from "lucide-react";
import { type ReactNode } from "react";

interface ModalProps {
  estOuvert: boolean;
  onClose: () => void;
  titre: string;
  enfants: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  estOuvert,
  onClose,
  titre,
  enfants,
  maxWidth = "max-w-md",
}: ModalProps) {
  if (!estOuvert) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="button"
      tabIndex={0}
      aria-label="Fermer la fenêtre"
    >
      <div
        className={`bg-slate-950 border border-white/10 p-8 rounded-xl w-full ${maxWidth}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-xl font-bold text-white">{titre}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-white/40 hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {enfants}
      </div>
    </div>
  );
}