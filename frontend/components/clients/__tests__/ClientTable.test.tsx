// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientTable from "../ClientTable";

afterEach(cleanup);

const clients = [
  { id: 1, nom: "Rasoa", entreprise: "Rasoa SARL", email: "rasoa@test.mg" },
  { id: 2, nom: "Andry", entreprise: "Andry EI", email: "andry@test.mg" },
];

describe("ClientTable", () => {
  it("affiche un etat vide quand il n y a aucun client", () => {
    render(<ClientTable clients={[]} supprimer={vi.fn()} modifier={vi.fn()} voir={vi.fn()} />);
    expect(screen.getByText("Aucun client trouvÃ©")).toBeInTheDocument();
  });

  it("affiche les clients dans le tableau", () => {
    render(<ClientTable clients={clients} supprimer={vi.fn()} modifier={vi.fn()} voir={vi.fn()} />);
    expect(screen.getByText("Rasoa")).toBeInTheDocument();
    expect(screen.getByText("Andry EI")).toBeInTheDocument();
  });

  it("appelle voir avec le bon id au clic sur l icone Voir", async () => {
    const user = userEvent.setup();
    const voir = vi.fn();
    render(<ClientTable clients={clients} supprimer={vi.fn()} modifier={vi.fn()} voir={voir} />);

    const boutonsVoir = screen.getAllByTitle("Voir");
    await user.click(boutonsVoir[0]);

    expect(voir).toHaveBeenCalledWith(1);
  });

  it("appelle modifier avec le client complet au clic sur l icone Modifier", async () => {
    const user = userEvent.setup();
    const modifier = vi.fn();
    render(<ClientTable clients={clients} supprimer={vi.fn()} modifier={modifier} voir={vi.fn()} />);

    const boutonsModifier = screen.getAllByTitle("Modifier");
    await user.click(boutonsModifier[1]);

    expect(modifier).toHaveBeenCalledWith(clients[1]);
  });

  it("appelle supprimer avec le bon id au clic sur l icone Supprimer", async () => {
    const user = userEvent.setup();
    const supprimer = vi.fn();
    render(<ClientTable clients={clients} supprimer={supprimer} modifier={vi.fn()} voir={vi.fn()} />);

    const boutonsSupprimer = screen.getAllByTitle("Supprimer");
    await user.click(boutonsSupprimer[0]);

    expect(supprimer).toHaveBeenCalledWith(1);
  });
});
