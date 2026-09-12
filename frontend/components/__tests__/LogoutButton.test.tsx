// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

import LogoutButton from "../LogoutButton";

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn().mockResolvedValue({ ok: true });
});

describe("LogoutButton", () => {
  it("affiche l icone de deconnexion par defaut", () => {
    const { container } = render(<LogoutButton />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("appelle l API de logout puis redirige vers /login au clic", async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/logout", { method: "POST" });
    });
    expect(pushMock).toHaveBeenCalledWith("/login");
    expect(refreshMock).toHaveBeenCalled();
  });

  it("redirige quand meme vers /login si l appel API echoue", async () => {
    (global.fetch as any).mockRejectedValue(new Error("Erreur reseau"));
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });
});
