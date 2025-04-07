import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { ApiResponse, ItemData } from "@/types";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, purchasePrice, sellingPrice } = body;
    
    if (!name || !purchasePrice || !sellingPrice) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const roi = ((sellingPrice - purchasePrice) / purchasePrice) * 100;
    
    const item = await prisma.item.update({
      where: {
        id: params.id,
        userId: session.user.id // Vérifie que l'item appartient à l'utilisateur
      },
      data: {
        name,
        purchasePrice,
        sellingPrice,
        roi
      }
    }) as ItemData;
    
    return NextResponse.json<ApiResponse<ItemData>>(
      { success: true, data: item }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
} 