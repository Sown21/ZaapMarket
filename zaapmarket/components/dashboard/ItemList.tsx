"use client";

import { useState } from "react";
import { ItemData } from "@/types";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/utils";

interface ItemListProps {
  items: ItemData[];
}

export default function ItemList({ items }: ItemListProps) {
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<ItemData>>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const calculateProfit = (purchasePrice: bigint, sellingPrice: bigint): bigint => {
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
      setLoading(true);
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...editedData,
          purchasePrice: editedData.purchasePrice?.toString(),
          sellingPrice: editedData.sellingPrice?.toString()
        })
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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/\s/g, '');
    setEditedData(prev => ({
      ...prev,
      [name]: name === "name" ? value : BigInt(Math.floor(parseFloat(cleanValue) || 0))
    }));
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet item ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      router.refresh();
    } catch (e) {
      setError("Une erreur est survenue lors de la suppression");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md backdrop-blur-xl bg-white/55">
      <h3 className="text-xl font-semibold mb-4">Mes items</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div>Chargement...</div>
      ) : items.length === 0 ? (
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
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9\s]*"
                        name="purchasePrice"
                        value={formatNumber(editedData.purchasePrice || BigInt(0))}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      `${formatNumber(item.purchasePrice)} Kamas`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9\s]*"
                        name="sellingPrice"
                        value={formatNumber(editedData.sellingPrice || BigInt(0))}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      `${formatNumber(item.sellingPrice)} Kamas`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingItem === item.id ? (
                      `${formatNumber(calculateProfit(
                        editedData.purchasePrice || BigInt(0),
                        editedData.sellingPrice || BigInt(0)
                      ))} Kamas`
                    ) : (
                      `${formatNumber(calculateProfit(item.purchasePrice, item.sellingPrice))} Kamas`
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
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
