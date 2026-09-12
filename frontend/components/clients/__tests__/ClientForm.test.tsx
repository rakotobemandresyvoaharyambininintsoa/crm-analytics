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

import ClientForm from "../ClientForm";

afterEach(cleanup);

const formVide = {
  nom: "",
  entreprise: "",
  email: "",
  telephone: "",
  ville: "",
  pays: "",
};

describe("ClientForm", () => {
  it("affiche tous les champs du formulaire", () => {
    render(<ClientForm form={formVide} changer={vi.fn()} ajouter={vi.fn()} />);

    expect(screen.getByPlaceholderText("Nom")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Entreprise")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Téléphone")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ville")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Pays")).toBeInTheDocument();
  });

  it("affiche les valeurs actuelles du formulaire", () => {
    render(
      <ClientForm
        form={{ ...formVide, nom: "Rasoa", email: "rasoa@test.mg" }}
        changer={vi.fn()}
        ajouter={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText("Nom")).toHaveValue("Rasoa");
    expect(screen.getByPlaceholderText("Email")).toHaveValue("rasoa@test.mg");
  });

  it("appelle changer lors de la saisie dans un champ", async () => {
    const user = userEvent.setup();
    const changer = vi.fn();
    render(<ClientForm form={formVide} changer={changer} ajouter={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("Nom"), "R");
    expect(changer).toHaveBeenCalled();
  });

  it("appelle ajouter au clic sur Enregistrer", async () => {
    const user = userEvent.setup();
    const ajouter = vi.fn();
    render(<ClientForm form={formVide} changer={vi.fn()} ajouter={ajouter} />);

    await user.click(screen.getByText("Enregistrer"));
    expect(ajouter).toHaveBeenCalledTimes(1);
  });
});
