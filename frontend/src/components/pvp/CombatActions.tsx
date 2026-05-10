import React from 'react';
import { combatAction } from '../../api/handlers';

interface Props {
  zoneId: string | null;
  onActionComplete?: () => void;
}

const CombatActions: React.FC<Props> = ({ zoneId, onActionComplete }) => {
  const handleAction = async (action: 'attack' | 'defend' | 'flee') => {
    if (!zoneId) return;
    try {
      await combatAction(zoneId, action);
      onActionComplete?.();
    } catch {
      // Keep the current combat state visible when the backend rejects an action.
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Combat Actions</h2>
      {zoneId ? (
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => void handleAction('attack')}>
            Attack
          </button>
          <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={() => void handleAction('defend')}>
            Defend
          </button>
          <button className="px-3 py-1 bg-yellow-600 text-white rounded" onClick={() => void handleAction('flee')}>
            Flee
          </button>
        </div>
      ) : (
        <div>Select a PvP zone to enable actions.</div>
      )}
    </div>
  );
};

export default CombatActions;
