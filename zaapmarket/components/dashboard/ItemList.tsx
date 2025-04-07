"use client";

import { useState } from "react";
import { ItemData } from "@/types";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ItemListProps {
  items: ItemData[];
}

export default function ItemList({ items }: ItemListProps) {
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<ItemData>>({});
  const [error, setError] = useState<string>("");

  const calculateProfit = (purchasePrice: number, sellingPrice: number): number => {
    return sellingPrice - purchasePrice;
  };

  const handleEdit = (item: ItemData) => {
    setEditingItem(item.id);
    setEditedData({
      name: item.name,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice
    });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditedData({});
    setError("");
  };

  const handleSave = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      setEditingItem(null);
      setEditedData({});
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: name === "name" ? value : parseFloat(value) || 0
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md backdrop-blur-xl bg-white/55">
      <h3 className="text-xl font-semibold mb-4">Mes items</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-gray-500">Aucun item ajouté pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#222222]">
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Prix d&apos;achat</th>
                <th className="px-4 py-2 text-left">Prix de vente</th>
                <th className="px-4 py-2 text-left">Profit</th>
                <th className="px-4 py-2 text-left">ROI</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editedData.name}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        name="purchasePrice"
                        value={editedData.purchasePrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0.01"
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      `${item.purchasePrice.toFixed(2)} Kamas`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        name="sellingPrice"
                        value={editedData.sellingPrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0.01"
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      `${item.sellingPrice.toFixed(2)} Kamas`
                    )}
                  </td>
                  <td className={`px-4 py-3 font-medium ${calculateProfit(item.purchasePrice, item.sellingPrice) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {editingItem === item.id ? (
                      `${calculateProfit(editedData.purchasePrice || 0, editedData.sellingPrice || 0).toFixed(2)} Kamas`
                    ) : (
                      `${calculateProfit(item.purchasePrice, item.sellingPrice).toFixed(2)} Kamas`
                    )}
                  </td>
                  <td className={`px-4 py-3 font-medium ${item.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.roi.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3">
                    {editingItem === item.id ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Modifier
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => signOut()}
      >
        Déconnexion
      </button>
    </div>
  );
}
