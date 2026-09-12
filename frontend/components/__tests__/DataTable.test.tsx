// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataTable, { Column } from "../DataTable";

afterEach(cleanup);

type Ligne = { id: number; nom: string; montant: number };

const donnees: Ligne[] = [
  { id: 1, nom: "Zebra", montant: 300 },
  { id: 2, nom: "Alpha", montant: 100 },
  { id: 3, nom: "Meso", montant: 200 },
];

const colonnes: Column<Ligne>[] = [
  { key: "nom", header: "Nom", sortable: true },
  { key: "montant", header: "Montant", sortable: true },
];

describe("DataTable", () => {
  it("affiche un etat de chargement", () => {
    render(<DataTable data={donnees} columns={colonnes} loading />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("affiche un message quand il n y a aucune donnee", () => {
    render(<DataTable data={[]} columns={colonnes} />);
    expect(screen.getByText(/Aucune/)).toBeInTheDocument();
  });

  it("affiche les lignes de donnees fournies", () => {
    render(<DataTable data={donnees} columns={colonnes} />);
    expect(screen.getByText("Zebra")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Meso")).toBeInTheDocument();
  });

  it("filtre les lignes selon la recherche", async () => {
    const user = userEvent.setup();
    render(<DataTable data={donnees} columns={colonnes} />);

    await user.type(screen.getByPlaceholderText("Rechercher..."), "Alpha");

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Zebra")).not.toBeInTheDocument();
  });

  it("ne montre pas la barre de recherche quand searchable est faux", () => {
    render(<DataTable data={donnees} columns={colonnes} searchable={false} />);
    expect(screen.queryByPlaceholderText("Rechercher...")).not.toBeInTheDocument();
  });

  it("trie les lignes au clic sur un en-tete triable", async () => {
    const user = userEvent.setup();
    render(<DataTable data={donnees} columns={colonnes} />);

    await user.click(screen.getByText("Nom"));

    const lignes = screen.getAllByRole("row").slice(1);
    expect(lignes[0]).toHaveTextContent("Alpha");
  });

  it("applique la pagination avec un pageSize reduit", async () => {
    const user = userEvent.setup();
    render(<DataTable data={donnees} columns={colonnes} pageSize={1} />);

    expect(screen.getByText("Page 1 / 3")).toBeInTheDocument();

    await user.click(screen.getByText("Next"));
    expect(screen.getByText("Page 2 / 3")).toBeInTheDocument();

    await user.click(screen.getByText("Prev"));
    expect(screen.getByText("Page 1 / 3")).toBeInTheDocument();
  });

  it("appelle onRowClick avec la ligne cliquee", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<DataTable data={donnees} columns={colonnes} onRowClick={onRowClick} />);

    await user.click(screen.getByText("Alpha"));

    expect(onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ nom: "Alpha" })
    );
  });

  it("affiche la colonne actions quand fournie", () => {
    render(
      <DataTable
        data={donnees}
        columns={colonnes}
        actions={(row) => <button type="button">Editer {row.nom}</button>}
      />
    );
    expect(screen.getByText("Editer Zebra")).toBeInTheDocument();
  });
});
