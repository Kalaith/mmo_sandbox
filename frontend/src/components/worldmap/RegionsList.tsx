import React from 'react';
import type { Region } from './WorldMapTab';

interface Props {
  regions: Region[];
  currentRegion: Region | null;
  onSelect: (region: Region) => void;
}

const RegionsList: React.FC<Props> = ({ regions, currentRegion, onSelect }) => (
  <div className="mt-4">
    <h2 className="text-lg font-bold mb-2">Regions</h2>
    <ul className="space-y-1">
      {regions.map(region => (
        <li key={region.id}>
          <button
            className={`w-full px-2 py-1 rounded ${currentRegion?.id === region.id ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onSelect(region)}
          >
            {region.name}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default RegionsList;
