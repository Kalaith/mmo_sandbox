import React from 'react';

interface SkillItemProps {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  onUpgrade?: () => void;
}

const SkillItem: React.FC<SkillItemProps> = ({ name, level, xp, maxXp, onUpgrade }) => (
  <div className="flex items-center gap-2 p-2 border rounded cursor-pointer" onClick={onUpgrade}>
    <span className="font-bold">{name}</span>
    <span className="text-xs text-gray-500">Lv.{level}</span>
    <span className="text-xs text-blue-500">XP: {xp}/{maxXp}</span>
    <button className="ml-auto px-2 py-1 bg-blue-500 text-white rounded" onClick={onUpgrade}>Upgrade</button>
  </div>
);

export default SkillItem;
