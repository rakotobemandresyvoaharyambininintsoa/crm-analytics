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
  default: ({ children, onClick, icon }: any) => (
    <button type="button" onClick={onClick}>
      {icon}
      {children}
    </button>
  ),
}));

import ClientToolbar from "../ClientToolbar";

afterEach(cleanup);

describe("ClientToolbar", () => {
  it("affiche le champ de recherche avec sa valeur actuelle", () => {
    render(<ClientToolbar recherche="Rasoa" setRecherche={vi.fn()} ouvrir={vi.fn()} />);
    expect(screen.getByPlaceholderText("Rechercher un client...")).toHaveValue("Rasoa");
  });

  it("appelle setRecherche lors de la saisie", async () => {
    const user = userEvent.setup();
    const setRecherche = vi.fn();
    render(<ClientToolbar recherche="" setRecherche={setRecherche} ouvrir={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("Rechercher un client..."), "R");
    expect(setRecherche).toHaveBeenCalled();
  });

  it("appelle ouvrir au clic sur Ajouter", async () => {
    const user = userEvent.setup();
    const ouvrir = vi.fn();
    render(<ClientToolbar recherche="" setRecherche={vi.fn()} ouvrir={ouvrir} />);

    await user.click(screen.getByText("Ajouter"));
    expect(ouvrir).toHaveBeenCalledTimes(1);
  });
});
