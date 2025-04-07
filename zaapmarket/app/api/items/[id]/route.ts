// app/api/items/[id]/route.ts
// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse, ItemData } from "@/types";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const item = await prisma.item.findUnique({
      where: { id: context.params.id },
    });

    if (!item) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Item non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<ItemData>>(
      { success: true, data: item }
    );
  } catch (error) {
    console.error("[ITEMS_GET]", error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Erreur serveur" 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, purchasePrice, sellingPrice } = body;

    if (!name || typeof purchasePrice !== "number" || typeof sellingPrice !== "number") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Données invalides" },
        { status: 400 }
      );
    }

    const roi = ((sellingPrice - purchasePrice) / purchasePrice) * 100;

    const updatedItem = await prisma.item.update({
      where: { id: context.params.id },
      data: {
        name,
        purchasePrice,
        sellingPrice,
        roi,
        userId: session.user.id
      },
    });

    return NextResponse.json<ApiResponse<ItemData>>(
      { success: true, data: updatedItem }
    );
  } catch (error) {
    console.error("[ITEMS_PUT]", error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Erreur serveur" 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const item = await prisma.item.findUnique({
      where: { id: context.params.id },
      select: { userId: true }
    });

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Item non trouvé" },
        { status: 404 }
      );
    }

    await prisma.item.delete({
      where: { id: context.params.id },
    });

    return NextResponse.json<ApiResponse<null>>(
      { success: true, message: "Item supprimé" }
    );
  } catch (error) {
    console.error("[ITEMS_DELETE]", error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Erreur serveur" 
      },
      { status: 500 }
    );
  }
}
