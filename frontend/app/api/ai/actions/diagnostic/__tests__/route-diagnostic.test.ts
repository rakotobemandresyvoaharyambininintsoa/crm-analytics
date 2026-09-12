import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

vi.mock("@/lib/auth", () => ({
  requireRole: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  getClientKey: vi.fn(() => "test-client"),
}));

vi.mock("@/lib/ai/actions", () => ({
  genererDiagnosticClient: vi.fn(),
}));

import { requireRole } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { genererDiagnosticClient } from "@/lib/ai/actions";

function requete(body: any) {
  return new Request("http://localhost/api/ai/actions/diagnostic", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  (requireRole as any).mockResolvedValue(undefined);
  (checkRateLimit as any).mockReturnValue({ allowed: true });
});

describe("POST /api/ai/actions/diagnostic", () => {
  it("retourne 400 si clientId est manquant", async () => {
    const res = await POST(requete({}));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si clientId n est pas un nombre", async () => {
    const res = await POST(requete({ clientId: "abc" }));
    expect(res.status).toBe(400);
  });

  it("retourne le diagnostic et degraded en cas de succes", async () => {
    (genererDiagnosticClient as any).mockResolvedValue({ texte: "Diagnostic genere", degraded: false });

    const res = await POST(requete({ clientId: 1 }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.diagnostic).toBe("Diagnostic genere");
  });

  it("retourne 429 quand la limite de requetes est atteinte", async () => {
    (checkRateLimit as any).mockReturnValue({ allowed: false, retryAfterSeconds: 60 });

    const res = await POST(requete({ clientId: 1 }));
    expect(res.status).toBe(429);
  });

  it("retourne 401 quand requireRole leve UNAUTHORIZED", async () => {
    (requireRole as any).mockRejectedValue(new Error("UNAUTHORIZED"));

    const res = await POST(requete({ clientId: 1 }));
    expect(res.status).toBe(401);
  });

  it("retourne 403 quand requireRole leve FORBIDDEN", async () => {
    (requireRole as any).mockRejectedValue(new Error("FORBIDDEN"));

    const res = await POST(requete({ clientId: 1 }));
    expect(res.status).toBe(403);
  });

  it("retourne 500 en cas d erreur inattendue", async () => {
    (genererDiagnosticClient as any).mockRejectedValue(new Error("Panne serveur"));

    const res = await POST(requete({ clientId: 1 }));
    expect(res.status).toBe(500);
  });
});
