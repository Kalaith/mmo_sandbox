import React from 'react';

interface Props {
  zoneId: string | null;
}

const CombatActions: React.FC<Props> = ({ zoneId }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Combat Actions</h2>
    {zoneId ? (
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded">Attack</button>
        <button className="px-3 py-1 bg-gray-600 text-white rounded">Defend</button>
        <button className="px-3 py-1 bg-yellow-600 text-white rounded">Flee</button>
      </div>
    ) : (
      <div>Select a PvP zone to enable actions.</div>
    )}
  </div>
);

export default CombatActions;
