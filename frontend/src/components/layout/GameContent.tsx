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
import type { MmoProfile } from '../../api/handlers';

interface GameContentProps {
  currentTab: GameTab;
  profile: MmoProfile;
}

const GameContent: React.FC<GameContentProps> = ({ currentTab, profile }) => {
  return (
    <main className="game-content p-4">
      {(() => {
        switch (currentTab) {
          case 'dashboard':
            return (
              <DashboardTab
                activities={profile.activities}
                stats={[
                  { stat: 'Level', value: profile.resources.level },
                  { stat: 'Gold', value: profile.resources.gold },
                  { stat: 'Energy', value: profile.resources.energy },
                ]}
                events={profile.events}
              />
            );
          case 'character':
            return (
              <CharacterTab
                characterName={profile.character.name}
                attributes={profile.attributes}
                equipment={profile.equipment}
              />
            );
          case 'skills':
            return <SkillsTab categories={profile.skills} />;
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
