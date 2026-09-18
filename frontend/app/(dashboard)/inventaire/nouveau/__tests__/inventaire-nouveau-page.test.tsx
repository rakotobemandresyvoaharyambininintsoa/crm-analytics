// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import NouvelleSession from "../page";

afterEach(cleanup);

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(window, "alert").mockImplementation(() => {});
  pushMock.mockClear();
});

function mockFetchSequence(responses: { json: any; ok?: boolean }[]) {
  let i = 0;
  global.fetch = vi.fn().mockImplementation(() => {
    const r = responses[Math.min(i, responses.length - 1)];
    i += 1;
    return Promise.resolve({ json: async () => r.json, ok: r.ok ?? true });
  });
}

describe("NouvelleSession", () => {
  it("charge les entrepots et utilisateurs dans les listes deroulantes", async () => {
    mockFetchSequence([
      { json: [{ id: 1, nom: "Entrepot A" }] },
      { json: [{ id: 1, nom: "Rasoa" }] },
    ]);

    render(<NouvelleSession />);

    await waitFor(() => {
      expect(screen.getByText("Entrepot A")).toBeInTheDocument();
    });
    expect(screen.getByText("Rasoa")).toBeInTheDocument();
  });

  it("affiche une alerte et ne soumet pas si le nom est vide", async () => {
    mockFetchSequence([{ json: [] }, { json: [] }]);
    const user = userEvent.setup();

    render(<NouvelleSession />);
    await waitFor(() => screen.getByText("Lancer la session"));

    await user.click(screen.getByText("Lancer la session"));

    expect(window.alert).toHaveBeenCalledWith("Le nom de la session est obligatoire");
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("cree la session et redirige en cas de succes", async () => {
    mockFetchSequence([
      { json: [] },
      { json: [] },
      { json: { id: 42 } },
    ]);
    const user = userEvent.setup();

    render(<NouvelleSession />);
    await waitFor(() => screen.getByPlaceholderText(/Inventaire g/));

    await user.type(screen.getByPlaceholderText(/Inventaire g/), "Inventaire Q3");
    await user.click(screen.getByText("Lancer la session"));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/inventaire/42");
    });
  });

  it("affiche une alerte d erreur et ne redirige pas en cas d echec", async () => {
    mockFetchSequence([
      { json: [] },
      { json: [] },
      { json: { error: "Erreur serveur" }, ok: false },
    ]);
    const user = userEvent.setup();

    render(<NouvelleSession />);
    await waitFor(() => screen.getByPlaceholderText(/Inventaire g/));

    await user.type(screen.getByPlaceholderText(/Inventaire g/), "Inventaire Q3");
    await user.click(screen.getByText("Lancer la session"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erreur serveur");
    });
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("active la case double comptage au clic", async () => {
    mockFetchSequence([{ json: [] }, { json: [] }]);
    const user = userEvent.setup();

    render(<NouvelleSession />);
    await waitFor(() => screen.getByText("Activer le double comptage"));

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
