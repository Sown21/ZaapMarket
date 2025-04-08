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

const GA_MEASUREMENT_ID = 'G-KHJB9562FV';

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
  }, [router]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: '${pathname}',
            debug_mode: true
          });
        `}
      </Script>
      <div className="min-h-screen bg-gradient-to-b from-[#222222] to-[#111111] text-white">
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
