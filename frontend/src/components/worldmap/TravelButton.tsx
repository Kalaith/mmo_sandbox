import React from 'react';
import type { Region } from './WorldMapTab';

interface Props {
  regions: Region[];
  currentRegion: Region | null;
  onTravel: (regionId: string) => void;
}

const TravelButton: React.FC<Props> = ({ regions, currentRegion, onTravel }) => (
  <div className="mt-4">
    <h2 className="text-lg font-bold mb-2">Travel</h2>
    <div className="flex flex-wrap gap-2">
      {regions
        .filter(r => r.id !== currentRegion?.id)
        .map(region => (
          <button
            key={region.id}
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => onTravel(region.id)}
          >
            Go to {region.name}
          </button>
        ))}
    </div>
  </div>
);

export default TravelButton;
