import React from 'react';

interface Props {
  zoneId: string | null;
}

const CombatSimulator: React.FC<Props> = ({ zoneId }) => (
  <div className="mb-4">
    <h2 className="text-lg font-bold mb-2">Combat Simulator</h2>
    {zoneId ? (
      <div>Simulate combat in zone: {zoneId}</div>
    ) : (
      <div>Select a PvP zone to simulate combat.</div>
    )}
  </div>
);

export default CombatSimulator;
