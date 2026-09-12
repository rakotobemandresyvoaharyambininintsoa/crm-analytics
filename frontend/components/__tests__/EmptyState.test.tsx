// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Inbox } from "lucide-react";
import EmptyState from "../EmptyState";

afterEach(cleanup);

describe("EmptyState", () => {
  it("affiche le titre fourni", () => {
    render(<EmptyState titre="Aucun element" />);
    expect(screen.getByText("Aucun element")).toBeInTheDocument();
  });

  it("n affiche pas de description quand elle n est pas fournie", () => {
    const { container } = render(<EmptyState titre="Aucun element" />);
    const paragraphes = container.querySelectorAll("p");
    expect(paragraphes).toHaveLength(1);
  });

  it("affiche la description quand elle est fournie", () => {
    render(<EmptyState titre="Aucun element" description="Ajoutez-en un" />);
    expect(screen.getByText("Ajoutez-en un")).toBeInTheDocument();
  });

  it("n affiche pas d icone quand aucune n est fournie", () => {
    const { container } = render(<EmptyState titre="Aucun element" />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("affiche l icone quand elle est fournie", () => {
    const { container } = render(<EmptyState titre="Aucun element" icon={Inbox} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("n affiche pas de bouton d action quand action n est pas fournie", () => {
    render(<EmptyState titre="Aucun element" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("affiche le bouton d action et declenche son onClick au clic", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState
        titre="Aucun element"
        action={{ label: "Creer", onClick }}
      />
    );

    await user.click(screen.getByText("Creer"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
