"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ItemData } from "@/types";
import { formatNumber } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";

interface DeleteItemDialogProps {
  item: ItemData;
}

export function DeleteItemDialog({ item }: DeleteItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError("");
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      // Fermer le dialogue
      setIsOpen(false);
      
      // Rafraîchir les données
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-red-600"
      >
        <IconTrash className="size-4" />
        <span className="sr-only">Supprimer l'article</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="py-4">
            <div className="font-semibold text-lg mb-2">{item.name}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Prix d'achat:</div>
              <div>{formatNumber(item.purchasePrice)} Kamas</div>
              
              <div className="text-muted-foreground">Prix de vente:</div>
              <div>{formatNumber(item.sellingPrice)} Kamas</div>
              
              <div className="text-muted-foreground">ROI:</div>
              <div className={item.roi >= 0 ? 'text-green-600' : 'text-red-600'}>
                {item.roi.toFixed(2)}%
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              type="button"
              onClick={handleDelete} 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 