import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

vi.mock("@/lib/auth", () => ({
  requireRole: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  getClientKey: vi.fn(() => "test-client"),
}));

vi.mock("@/lib/ai/insights", () => ({
  repondreQuestionCRM: vi.fn(),
}));

import { requireRole } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { repondreQuestionCRM } from "@/lib/ai/insights";

function requete(body: any) {
  return new Request("http://localhost/api/ai/chat", {
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

describe("POST /api/ai/chat", () => {
  it("retourne 400 si la question est manquante", async () => {
    const res = await POST(requete({}));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si la question est une chaine vide", async () => {
    const res = await POST(requete({ question: "   " }));
    expect(res.status).toBe(400);
  });

  it("retourne 400 si la question depasse 1000 caracteres", async () => {
    const res = await POST(requete({ question: "a".repeat(1001) }));
    expect(res.status).toBe(400);
  });

  it("retourne la reponse en cas de succes", async () => {
    (repondreQuestionCRM as any).mockResolvedValue({ texte: "Reponse IA", degraded: false });

    const res = await POST(requete({ question: "Combien de clients ?" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.reponse).toBe("Reponse IA");
  });

  it("retourne 429 quand la limite de requetes est atteinte", async () => {
    (checkRateLimit as any).mockReturnValue({ allowed: false, retryAfterSeconds: 60 });

    const res = await POST(requete({ question: "Test" }));
    expect(res.status).toBe(429);
  });

  it("retourne 401 quand requireRole leve UNAUTHORIZED", async () => {
    (requireRole as any).mockRejectedValue(new Error("UNAUTHORIZED"));

    const res = await POST(requete({ question: "Test" }));
    expect(res.status).toBe(401);
  });

  it("retourne 500 en cas d erreur inattendue", async () => {
    (repondreQuestionCRM as any).mockRejectedValue(new Error("Panne serveur"));

    const res = await POST(requete({ question: "Test" }));
    expect(res.status).toBe(500);
  });
});
