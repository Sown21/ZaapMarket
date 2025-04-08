"use client";

import React, { useEffect } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import Script from 'next/script';

// Déclaration des types pour Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Rediriger vers le dashboard si l'utilisateur est connecté
    const checkAuth = async () => {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      if (session?.user) {
        router.push('/dashboard');
      }
    };
    checkAuth();

    // Initialiser dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);}

    // Track page view
    window.dataLayer.push(['js', new Date()]);
    window.dataLayer.push(['config', 'G-KHJB9562FV', {
      page_path: pathname,
    }]);
  }, [router, pathname]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-KHJB9562FV`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KHJB9562FV', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-8">ZaapMarket</h1>
            <p className="text-xl mb-12">
              Gestionnaire de prix pour le commerce sur Dofus
            </p>
            <div className="space-x-4">
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
