import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Calculateur de ROI</h1>
        <p className="mb-8 text-lg">
          Suivez facilement vos investissements et calculez votre retour sur investissement.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Se connecter
          </Link>
          <Link href="/register" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}