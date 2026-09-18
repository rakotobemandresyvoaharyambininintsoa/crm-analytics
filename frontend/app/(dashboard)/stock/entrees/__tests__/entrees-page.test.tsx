// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Entrees from "../page";

afterEach(cleanup);

const produits = [
  { id: 1, nom: "Clavier", quantite: 20 },
  { id: 2, nom: "Souris", quantite: 5 },
];

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

function mockFetchSequence(responses: any[]) {
  let i = 0;
  global.fetch = vi.fn().mockImplementation(() => {
    const json = responses[Math.min(i, responses.length - 1)];
    i += 1;
    return Promise.resolve({ json: async () => json, ok: true });
  });
}

describe("Entrees", () => {
  it("charge et affiche les produits dans la liste deroulante", async () => {
    mockFetchSequence([produits]);
    render(<Entrees />);

    await waitFor(() => {
      expect(screen.getByText(/Clavier/)).toBeInTheDocument();
    });
  });

  it("envoie une entree et affiche une confirmation", async () => {
    const user = userEvent.setup();
    mockFetchSequence([produits, { ok: true }, produits]);

    render(<Entrees />);
    await waitFor(() => screen.getByText(/Clavier/));

    await user.type(screen.getByPlaceholderText(/Quantit/), "10");
    await user.type(screen.getByPlaceholderText("Commentaire"), "Reception fournisseur");

    await user.click(screen.getByText(/l'entr/));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("enregistr"));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/mouvements",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("reinitialise les champs quantite et commentaire apres l envoi", async () => {
    const user = userEvent.setup();
    mockFetchSequence([produits, { ok: true }, produits]);

    render(<Entrees />);
    await waitFor(() => screen.getByText(/Clavier/));

    const champQuantite = screen.getByPlaceholderText(/Quantit/) as HTMLInputElement;
    const champCommentaire = screen.getByPlaceholderText("Commentaire") as HTMLInputElement;

    await user.type(champQuantite, "10");
    await user.type(champCommentaire, "Reception");
    await user.click(screen.getByText(/l'entr/));

    await waitFor(() => {
      expect(champQuantite.value).toBe("");
    });
    expect(champCommentaire.value).toBe("");
  });
});
