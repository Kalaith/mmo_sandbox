import React from "react";
import type { Guild } from "./GuildsTab";

interface Props {
  guild: Guild | null;
}

const GuildManagement: React.FC<Props> = ({ guild }) => (
  <div className="mt-4">
    <h2 className="text-lg font-bold mb-2">Guild Management</h2>
    {guild ? (
      <div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded mr-2">
          Edit
        </button>
        <button className="px-3 py-1 bg-red-600 text-white rounded">
          Disband
        </button>
      </div>
    ) : (
      <div>Loading...</div>
    )}
  </div>
);

export default GuildManagement;
