import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/lib/auth", () => ({
  requireRole: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  getClientKey: vi.fn(() => "test-client"),
}));

vi.mock("@/lib/ai/insights", () => ({
  genererInsightsBruts: vi.fn(),
  genererSyntheseIA: vi.fn(),
}));

import { requireRole } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { genererInsightsBruts, genererSyntheseIA } from "@/lib/ai/insights";

function requete() {
  return new Request("http://localhost/api/ai/insights", { method: "GET" });
}

beforeEach(() => {
  vi.clearAllMocks();
  (requireRole as any).mockResolvedValue(undefined);
  (checkRateLimit as any).mockReturnValue({ allowed: true });
});

describe("GET /api/ai/insights", () => {
  it("retourne les insights et la synthese en cas de succes", async () => {
    (genererInsightsBruts as any).mockResolvedValue([{ id: "1", titre: "Insight test" }]);
    (genererSyntheseIA as any).mockResolvedValue({ texte: "Synthese generee", degraded: false });

    const res = await GET(requete());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.insights).toHaveLength(1);
    expect(json.synthese).toBe("Synthese generee");
    expect(json.syntheseDegraded).toBe(false);
  });

  it("retourne 429 quand la limite de requetes est atteinte", async () => {
    (checkRateLimit as any).mockReturnValue({ allowed: false, retryAfterSeconds: 60 });

    const res = await GET(requete());
    expect(res.status).toBe(429);
  });

  it("retourne 401 quand requireRole leve UNAUTHORIZED", async () => {
    (requireRole as any).mockRejectedValue(new Error("UNAUTHORIZED"));

    const res = await GET(requete());
    expect(res.status).toBe(401);
  });

  it("retourne 403 quand requireRole leve FORBIDDEN", async () => {
    (requireRole as any).mockRejectedValue(new Error("FORBIDDEN"));

    const res = await GET(requete());
    expect(res.status).toBe(403);
  });

  it("retourne 500 en cas d erreur inattendue", async () => {
    (genererInsightsBruts as any).mockRejectedValue(new Error("Panne serveur"));

    const res = await GET(requete());
    expect(res.status).toBe(500);
  });
});
