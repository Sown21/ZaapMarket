// app/api/items/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Version pour Next.js 13/14 avec App Router
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const item = await prisma.item.findUnique({
      where: { id },
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
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
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
      where: { id },
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
  const id = params.id;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await prisma.item.delete({
      where: { id },
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