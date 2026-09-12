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
  default: ({ children, onClick, icon }: any) => (
    <button type="button" onClick={onClick}>
      {icon}
      {children}
    </button>
  ),
}));

import FactureForm from "../FactureForm";

afterEach(cleanup);

const formVide = { montant: "", tva: "", remise: "", statut: "Brouillon" };

describe("FactureForm", () => {
  it("affiche les champs montant, tva et remise", () => {
    render(<FactureForm form={formVide} changer={vi.fn()} creer={vi.fn()} />);
    expect(screen.getByPlaceholderText("Montant")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("TVA")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Remise")).toBeInTheDocument();
  });

  it("affiche le select de statut avec ses options", () => {
    render(<FactureForm form={formVide} changer={vi.fn()} creer={vi.fn()} />);
    expect(screen.getByText("Brouillon")).toBeInTheDocument();
    expect(screen.getByText("Payée")).toBeInTheDocument();
    expect(screen.getByText("Retard")).toBeInTheDocument();
  });

  it("appelle changer lors de la saisie du montant", async () => {
    const user = userEvent.setup();
    const changer = vi.fn();
    render(<FactureForm form={formVide} changer={changer} creer={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("Montant"), "5");
    expect(changer).toHaveBeenCalled();
  });

  it("appelle creer au clic sur Creer facture", async () => {
    const user = userEvent.setup();
    const creer = vi.fn();
    render(<FactureForm form={formVide} changer={vi.fn()} creer={creer} />);

    await user.click(screen.getByText("Créer facture"));
    expect(creer).toHaveBeenCalledTimes(1);
  });
});
