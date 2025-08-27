import React, { useEffect, useState } from 'react';
import GuildStatus from './GuildStatus';
import GuildManagement from './GuildManagement';
import GuildMembers from './GuildMembers';
import GuildActions from './GuildActions';
import GuildAlliances from './GuildAlliances';
import {
  getGuild,
  getGuildMembers,
  getGuildAlliances
} from '../../api/handlers';

export interface Guild {
  id: string;
  name: string;
  level: number;
  description: string;
}

export interface GuildMember {
  id: string;
  name: string;
  role: string;
  online: boolean;
}

export interface Alliance {
  id: string;
  name: string;
  status: 'allied' | 'pending' | 'requested';
}

const GuildsTab: React.FC = () => {
  const [guild, setGuild] = useState<Guild | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [alliances, setAlliances] = useState<Alliance[]>([]);

  useEffect(() => {
    getGuild().then(setGuild).catch(() => setGuild(null));
    getGuildMembers().then(setMembers).catch(() => setMembers([]));
    getGuildAlliances()
      .then(data => setAlliances(data.map(a => ({ ...a, status: a.status as Alliance['status'] }))))

      .catch(() => setAlliances([]));
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/5">
        <GuildStatus guild={guild} />
        <GuildManagement guild={guild} />
      </div>
      <div className="w-full md:w-2/5">
        <GuildMembers members={members} />
        <GuildActions guild={guild} />
      </div>
      <div className="w-full md:w-2/5">
        <GuildAlliances alliances={alliances} />
      </div>
    </div>
  );
};

export default GuildsTab;
