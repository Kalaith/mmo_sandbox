import React from 'react';
import type { GameTab } from './GameNav';
import DashboardTab from '../dashboard/DashboardTab';
import CharacterTab from '../character/CharacterTab';
import CraftingTab from '../crafting/CraftingTab';
import PvPTab from '../pvp/PvPTab';
import GuildsTab from '../guilds/GuildsTab';
import WorldMapTab from '../worldmap/WorldMapTab';
import MarketTab from '../market/MarketTab';
import SkillsTab from '../skills/SkillsTab';

interface GameContentProps {
  currentTab: GameTab;
}

const GameContent: React.FC<GameContentProps> = ({ currentTab }) => {
  return (
    <main className="game-content p-4">
      {(() => {
        switch (currentTab) {
          case 'dashboard':
            return <DashboardTab />;
          case 'character':
            return <CharacterTab />;
          case 'skills':
            return <SkillsTab />;
          case 'crafting':
            return <CraftingTab />;
          case 'pvp':
            return <PvPTab />;
          case 'guilds':
            return <GuildsTab />;
          case 'world':
            return <WorldMapTab />;
          case 'market':
            return <MarketTab />;
          default:
            return null;
        }
      })()}
    </main>
  );
};

export default GameContent;
