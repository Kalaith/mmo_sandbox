import React from "react";
import type { Guild } from "./GuildsTab";

interface Props {
  guild: Guild | null;
}

const GuildStatus: React.FC<Props> = ({ guild }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Guild Status</h2>
    {guild ? (
      <ul>
        <li>Name: {guild.name}</li>
        <li>Level: {guild.level}</li>
        <li>Description: {guild.description}</li>
      </ul>
    ) : (
      <div>Loading...</div>
    )}
  </div>
);

export default GuildStatus;
