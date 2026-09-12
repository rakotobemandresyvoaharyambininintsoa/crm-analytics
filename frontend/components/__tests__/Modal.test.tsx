// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../Modal";

afterEach(cleanup);

describe("Modal", () => {
  it("ne rend rien quand estOuvert est faux", () => {
    const { container } = render(
      <Modal estOuvert={false} onClose={vi.fn()} titre="Titre" enfants={<p>Contenu</p>} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("affiche le titre et le contenu quand estOuvert est vrai", () => {
    render(
      <Modal estOuvert={true} onClose={vi.fn()} titre="Mon titre" enfants={<p>Mon contenu</p>} />
    );
    expect(screen.getByText("Mon titre")).toBeInTheDocument();
    expect(screen.getByText("Mon contenu")).toBeInTheDocument();
  });

  it("appelle onClose au clic sur le fond (overlay)", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal estOuvert={true} onClose={onClose} titre="Titre" enfants={<p>Contenu</p>} />
    );

    await user.click(screen.getByLabelText("Fermer la fenêtre"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("n appelle pas onClose au clic a l interieur de la boite de dialogue", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal estOuvert={true} onClose={onClose} titre="Titre" enfants={<p>Contenu</p>} />
    );

    await user.click(screen.getByText("Titre"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("appelle onClose au clic sur le bouton de fermeture", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal estOuvert={true} onClose={onClose} titre="Titre" enfants={<p>Contenu</p>} />
    );

    const boutons = screen.getAllByRole("button");
    await user.click(boutons[boutons.length - 1]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("appelle onClose quand la touche Echap est pressee", () => {
    const onClose = vi.fn();
    render(
      <Modal estOuvert={true} onClose={onClose} titre="Titre" enfants={<p>Contenu</p>} />
    );

    fireEvent.keyDown(screen.getByLabelText("Fermer la fenêtre"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
