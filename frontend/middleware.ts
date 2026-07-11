import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

// Rôles autorisés par section — reflète exactement le filtre déjà présent
// dans Sidebar.tsx, mais appliqué ici côté serveur (donc impossible à contourner).
const ROUTES_PROTEGEES: { prefix: string; roles: string[] }[] = [
  { prefix: "/dashboard", roles: ["ADMIN", "COMMERCIAL", "MAGASINIER"] },
  { prefix: "/clients", roles: ["ADMIN", "COMMERCIAL"] },
  { prefix: "/activites", roles: ["ADMIN", "COMMERCIAL"] },
  { prefix: "/opportunites", roles: ["ADMIN", "COMMERCIAL"] },
  { prefix: "/factures", roles: ["ADMIN", "COMMERCIAL"] },
  { prefix: "/rapports", roles: ["ADMIN", "COMMERCIAL", "MAGASINIER"] },
  { prefix: "/stock", roles: ["ADMIN", "MAGASINIER"] },
  { prefix: "/inventaire", roles: ["ADMIN", "MAGASINIER"] },
  { prefix: "/users", roles: ["ADMIN"] },
  { prefix: "/parametres", roles: ["ADMIN"] },
];

// Chemins accessibles sans être connecté
const ROUTES_PUBLIQUES = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Laisse passer les fichiers statiques, l'API de login/logout, et /login
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout") ||
    pathname === "/favicon.ico" ||
    ROUTES_PUBLIQUES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("crm_session")?.value;
  const session = await verifySession(token);

  // Pas connecté → redirection vers /login
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Connecté mais rôle non autorisé sur cette section → redirection dashboard
  const regle = ROUTES_PROTEGEES.find((r) => pathname.startsWith(r.prefix));

  if (regle && !regle.roles.includes(session.role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Applique le middleware à tout sauf les assets statiques Next.js
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
