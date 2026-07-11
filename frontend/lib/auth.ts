import { SignJWT, jwtVerify } from "jose";

import { cookies } from "next/headers";

// Aucune valeur par défaut ici : un secret JWT prévisible dans le code
// permettrait à n'importe qui de forger une session admin. L'app doit
// refuser de démarrer plutôt que de tourner avec un secret connu.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  throw new Error(
    "JWT_SECRET manquant ou trop court. Définissez une valeur aléatoire d'au moins 16 caractères dans .env (voir .env.example)."
  );
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

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