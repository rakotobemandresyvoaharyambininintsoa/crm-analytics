"use client";

import { Plus } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ClientToolbar({ recherche, setRecherche, ouvrir }: any) {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Rechercher un client..."
        value={recherche}
        onChange={(e: any) => setRecherche(e.target.value)}
      />

      <Button onClick={ouvrir} icon={<Plus className="h-4 w-4" />}>
        Ajouter
      </Button>
    </div>
  );
}
