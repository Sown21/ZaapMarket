"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ItemData, ItemFormData } from "@/types";
import { formatNumber } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconEdit } from "@tabler/icons-react";

interface EditItemDialogProps {
  item: ItemData;
}

export function EditItemDialog({ item }: EditItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ItemFormData>({
    name: item.name,
    purchasePrice: item.purchasePrice,
    sellingPrice: item.sellingPrice,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // Mise à jour du formulaire quand l'item change
  useEffect(() => {
    setFormData({
      name: item.name,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
    });
  }, [item]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Réinitialiser aux valeurs initiales
      setFormData({
        name: item.name,
        purchasePrice: item.purchasePrice,
        sellingPrice: item.sellingPrice,
      });
      setError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Supprimer les espaces pour le traitement
    const cleanValue = value.replace(/\s/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: name === "name" ? value : BigInt(Math.floor(parseFloat(cleanValue) || 0))
    }));
  };

  const calculateROI = (purchase: bigint, selling: bigint): number => {
    if (purchase <= BigInt(0)) return 0;
    const profit = Number(selling - purchase);
    return (profit / Number(purchase)) * 100;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { name, purchasePrice, sellingPrice } = formData;

    if (!name || purchasePrice <= BigInt(0) || sellingPrice <= BigInt(0)) {
      setError("Veuillez remplir tous les champs avec des valeurs valides");
      setLoading(false);
      return;
    }

    const roi = calculateROI(purchasePrice, sellingPrice);

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          purchasePrice: purchasePrice.toString(),
          sellingPrice: sellingPrice.toString(),
          roi
        })
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
        className="size-7 text-muted-foreground hover:text-[#00BAE7] hover:bg-[#00BAE7]/10 transition-colors"
      >
        <IconEdit className="size-4" />
        <span className="sr-only">Modifier l'article</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Modifier l'article</DialogTitle>
          </DialogHeader>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de l'article</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="purchasePrice">Prix d'achat (Kamas)</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  inputMode="numeric"
                  pattern="[0-9\s]*"
                  value={formatNumber(formData.purchasePrice)}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sellingPrice">Prix de vente (Kamas)</Label>
                <Input
                  id="sellingPrice"
                  name="sellingPrice"
                  inputMode="numeric"
                  pattern="[0-9\s]*"
                  value={formatNumber(formData.sellingPrice)}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                ROI estimé : 
                <span className={`ml-1 font-medium ${calculateROI(formData.purchasePrice, formData.sellingPrice) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateROI(formData.purchasePrice, formData.sellingPrice).toFixed(2)}%
                </span>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 