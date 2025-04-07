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
    
    if (!name || typeof purchasePrice !== "number" || typeof sellingPrice !== "number") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Données invalides" },
        { status: 400 }
      );
    }

    // Calcul automatique du ROI
    const roi = ((sellingPrice - purchasePrice) / purchasePrice) * 100;

    // Création de l'item avec typage sécurisé
    const item = await prisma.item.create({
      data: {
        name,
        purchasePrice,
        sellingPrice,
        roi,
        userId: (session.user as SessionUser).id // Cast explicite
      }
    });

    return NextResponse.json<ApiResponse<ItemData>>(
      { success: true, data: item },
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

    return NextResponse.json<ApiResponse<ItemData[]>>(
      { success: true, data: items }
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
