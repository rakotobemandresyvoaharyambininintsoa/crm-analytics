import { describe, it, expect } from "vitest";
import { SignJWT } from "jose";
import { signSession, verifySession, type SessionPayload } from "@/lib/auth";

const samplePayload: SessionPayload = {
  id: 1,
  nom: "Test User",
  email: "test@crm.com",
  role: "ADMIN",
};

describe("signSession / verifySession", () => {
  it("round-trips a valid session payload", async () => {
    const token = await signSession(samplePayload);
    const session = await verifySession(token);

    expect(session).not.toBeNull();
    expect(session?.id).toBe(samplePayload.id);
    expect(session?.email).toBe(samplePayload.email);
    expect(session?.role).toBe(samplePayload.role);
  });

  it("returns null for an undefined token", async () => {
    const session = await verifySession(undefined);
    expect(session).toBeNull();
  });

  it("returns null for a malformed token", async () => {
    const session = await verifySession("not-a-jwt");
    expect(session).toBeNull();
  });

  it("returns null for a token signed with a different secret", async () => {
    // Simulates an attacker who doesn't know JWT_SECRET trying to forge a session
    // (e.g. exploiting the exact "change-moi-en-production" fallback bug this
    // app used to have before it was fixed).
    const forgedKey = new TextEncoder().encode("a-completely-different-secret-value");
    const forgedToken = await new SignJWT({ ...samplePayload, role: "ADMIN" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(forgedKey);

    const session = await verifySession(forgedToken);
    expect(session).toBeNull();
  });

  it("returns null for an expired token", async () => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const expiredToken = await new SignJWT({ ...samplePayload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("-1s") // already expired
      .sign(secret);

    const session = await verifySession(expiredToken);
    expect(session).toBeNull();
  });
});
