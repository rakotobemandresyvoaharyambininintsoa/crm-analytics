"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";

import ProduitStats from "@/components/stock/ProduitStats";
import ProduitToolbar from "@/components/stock/ProduitToolbar";
import ProduitForm from "@/components/stock/ProduitForm";
import ProduitTable from "@/components/stock/ProduitTable";

export default function ProduitsPage() {
  const [produits, setProduits] = useState<any[]>([]);
  const [recherche, setRecherche] = useState("");
  const [form, setForm] = useState({
    reference: "",
    nom: "",
    categorie: "",
    fournisseur: "",
    prixAchat: "",
    prixVente: "",
    quantite: "",
  });

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch("/api/produits");
    setProduits(await res.json());
  }

  function changer(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function ajouter() {
    await fetch("/api/produits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    charger();
  }

  async function supprimer(id: number) {
    await fetch("/api/produits?id=" + id, {
      method: "DELETE",
    });

    charger();
  }

  async function mouvementStock(id: number, type: string) {
    const quantite = prompt("Quantité ?");

    if (!quantite) return;

    await fetch("/api/mouvements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produitId: id,
        type,
        quantite: Number(quantite),
      }),
    });

    charger();
  }

  const liste = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const valeurStock = produits.reduce(
    (a, b) => a + b.quantite * b.prixVente,
    0
  );

  const alertes = produits.filter((p) => p.quantite <= p.seuilAlerte).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Produits
            </h1>
            <p className="text-sm text-white/40">
              Gérez votre catalogue et vos stocks
            </p>
          </div>
        </div>

        <ProduitStats
          produits={produits.length}
          valeurStock={valeurStock}
          alertes={alertes}
        />

        <ProduitToolbar
          recherche={recherche}
          setRecherche={setRecherche}
          ouvrirForm={() => {}}
        />

        <ProduitForm form={form} changer={changer} ajouter={ajouter} />

        <ProduitTable
          produits={liste}
          supprimer={supprimer}
          mouvementStock={mouvementStock}
        />
      </div>
    </div>
  );
}

