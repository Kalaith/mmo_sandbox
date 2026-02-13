import React from "react";
import type { PvPZone } from "./PvPTab";

interface Props {
  zones: PvPZone[];
  selectedZone: string | null;
  onSelect: (id: string) => void;
}

const PvPZones: React.FC<Props> = ({ zones, selectedZone, onSelect }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">PvP Zones</h2>
    <ul className="space-y-2">
      {zones.map((zone) => (
        <li key={zone.id}>
          <button
            className={`w-full px-2 py-1 rounded ${selectedZone === zone.id ? "bg-red-500 text-white" : "bg-gray-200"}`}
            onClick={() => onSelect(zone.id)}
          >
            {zone.name}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default PvPZones;
