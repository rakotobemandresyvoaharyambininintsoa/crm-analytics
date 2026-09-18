// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sorties from "../page";

afterEach(cleanup);

const produits = [
  { id: 1, nom: "Clavier", quantite: 20 },
  { id: 2, nom: "Souris", quantite: 5 },
];

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

function mockFetchSequence(responses: { json: any; ok?: boolean }[]) {
  let i = 0;
  global.fetch = vi.fn().mockImplementation(() => {
    const r = responses[Math.min(i, responses.length - 1)];
    i += 1;
    return Promise.resolve({ json: async () => r.json, ok: r.ok ?? true });
  });
}

describe("Sorties", () => {
  it("charge et affiche les produits dans la liste deroulante", async () => {
    mockFetchSequence([{ json: produits }]);
    render(<Sorties />);

    await waitFor(() => {
      expect(screen.getByText(/Clavier/)).toBeInTheDocument();
    });
  });

  it("envoie une sortie et affiche une confirmation en cas de succes", async () => {
    const user = userEvent.setup();
    mockFetchSequence([
      { json: produits },
      { json: { ok: true } },
      { json: produits },
    ]);

    render(<Sorties />);
    await waitFor(() => screen.getByText(/Clavier/));

    const champQuantite = screen.getByPlaceholderText(/Quantit/);
    await user.type(champQuantite, "3");

    await user.click(screen.getByText("Valider la sortie"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("enregistr"));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/mouvements",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("affiche une alerte d erreur quand l API refuse la sortie", async () => {
    const user = userEvent.setup();
    mockFetchSequence([
      { json: produits },
      { json: { error: "Stock insuffisant" }, ok: false },
    ]);

    render(<Sorties />);
    await waitFor(() => screen.getByText(/Clavier/));

    await user.click(screen.getByText("Valider la sortie"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Stock insuffisant");
    });
  });
});
