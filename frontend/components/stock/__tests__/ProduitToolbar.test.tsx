// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/ui/Input", () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <input
      aria-label={placeholder}
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

import ProduitToolbar from "../ProduitToolbar";

afterEach(cleanup);

describe("ProduitToolbar", () => {
  it("affiche le champ de recherche avec sa valeur actuelle", () => {
    render(<ProduitToolbar recherche="Clavier" setRecherche={vi.fn()} ouvrirForm={vi.fn()} />);
    expect(screen.getByDisplayValue("Clavier")).toBeInTheDocument();
  });

  it("appelle setRecherche lors de la saisie", async () => {
    const user = userEvent.setup();
    const setRecherche = vi.fn();
    render(<ProduitToolbar recherche="" setRecherche={setRecherche} ouvrirForm={vi.fn()} />);

    const champ = screen.getByRole("textbox");
    await user.type(champ, "C");
    expect(setRecherche).toHaveBeenCalled();
  });

  it("appelle ouvrirForm au clic sur Nouveau produit", async () => {
    const user = userEvent.setup();
    const ouvrirForm = vi.fn();
    render(<ProduitToolbar recherche="" setRecherche={vi.fn()} ouvrirForm={ouvrirForm} />);

    await user.click(screen.getByText("Nouveau produit"));
    expect(ouvrirForm).toHaveBeenCalledTimes(1);
  });
});
