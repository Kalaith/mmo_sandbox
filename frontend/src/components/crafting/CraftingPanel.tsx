import React from 'react';
import type { Recipe, InventoryItem } from './CraftingTab';

interface Props {
  recipe: Recipe | null;
  inventory: InventoryItem[];
  onCraft: (recipeId: string) => void;
}

const CraftingPanel: React.FC<Props> = ({ recipe, inventory, onCraft }) => {
  if (!recipe) return <div>Select a recipe</div>;

  const canCraft = recipe.ingredients.every(ing => {
    const invItem = inventory.find(i => i.itemId === ing.itemId);
    return invItem && invItem.quantity >= ing.quantity;
  });

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Crafting Panel</h2>
      <div className="mb-2">
        <strong>Result:</strong> {recipe.result.quantity}x {recipe.result.itemId}
      </div>
      <div className="mb-2">
        <strong>Ingredients:</strong>
        <ul className="ml-4 list-disc">
          {recipe.ingredients.map(ing => (
            <li key={ing.itemId}>
              {ing.quantity}x {ing.itemId} ({inventory.find(i => i.itemId === ing.itemId)?.quantity || 0} owned)
            </li>
          ))}
        </ul>
      </div>
      <button
        className={`px-4 py-2 rounded ${canCraft ? 'bg-blue-600 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
        disabled={!canCraft}
        onClick={() => canCraft && onCraft(recipe.id)}
      >
        Craft
      </button>
    </div>
  );
};

export default CraftingPanel;
