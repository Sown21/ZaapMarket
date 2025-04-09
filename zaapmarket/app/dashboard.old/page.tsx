import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import ItemForm from "@/components/dashboard/ItemForm";
import ItemList from "@/components/dashboard/ItemList";
import { ItemData } from "@/types";
import LogoutButton from "@/components/dashboard/LogoutButton";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  const items = await prisma.item.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  }) as ItemData[];

  // Calculer les statistiques
  const totalInvestment = items.reduce((sum, item) => sum + item.purchasePrice, BigInt(0));
  const totalProfit = items.reduce((sum, item) => sum + (item.sellingPrice - item.purchasePrice), BigInt(0));
  
  return (    <div>
    <header className="backdrop-blur-xl bg-white/25 py-4">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <div className="flex items-center gap-12">
            <a className="block" href="/">
              <span className="sr-only">Home</span>
              <img
                src="/zaap_detour.png"
                alt="Logo ZaapMarket"
                className="h-16"
              />
            </a>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
          </div>

          {/* <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    About
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Careers
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    History
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Services
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Projects
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </nav>
          </div> */}

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              {/* <a
                className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-teal-500"
                href="#"
              >
                Login
              </a> */}

              <div className="hidden sm:flex">
                <LogoutButton />
              </div>
            </div>

            <div className="block md:hidden">
              <button
                className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bonjour {session.user.name || session.user.email} !</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/35 backdrop-blur-xl p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Total investi</h2>
          <p className="text-3xl font-bold text-blue-600">{formatNumber(totalInvestment)} Kamas</p>
        </div>
        <div className="bg-white/35 backdrop-blur-xl p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Profit total</h2>
          <p className={`text-3xl font-bold ${totalProfit >= BigInt(0) ? 'text-green-600' : 'text-red-600'}`}>
            {formatNumber(totalProfit)} Kamas
          </p>
        </div>
      </div>

      <ItemForm />
      <ItemList items={items} />
    </div>
    </div>
  );
}