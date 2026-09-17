import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import { getCurrentUser } from "@/lib/GetCurrentUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const role = user?.role || "USER";

  return (
    <div className="relative flex h-screen overflow-hidden">

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/3 h-[500px] w-[700px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10 hidden md:block">
        <Sidebar role={role} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col min-w-0">

        <MobileMenu role={role} />

        <Header user={user} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
