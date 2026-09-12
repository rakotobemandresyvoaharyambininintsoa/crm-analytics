// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/ui/Input", () => ({
  default: ({ name, value, onChange, placeholder }: any) => (
    <input
      aria-label={placeholder}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
}));

vi.mock("@/components/ui/Button", () => ({
  default: ({ children, onClick }: any) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

import ProduitForm from "../ProduitForm";

afterEach(cleanup);

const formVide = {
  reference: "",
  nom: "",
  categorie: "",
  fournisseur: "",
  prixAchat: "",
  prixVente: "",
  quantite: "",
};

describe("ProduitForm", () => {
  it("affiche tous les champs du formulaire produit", () => {
    render(<ProduitForm form={formVide} changer={vi.fn()} ajouter={vi.fn()} />);

    expect(screen.getByPlaceholderText("Référence")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nom")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Catégorie")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Fournisseur")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Prix achat")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Prix vente")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Quantité")).toBeInTheDocument();
  });

  it("affiche les valeurs actuelles du formulaire", () => {
    render(
      <ProduitForm
        form={{ ...formVide, nom: "Clavier", quantite: "10" }}
        changer={vi.fn()}
        ajouter={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText("Nom")).toHaveValue("Clavier");
    expect(screen.getByPlaceholderText("Quantité")).toHaveValue("10");
  });

  it("appelle changer lors de la saisie", async () => {
    const user = userEvent.setup();
    const changer = vi.fn();
    render(<ProduitForm form={formVide} changer={changer} ajouter={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("Nom"), "C");
    expect(changer).toHaveBeenCalled();
  });

  it("appelle ajouter au clic sur Enregistrer", async () => {
    const user = userEvent.setup();
    const ajouter = vi.fn();
    render(<ProduitForm form={formVide} changer={vi.fn()} ajouter={ajouter} />);

    await user.click(screen.getByText("Enregistrer"));
    expect(ajouter).toHaveBeenCalledTimes(1);
  });
});
