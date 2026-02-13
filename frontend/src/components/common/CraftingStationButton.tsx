import React from "react";

interface CraftingStationButtonProps {
  name: string;
  selected?: boolean;
  onClick: () => void;
}

const CraftingStationButton: React.FC<CraftingStationButtonProps> = ({
  name,
  selected,
  onClick,
}) => (
  <button
    className={`px-2 py-1 rounded ${selected ? "bg-blue-500 text-white" : "bg-gray-200"}`}
    onClick={onClick}
  >
    {name}
  </button>
);

export default CraftingStationButton;
