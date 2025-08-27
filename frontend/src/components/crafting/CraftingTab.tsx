import React, { useEffect, useState } from 'react';
import CraftingStationsList from './CraftingStationsList';
import RecipeList from './RecipeList';
import CraftingPanel from './CraftingPanel';
import InventoryPanel from './InventoryPanel';
import {
  getCraftingStations,
  getRecipes,
  getInventory,
  craft
} from '../../api/handlers';

export interface Station {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  name: string;
  stationId: string;
  ingredients: { itemId: string; quantity: number }[];
  result: { itemId: string; quantity: number };
}

export interface InventoryItem {
  itemId: string;
  name: string;
  quantity: number;
}

const CraftingTab: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCraftingStations()
      .then(data => {
        setStations(data);
        if (data.length > 0) setSelectedStation(data[0].id);
      })
      .catch(() => setStations([]));
    getInventory()
      .then(data => setInventory(data))
      .catch(() => setInventory([]));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedStation) {
      setLoading(true);
      getRecipes(selectedStation)
        .then(data => {
          setRecipes(data);
          setSelectedRecipe(data.length > 0 ? data[0] : null);
        })
        .catch(() => {
          setRecipes([]);
          setSelectedRecipe(null);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedStation]);

  const handleCraft = async (recipeId: string) => {
    try {
      await craft(recipeId);
      const inv = await getInventory();
      setInventory(inv);
    } catch (e) {
      // Optionally show error to user
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/4">
        <CraftingStationsList stations={stations} selectedStation={selectedStation} onSelect={setSelectedStation} />
      </div>
      <div className="w-full md:w-1/4">
        <RecipeList recipes={recipes} selectedRecipe={selectedRecipe} onSelect={setSelectedRecipe} loading={loading} />
      </div>
      <div className="w-full md:w-1/4">
        <CraftingPanel recipe={selectedRecipe} inventory={inventory} onCraft={handleCraft} />
      </div>
      <div className="w-full md:w-1/4">
        <InventoryPanel inventory={inventory} />
      </div>
    </div>
  );
};

export default CraftingTab;
