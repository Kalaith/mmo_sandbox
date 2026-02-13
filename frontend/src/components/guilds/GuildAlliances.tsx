import React from "react";
import type { Alliance } from "./GuildsTab";

interface Props {
  alliances: Alliance[];
}

const GuildAlliances: React.FC<Props> = ({ alliances }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Alliances</h2>
    <ul className="space-y-1">
      {alliances.map((alliance) => (
        <li key={alliance.id}>
          {alliance.name}{" "}
          <span className="text-xs text-gray-500">[{alliance.status}]</span>
        </li>
      ))}
    </ul>
  </div>
);

export default GuildAlliances;
