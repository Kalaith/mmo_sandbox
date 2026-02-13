import React from "react";

interface RecipeItemProps {
  name: string;
  selected?: boolean;
  onClick: () => void;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ name, selected, onClick }) => (
  <button
    className={`w-full px-2 py-1 rounded ${selected ? "bg-green-500 text-white" : "bg-gray-200"}`}
    onClick={onClick}
  >
    {name}
  </button>
);

export default RecipeItem;
