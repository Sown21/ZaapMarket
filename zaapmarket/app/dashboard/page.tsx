import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ItemData } from "@/types";

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ItemTable } from "@/components/item-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Fonction pour générer les données du graphique
function generateChartData(items: ItemData[]) {
  // Créer un map pour regrouper les articles par date
  const itemsByDate = new Map();
  
  // Initialiser avec les 90 derniers jours
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    itemsByDate.set(dateStr, { date: dateStr, investment: 0, profit: 0 });
  }
  
  // Trier les articles par date
  const sortedItems = [...items].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  
  // Pour chaque article, mettre à jour l'investissement et le profit cumulatifs
  let cumulativeInvestment = 0;
  
  for (const item of sortedItems) {
    const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
    cumulativeInvestment += Number(item.purchasePrice);
    const itemProfit = Number(item.sellingPrice) - Number(item.purchasePrice);
    
    // Mettre à jour tous les jours à partir de la date de création de l'article
    for (const [dateStr, value] of itemsByDate.entries()) {
      if (dateStr >= itemDate) {
        value.investment = cumulativeInvestment;
        value.profit += itemProfit;
      }
    }
  }
  
  // Convertir le map en tableau pour le graphique
  return Array.from(itemsByDate.values());
}

export default async function Page() {
  // Vérifier si l'utilisateur est connecté
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // Récupérer les articles de l'utilisateur
  const items = await prisma.item.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  }) as ItemData[];
  
  // Générer les données pour le graphique
  const chartData = generateChartData(items);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" session={session} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={chartData} />
              </div>
              <ItemTable data={items} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
