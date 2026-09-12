// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../Pagination";

afterEach(cleanup);

describe("Pagination", () => {
  it("ne rend rien quand il n y a qu une seule page ou moins", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("affiche le numero de page courant et le total", () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByText("Page 2 sur 5")).toBeInTheDocument();
  });

  it("desactive le bouton precedent sur la premiere page", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);
    const boutons = screen.getAllByRole("button");
    expect(boutons[0]).toBeDisabled();
  });

  it("desactive le bouton suivant sur la derniere page", () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />);
    const boutons = screen.getAllByRole("button");
    expect(boutons[boutons.length - 1]).toBeDisabled();
  });

  it("appelle onPageChange avec la page precedente au clic sur la fleche gauche", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);

    const boutons = screen.getAllByRole("button");
    await user.click(boutons[0]);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("appelle onPageChange avec la page suivante au clic sur la fleche droite", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);

    const boutons = screen.getAllByRole("button");
    await user.click(boutons[boutons.length - 1]);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("appelle onPageChange avec le bon numero au clic sur une page precise", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByText("3"));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("n affiche que les pages proches de la page courante plus la premiere et la derniere", () => {
    render(<Pagination page={10} totalPages={20} onPageChange={vi.fn()} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });
});
