// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Header from "../Header";

afterEach(cleanup);

describe("Header", () => {
  it("affiche le titre du CRM", () => {
    render(<Header user={null} />);
    expect(screen.getByText("CRM Analytics")).toBeInTheDocument();
  });

  it("affiche des valeurs par defaut quand user est null", () => {
    render(<Header user={null} />);
    expect(screen.getByText("Utilisateur")).toBeInTheDocument();
    expect(screen.getByText("CRM Pro")).toBeInTheDocument();
  });

  it("affiche le nom et le role de l utilisateur quand fournis", () => {
    render(
      <Header
        user={{ nom: "Rasoa", role: "Admin" } as any}
      />
    );
    expect(screen.getByText("Rasoa")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("affiche le champ de recherche", () => {
    render(<Header user={null} />);
    expect(screen.getByPlaceholderText("Rechercher...")).toBeInTheDocument();
  });
});
