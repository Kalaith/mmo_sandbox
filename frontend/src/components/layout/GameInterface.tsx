import React, { useState } from 'react';
import GameHeader from './GameHeader';
import GameNav from './GameNav';
import type { GameTab } from './GameNav';
import GameContent from './GameContent';
import type { MmoProfile } from '../../api/handlers';

interface GameInterfaceProps {
  profile: MmoProfile;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ profile }) => {
  const [currentTab, setCurrentTab] = useState<GameTab>('dashboard');

  return (
    <div className="game-container">
      <GameHeader
        characterName={profile.character.name}
        gold={profile.resources.gold}
        energy={profile.resources.energy}
        skillPoints={profile.resources.skillPoints}
      />
      <GameNav currentTab={currentTab} onTabChange={setCurrentTab} />
      <GameContent currentTab={currentTab} profile={profile} />
    </div>
  );
};

export default GameInterface;
