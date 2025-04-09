import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ItemData } from "@/types"
import { formatNumber } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export async function SectionCards() {
  // Récupérer la session utilisateur
  const session = await getServerSession(authOptions);
  
  // Vérifier si l'utilisateur est connecté
  if (!session) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total investi</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              0 Kamas
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Profit total</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              0 Kamas
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Nombre d'articles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              0
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>ROI moyen</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              0%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
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

  // Calculer les statistiques
  const totalInvestment = items.reduce((sum, item) => sum + item.purchasePrice, BigInt(0));
  const totalProfit = items.reduce((sum, item) => sum + (item.sellingPrice - item.purchasePrice), BigInt(0));
  const itemCount = items.length;
  
  // Calculer le ROI moyen
  const averageRoi = itemCount > 0 
    ? items.reduce((sum, item) => sum + item.roi, 0) / itemCount 
    : 0;
  
  // Déterminer si les tendances sont à la hausse ou à la baisse
  const profitTrend = totalProfit > BigInt(0);
  
  // Fonction pour déterminer la taille de police en fonction de la longueur du nombre
  const getFontSizeClass = (value: bigint | number) => {
    const length = value.toString().length;
    if (length > 15) return "text-xl";
    if (length > 12) return "text-2xl";
    return "text-3xl";
  };
  
  // Fonction pour diviser le nombre en groupes plus lisibles
  const formatProfitForDisplay = (profit: bigint) => {
    // Convertir le profit en chaîne de caractères
    const profitStr = formatNumber(profit);
    
    // Adaptation plus agressive de la taille du texte selon la longueur
    const getFontSize = () => {
      const length = profitStr.length;
      if (length > 20) return "text-xs";
      if (length > 17) return "text-sm";
      if (length > 15) return "text-base";
      if (length > 12) return "text-lg";
      if (length > 9) return "text-xl";
      return "text-2xl";
    };
    
    // Fonction pour tronquer le texte si nécessaire
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };
    
    // Déterminer la longueur maximale en fonction de la taille de la police
    const getMaxLength = () => {
      const fontSize = getFontSize();
      if (fontSize === "text-xs") return 25;
      if (fontSize === "text-sm") return 22;
      if (fontSize === "text-base") return 20;
      if (fontSize === "text-lg") return 18;
      if (fontSize === "text-xl") return 15;
      return 12; // pour text-2xl
    };
    
    // Tronquer le texte si nécessaire
    const displayText = truncateText(profitStr, getMaxLength()) + " Kamas";
    
    // Afficher sur une seule ligne avec taille de police adaptative et contrôle d'overflow
    return (
      <div className={`${getFontSize()} font-bold overflow-hidden text-ellipsis`}>
        {displayText}
      </div>
    );
  };
  
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total investi</CardDescription>
          <div className="mt-1">
            <CardTitle className={`${getFontSizeClass(totalInvestment)} font-bold truncate`}>
              {formatNumber(totalInvestment)} Kamas
            </CardTitle>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Investissement total sur tous les articles
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Profit total</CardDescription>
          <div className="mt-1 overflow-hidden max-w-full">
            <div className={`${profitTrend ? 'text-green-600' : 'text-red-600'} overflow-hidden`}>
              {formatProfitForDisplay(totalProfit)}
            </div>
          </div>
          <CardAction>
            <Badge variant="outline" className="mt-1">
              {profitTrend ? <IconTrendingUp className="mr-1" /> : <IconTrendingDown className="mr-1" />}
              {profitTrend ? '+' : ''}{formatNumber(totalProfit).substring(0, 10)}
              {formatNumber(totalProfit).length > 10 ? '...' : ''} Kamas
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {profitTrend ? 'Vos ventes sont profitables' : 'Vos ventes sont déficitaires'} {profitTrend ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Nombre d'articles</CardDescription>
          <div className="mt-1">
            <CardTitle className="text-3xl font-bold">
              {itemCount}
            </CardTitle>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Nombre total d'articles en vente
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>ROI moyen</CardDescription>
          <div className="mt-1">
            <CardTitle className={`${getFontSizeClass(averageRoi)} font-bold truncate`}>
              {averageRoi > 1000000 
                ? `${(averageRoi/1000000).toFixed(2)}M`
                : averageRoi.toFixed(2)
              }%
            </CardTitle>
          </div>
          <CardAction>
            <Badge variant="outline" className="mt-1">
              {averageRoi > 0 ? <IconTrendingUp className="mr-1" /> : <IconTrendingDown className="mr-1" />}
              {averageRoi > 0 ? '+' : ''}
              {averageRoi > 1000000 
                ? `${(averageRoi/1000000).toFixed(2)}M`
                : averageRoi.toFixed(2)
              }%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {averageRoi > 0 ? 'Bon retour sur investissement' : 'Retour sur investissement négatif'} {averageRoi > 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
