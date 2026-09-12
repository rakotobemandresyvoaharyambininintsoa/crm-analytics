// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

afterEach(cleanup);

describe("Button", () => {
  it("affiche le contenu enfant", () => {
    render(<Button>Valider</Button>);
    expect(screen.getByText("Valider")).toBeInTheDocument();
  });

  it("applique la classe du variant primary par defaut", () => {
    render(<Button>Valider</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-violet-600");
  });

  it("applique la classe du variant danger quand precise", () => {
    render(<Button variant="danger">Supprimer</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");
  });

  it("applique la classe fullWidth quand demande", () => {
    render(<Button fullWidth>Valider</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("affiche l icone fournie quand pas en chargement", () => {
    render(<Button icon={<span data-testid="icone-test" />}>Valider</Button>);
    expect(screen.getByTestId("icone-test")).toBeInTheDocument();
  });

  it("affiche Chargement... et desactive le bouton quand loading est vrai", () => {
    render(<Button loading>Valider</Button>);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("est desactive quand disabled est passe explicitement", () => {
    render(<Button disabled>Valider</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("declenche onClick au clic quand actif", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Valider</Button>);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("ne declenche pas onClick quand desactive par loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Valider
      </Button>
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });
});
