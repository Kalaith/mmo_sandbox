import React, { useState } from "react";
import GameHeader from "./GameHeader";
import GameNav from "./GameNav";
import type { GameTab } from "./GameNav";
import GameContent from "./GameContent";

interface GameInterfaceProps {
  characterName: string;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ characterName }) => {
  const [currentTab, setCurrentTab] = useState<GameTab>("dashboard");

  return (
    <div className="game-container">
      <GameHeader characterName={characterName} />
      <GameNav currentTab={currentTab} onTabChange={setCurrentTab} />
      <GameContent currentTab={currentTab} />
    </div>
  );
};

export default GameInterface;
