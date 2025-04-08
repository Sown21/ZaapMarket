"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({
        callbackUrl: process.env.NEXT_PUBLIC_URL || window.location.origin
      })}
      className="rounded-md px-5 py-2.5 text-sm font-bold backdrop-blur-xl bg-white/35 text-blue-500 hover:text-blue-600 flex items-center justify-center"
    >
      Déconnexion
    </button>
  );
} 