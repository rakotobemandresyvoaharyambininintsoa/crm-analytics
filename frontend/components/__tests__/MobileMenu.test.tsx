// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../Sidebar", () => ({
  default: ({ role }: { role: string }) => <div data-testid="sidebar-stub">{role}</div>,
}));

import MobileMenu from "../MobileMenu";

afterEach(cleanup);

describe("MobileMenu", () => {
  it("n affiche pas le menu par defaut", () => {
    render(<MobileMenu role="Admin" />);
    expect(screen.queryByTestId("sidebar-stub")).not.toBeInTheDocument();
  });

  it("ouvre le menu et affiche la Sidebar au clic sur le bouton", async () => {
    const user = userEvent.setup();
    render(<MobileMenu role="Admin" />);

    await user.click(screen.getByRole("button", { name: /Menu/ }));

    expect(screen.getByTestId("sidebar-stub")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-stub")).toHaveTextContent("Admin");
  });

  it("ferme le menu au clic sur le bouton Fermer", async () => {
    const user = userEvent.setup();
    render(<MobileMenu role="Admin" />);

    await user.click(screen.getByRole("button", { name: /Menu/ }));
    expect(screen.getByTestId("sidebar-stub")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Fermer/ }));
    expect(screen.queryByTestId("sidebar-stub")).not.toBeInTheDocument();
  });
});
