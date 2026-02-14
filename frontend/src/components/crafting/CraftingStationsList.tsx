import React from 'react';
import type { Station } from './CraftingTab';

interface Props {
  stations: Station[];
  selectedStation: string | null;
  onSelect: (id: string) => void;
}

const CraftingStationsList: React.FC<Props> = ({ stations, selectedStation, onSelect }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Crafting Stations</h2>
    <ul className="space-y-2">
      {stations.map(station => (
        <li key={station.id}>
          <button
            className={`w-full px-2 py-1 rounded ${selectedStation === station.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onSelect(station.id)}
          >
            {station.name}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default CraftingStationsList;
