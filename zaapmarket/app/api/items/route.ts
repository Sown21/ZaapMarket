import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { ApiResponse, ItemData } from "@/types";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, purchasePrice, sellingPrice, roi } = body;
    
    if (!name || !purchasePrice || !sellingPrice) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }
    
    const item = await prisma.item.create({
      data: {
        name,
        purchasePrice,
        sellingPrice,
        roi,
        userId: session.user.id
      }
    }) as ItemData;
    
    return NextResponse.json<ApiResponse<ItemData>>(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }
    
    const items = await prisma.item.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    }) as ItemData[];
    
    return NextResponse.json<ApiResponse<ItemData[]>>(
      { success: true, data: items }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}