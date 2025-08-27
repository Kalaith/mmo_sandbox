import React from 'react';
import type { PvPStatsType } from './PvPTab';

interface Props {
  stats: PvPStatsType | null;
}

const PvPStats: React.FC<Props> = ({ stats }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">PvP Stats</h2>
    {stats ? (
      <ul>
        <li>Kills: {stats.kills}</li>
        <li>Deaths: {stats.deaths}</li>
        <li>Rating: {stats.rating}</li>
      </ul>
    ) : (
      <div>Loading...</div>
    )}
  </div>
);

export default PvPStats;
