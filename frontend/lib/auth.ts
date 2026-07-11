import { SignJWT, jwtVerify } from "jose";

import { cookies } from "next/headers";
// ⚠️ Mets une vraie valeur secrète dans ton .env :
// JWT_SECRET="une-longue-chaine-aleatoire-et-privee"
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-moi-en-production"
);

export interface SessionPayload {
  id: number;
  nom: string;
  email: string;
  role: string;
}

// Crée un JWT signé contenant les infos utilisateur, valable 8h
export async function signSession(payload: SessionPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

// Vérifie et décode le JWT. Retourne null si absent/invalide/expiré.
export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}


export async function requireRole(
  allowedRoles: string[]
): Promise<SessionPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get("crm_session")?.value;
  const session = await verifySession(token);

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }

  return session;
}