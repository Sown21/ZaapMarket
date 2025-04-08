import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZaapMarket",
  description: "Gestionnaire de prix pour le commerce sur Dofus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        <GoogleAnalytics />
        <div className="min-h-screen bg-gradient-to-br from-[#9EC743] to-[#18283F]">
          {children}
        </div>
      </body>
    </html>
  );
}
