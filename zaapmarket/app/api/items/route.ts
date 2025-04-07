// app/api/items/route.ts
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Utiliser l'instance partagée
import { authOptions } from "@/lib/auth";
import { ApiResponse, ItemData, SessionUser } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Vérification de session avec typage renforcé
    if (!session?.user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Validation des données avec typage strict
    const body = await request.json();
    const { name, purchasePrice, sellingPrice } = body;
    
    if (!name || !purchasePrice || !sellingPrice) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Données invalides" },
        { status: 400 }
      );
    }

    const purchasePriceBigInt = BigInt(purchasePrice);
    const sellingPriceBigInt = BigInt(sellingPrice);

    // Calcul automatique du ROI
    const roi = ((Number(sellingPriceBigInt) - Number(purchasePriceBigInt)) / Number(purchasePriceBigInt)) * 100;

    // Création de l'item avec typage sécurisé
    const item = await prisma.item.create({
      data: {
        name,
        purchasePrice: purchasePriceBigInt,
        sellingPrice: sellingPriceBigInt,
        roi,
        userId: (session.user as SessionUser).id // Cast explicite
      }
    });

    // Convertir les BigInt en string pour la réponse JSON
    const itemResponse = {
      ...item,
      purchasePrice: item.purchasePrice.toString(),
      sellingPrice: item.sellingPrice.toString()
    };

    return NextResponse.json<ApiResponse<typeof itemResponse>>(
      { success: true, data: itemResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ITEMS_POST]', error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) { // Paramètre request ajouté
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Récupération des items avec typage
    const items = await prisma.item.findMany({
      where: {
        userId: (session.user as SessionUser).id // Cast explicite
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Convertir les BigInt en string pour la réponse JSON
    const itemsResponse = items.map(item => ({
      ...item,
      purchasePrice: item.purchasePrice.toString(),
      sellingPrice: item.sellingPrice.toString()
    }));

    return NextResponse.json<ApiResponse<typeof itemsResponse>>(
      { success: true, data: itemsResponse }
    );
  } catch (error) {
    console.error('[ITEMS_GET]', error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message },
      { status: 500 }
    );
  }
}
