import React from 'react';

interface GameHeaderProps {
  characterName: string;
  gold?: number;
  energy?: number;
  skillPoints?: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ characterName, gold = 1000, energy = 100, skillPoints = 10 }) => (
  <header className="game-header p-4 bg-primary text-white flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="avatar-placeholder text-3xl">👤</div>
      <div>
        <h3 className="text-lg font-bold" id="character-display-name">{characterName || 'Adventurer'}</h3>
      </div>
    </div>
    <div className="flex gap-6">
      <div className="flex items-center gap-1"><span>💰</span><span id="gold-count">{gold}</span> Gold</div>
      <div className="flex items-center gap-1"><span>⚡</span><span id="energy-count">{energy}</span> Energy</div>
      <div className="flex items-center gap-1"><span>⭐</span><span id="skill-points">{skillPoints}</span> Skill Points</div>
    </div>
  </header>
);

export default GameHeader;
