import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

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
      <head>
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KHJB9562FV', {
                send_page_view: true,
                cookie_domain: 'zaapmarket.sown.ovh',
                user_id: undefined,
                debug_mode: true
              });
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KHJB9562FV"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-[#18283F] to-[#00BAE7]">
          {children}
        </div>
      </body>
    </html>
  );
}