// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Parametres from "../page";

afterEach(cleanup);

beforeEach(() => {
  vi.restoreAllMocks();
});

const parametresServeur = {
  frequence: "Trimestrielle",
  doubleComptage: false,
  toleranceEcart: "5",
  validationObligatoire: true,
  signatureObligatoire: false,
  notifications: true,
  rappelsAutomatiques: true,
};

function mockFetchSequence(responses: { json: any; ok?: boolean }[]) {
  let i = 0;
  global.fetch = vi.fn().mockImplementation(() => {
    const r = responses[Math.min(i, responses.length - 1)];
    i += 1;
    return Promise.resolve({ json: async () => r.json, ok: r.ok ?? true });
  });
}

describe("Parametres", () => {
  it("affiche un etat de chargement puis le formulaire", async () => {
    mockFetchSequence([{ json: parametresServeur }]);
    render(<Parametres />);

    expect(screen.getByText(/Chargement des param/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Enregistrer")).toBeInTheDocument();
    });
  });

  it("affiche les valeurs recuperees depuis l API", async () => {
    mockFetchSequence([{ json: parametresServeur }]);
    render(<Parametres />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    });
  });

  it("conserve les valeurs par defaut si l API echoue", async () => {
    mockFetchSequence([{ json: {}, ok: false }]);
    render(<Parametres />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    });
  });

  it("bascule un toggle au clic", async () => {
    const user = userEvent.setup();
    mockFetchSequence([{ json: parametresServeur }]);

    render(<Parametres />);
    await waitFor(() => screen.getByText("Double comptage obligatoire"));

    const toggles = screen.getAllByRole("checkbox");
    const toggleDoubleComptage = toggles[0];

    expect(toggleDoubleComptage).not.toBeChecked();
    await user.click(toggleDoubleComptage);
    expect(toggleDoubleComptage).toBeChecked();
  });

  it("appelle l API en PUT avec les parametres au clic sur Enregistrer", async () => {
    const user = userEvent.setup();
    mockFetchSequence([{ json: parametresServeur }, { json: { ok: true } }]);

    render(<Parametres />);
    await waitFor(() => screen.getByText("Enregistrer"));

    await user.click(screen.getByText("Enregistrer"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/inventaires/parametres",
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  it("met a jour la tolerance d ecart lors de la saisie", async () => {
    const user = userEvent.setup();
    mockFetchSequence([{ json: parametresServeur }]);

    render(<Parametres />);
    await waitFor(() => screen.getByDisplayValue("5"));

    const champTolerance = screen.getByDisplayValue("5") as HTMLInputElement;
    await user.clear(champTolerance);
    await user.type(champTolerance, "8");

    expect(champTolerance.value).toBe("8");
  });
});
