import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

// À utiliser dans un layout.tsx ou une Server Component pour récupérer
// l'utilisateur connecté, de façon fiable (jamais depuis un cookie client).
//
// Exemple dans app/(dashboard)/layout.tsx :
//
//   const user = await getCurrentUser();
//   return (
//     <div className="flex">
//       <Sidebar role={user!.role} />
//       <main>{children}</main>
//     </div>
//   );
//
// (le middleware garantit déjà qu'on n'arrive jamais ici sans session valide,
// donc user! est sûr dans les pages protégées)
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("crm_session")?.value;
  return await verifySession(token);
}