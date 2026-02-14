import React from 'react';
import type { Recipe } from './CraftingTab';

interface Props {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  onSelect: (recipe: Recipe) => void;
  loading: boolean;
}

const RecipeList: React.FC<Props> = ({ recipes, selectedRecipe, onSelect, loading }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Recipes</h2>
    {loading ? (
      <div>Loading...</div>
    ) : (
      <ul className="space-y-2">
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <button
              className={`w-full px-2 py-1 rounded ${selectedRecipe?.id === recipe.id ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              onClick={() => onSelect(recipe)}
            >
              {recipe.name}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecipeList;
