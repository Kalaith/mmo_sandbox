import React from "react";
import type { Guild } from "./GuildsTab";

interface Props {
  guild: Guild | null;
}

const GuildActions: React.FC<Props> = ({ guild }) => (
  <div className="mt-4">
    <h2 className="text-lg font-bold mb-2">Actions</h2>
    {guild ? (
      <div className="flex gap-2 flex-wrap">
        <button className="px-3 py-1 bg-green-600 text-white rounded">
          Invite
        </button>
        <button className="px-3 py-1 bg-yellow-600 text-white rounded">
          Promote
        </button>
        <button className="px-3 py-1 bg-gray-600 text-white rounded">
          Kick
        </button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded">
          Message
        </button>
      </div>
    ) : (
      <div>Loading...</div>
    )}
  </div>
);

export default GuildActions;
