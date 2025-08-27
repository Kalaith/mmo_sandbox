import React, { useEffect, useState } from 'react';
import PvPZones from './PvPZones';
import PvPStats from './PvPStats';
import CombatSimulator from './CombatSimulator';
import CombatLog from './CombatLog';
import CombatActions from './CombatActions';
import {
  getPvpZones,
  getPvpStats,
  getCombatLog
} from '../../api/handlers';

export interface PvPZone {
  id: string;
  name: string;
  description: string;
}

export interface PvPStatsType {
  kills: number;
  deaths: number;
  rating: number;
}

export interface CombatLogEntry {
  id: string;
  timestamp: string;
  message: string;
}

const PvPTab: React.FC = () => {
  const [zones, setZones] = useState<PvPZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [stats, setStats] = useState<PvPStatsType | null>(null);
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);

  useEffect(() => {
    getPvpZones().then(setZones).catch(() => setZones([]));
    getPvpStats().then(setStats).catch(() => setStats(null));
    getCombatLog().then(setCombatLog).catch(() => setCombatLog([]));
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/5">
        <PvPZones zones={zones} selectedZone={selectedZone} onSelect={setSelectedZone} />
      </div>
      <div className="w-full md:w-1/5">
        <PvPStats stats={stats} />
      </div>
      <div className="w-full md:w-2/5">
        <CombatSimulator zoneId={selectedZone} />
        <CombatActions zoneId={selectedZone} />
      </div>
      <div className="w-full md:w-1/5">
        <CombatLog log={combatLog} />
      </div>
    </div>
  );
};

export default PvPTab;
