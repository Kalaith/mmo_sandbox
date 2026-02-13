import React from "react";

interface PvPZoneButtonProps {
  name: string;
  selected?: boolean;
  onClick: () => void;
}

const PvPZoneButton: React.FC<PvPZoneButtonProps> = ({
  name,
  selected,
  onClick,
}) => (
  <button
    className={`px-2 py-1 rounded ${selected ? "bg-red-500 text-white" : "bg-gray-200"}`}
    onClick={onClick}
  >
    {name}
  </button>
);

export default PvPZoneButton;
