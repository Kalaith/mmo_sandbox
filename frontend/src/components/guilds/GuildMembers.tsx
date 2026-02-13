import React from "react";
import type { GuildMember } from "./GuildsTab";

interface Props {
  members: GuildMember[];
}

const GuildMembers: React.FC<Props> = ({ members }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Members</h2>
    <ul className="space-y-1">
      {members.map((member) => (
        <li key={member.id} className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${member.online ? "bg-green-500" : "bg-gray-400"}`}
          ></span>
          {member.name}{" "}
          <span className="text-xs text-gray-500">({member.role})</span>
        </li>
      ))}
    </ul>
  </div>
);

export default GuildMembers;
