import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "CRM Pro",
  description: "CRM Analytics",
};

// Layout racine — minimal par design. Il ne contient plus le Sidebar/Header :
// chaque groupe de routes ((auth) et (dashboard)) définit sa propre coquille
// visuelle, adaptée à son contexte (connecté ou non).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="bg-slate-950 text-white font-sans antialiased">{children}</body>
    </html>
  );
}
