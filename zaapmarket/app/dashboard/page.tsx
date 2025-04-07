import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import ItemForm from "@/components/dashboard/ItemForm";
import ItemList from "@/components/dashboard/ItemList";
import { ItemData } from "@/types";

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
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <p className="mb-6">Bonjour, {session.user.name || session.user.email}</p>
      
      <ItemForm />
      <ItemList items={items} />
    </div>
  );
}