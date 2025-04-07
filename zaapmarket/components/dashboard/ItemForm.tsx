"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ItemFormData } from "@/types";

export default function ItemForm() {
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    purchasePrice: 0,
    sellingPrice: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "name" ? value : parseFloat(value) || 0
    }));
  };

  const calculateROI = (purchase: number, selling: number): number => {
    if (purchase <= 0) return 0;
    const profit = selling - purchase;
    return (profit / purchase) * 100;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { name, purchasePrice, sellingPrice } = formData;

    if (!name || purchasePrice <= 0 || sellingPrice <= 0) {
      setError("Veuillez remplir tous les champs avec des valeurs valides");
      setLoading(false);
      return;
    }

    const roi = calculateROI(purchasePrice, sellingPrice);

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          purchasePrice,
          sellingPrice,
          roi
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        purchasePrice: 0,
        sellingPrice: 0
      });
      
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 backdrop-blur-xl bg-white/20">
      <h3 className="text-xl font-semibold mb-4">Ajouter un nouvel item</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">Nom de l&apos;item</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="purchasePrice" className="block text-gray-700 mb-2">Prix d&apos;achat (Kamas)</label>
            <input
              id="purchasePrice"
              name="purchasePrice"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.purchasePrice || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="sellingPrice" className="block text-gray-700 mb-2">Prix de vente (Kamas)</label>
            <input
              id="sellingPrice"
              name="sellingPrice"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.sellingPrice || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}