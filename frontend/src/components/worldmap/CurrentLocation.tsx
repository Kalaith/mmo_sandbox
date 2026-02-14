import React from 'react';
import type { Region } from './WorldMapTab';

interface Props {
  region: Region | null;
}

const CurrentLocation: React.FC<Props> = ({ region }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Current Location</h2>
    {region ? (
      <div>
        <div className="font-semibold">{region.name}</div>
        <div className="text-xs text-gray-500">{region.description}</div>
      </div>
    ) : (
      <div>Loading...</div>
    )}
  </div>
);

export default CurrentLocation;
