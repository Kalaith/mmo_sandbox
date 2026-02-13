import React from "react";
import type { CombatLogEntry } from "./PvPTab";

interface Props {
  log: CombatLogEntry[];
}

const CombatLog: React.FC<Props> = ({ log }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Combat Log</h2>
    <ul className="text-xs max-h-40 overflow-y-auto">
      {log.map((entry) => (
        <li key={entry.id}>
          <span className="text-gray-500">[{entry.timestamp}]</span>{" "}
          {entry.message}
        </li>
      ))}
    </ul>
  </div>
);

export default CombatLog;
