import React from 'react';
import type { Guild } from './GuildsTab';
import { guildAction } from '../../api/handlers';

interface Props {
  guild: Guild | null;
}

const GuildActions: React.FC<Props> = ({ guild }) => {
  const handleAction = async (action: 'invite' | 'promote' | 'kick' | 'message') => {
    try {
      await guildAction(action);
    } catch {
      // Leave guild display unchanged when the backend rejects the action.
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">Actions</h2>
      {guild ? (
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => void handleAction('invite')}>
            Invite
          </button>
          <button className="px-3 py-1 bg-yellow-600 text-white rounded" onClick={() => void handleAction('promote')}>
            Promote
          </button>
          <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={() => void handleAction('kick')}>
            Kick
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => void handleAction('message')}>
            Message
          </button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GuildActions;
