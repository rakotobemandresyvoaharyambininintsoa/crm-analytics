// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProduitTable from "../ProduitTable";

afterEach(cleanup);

const produits = [
  {
    id: 1,
    reference: "REF-1",
    nom: "Clavier",
    categorie: "Informatique",
    fournisseur: "FournA",
    quantite: 2,
    prixAchat: 1000,
    prixVente: 2000,
    seuilAlerte: 5,
  },
  {
    id: 2,
    reference: "REF-2",
    nom: "Souris",
    categorie: "Informatique",
    fournisseur: "FournB",
    quantite: 50,
    prixAchat: 500,
    prixVente: 900,
    seuilAlerte: 5,
  },
];

describe("ProduitTable", () => {
  it("affiche les produits fournis", () => {
    render(<ProduitTable produits={produits} supprimer={vi.fn()} mouvementStock={vi.fn()} />);
    expect(screen.getByText("Clavier")).toBeInTheDocument();
    expect(screen.getByText("Souris")).toBeInTheDocument();
  });

  it("met en evidence la quantite en dessous du seuil d alerte", () => {
    render(<ProduitTable produits={produits} supprimer={vi.fn()} mouvementStock={vi.fn()} />);
    const quantiteCritique = screen.getByText("2");
    expect(quantiteCritique).toHaveClass("text-red-400");
  });

  it("appelle mouvementStock avec ENTREE au clic sur le bouton plus", async () => {
    const user = userEvent.setup();
    const mouvementStock = vi.fn();
    render(<ProduitTable produits={produits} supprimer={vi.fn()} mouvementStock={mouvementStock} />);

    const boutonsPlus = screen.getAllByText("+");
    await user.click(boutonsPlus[0]);

    expect(mouvementStock).toHaveBeenCalledWith(1, "ENTREE");
  });

  it("appelle mouvementStock avec SORTIE au clic sur le bouton moins", async () => {
    const user = userEvent.setup();
    const mouvementStock = vi.fn();
    render(<ProduitTable produits={produits} supprimer={vi.fn()} mouvementStock={mouvementStock} />);

    const boutonsMoins = screen.getAllByText("-");
    await user.click(boutonsMoins[1]);

    expect(mouvementStock).toHaveBeenCalledWith(2, "SORTIE");
  });

  it("appelle supprimer avec le bon id au clic sur X", async () => {
    const user = userEvent.setup();
    const supprimer = vi.fn();
    render(<ProduitTable produits={produits} supprimer={supprimer} mouvementStock={vi.fn()} />);

    const boutonsX = screen.getAllByText("X");
    await user.click(boutonsX[0]);

    expect(supprimer).toHaveBeenCalledWith(1);
  });
});
