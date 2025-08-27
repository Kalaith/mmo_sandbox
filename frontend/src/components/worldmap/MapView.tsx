import React from 'react';
import type { Region } from './WorldMapTab';

interface Props {
  regions: Region[];
  currentRegion: Region | null;
  onSelect: (region: Region) => void;
}

const MapView: React.FC<Props> = ({ regions, currentRegion, onSelect }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">World Map</h2>
    <div className="flex flex-wrap gap-2">
      {regions.map(region => (
        <button
          key={region.id}
          className={`px-2 py-1 rounded ${currentRegion?.id === region.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onSelect(region)}
        >
          {region.name}
        </button>
      ))}
    </div>
  </div>
);

export default MapView;
