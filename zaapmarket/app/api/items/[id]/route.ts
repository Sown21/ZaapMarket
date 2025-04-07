import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { ApiResponse, ItemData } from "@/types";
import { prisma } from "@/lib/prisma";

const prismaClient = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const item = await prisma.item.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'item:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { name, purchasePrice, sellingPrice } = body;

    if (!name || !purchasePrice || !sellingPrice) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
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
        roi
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'item:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await prisma.item.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Item supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'item:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'item" },
      { status: 500 }
    );
  }
} 