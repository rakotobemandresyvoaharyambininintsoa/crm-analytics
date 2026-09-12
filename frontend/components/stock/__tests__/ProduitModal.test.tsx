// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProduitModal from "../ProduitModal";

afterEach(cleanup);

describe("ProduitModal", () => {
  it("ne rend rien quand ouvert est faux", () => {
    const { container } = render(
      <ProduitModal ouvert={false} fermer={vi.fn()}>
        <p>Contenu</p>
      </ProduitModal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("affiche les enfants quand ouvert est vrai", () => {
    render(
      <ProduitModal ouvert={true} fermer={vi.fn()}>
        <p>Contenu du modal</p>
      </ProduitModal>
    );
    expect(screen.getByText("Contenu du modal")).toBeInTheDocument();
  });

  it("appelle fermer au clic sur le bouton Fermer", async () => {
    const user = userEvent.setup();
    const fermer = vi.fn();
    render(
      <ProduitModal ouvert={true} fermer={fermer}>
        <p>Contenu</p>
      </ProduitModal>
    );

    await user.click(screen.getByText("Fermer"));
    expect(fermer).toHaveBeenCalledTimes(1);
  });
});
