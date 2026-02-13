import React from "react";

export type GameTab =
  | "dashboard"
  | "character"
  | "skills"
  | "crafting"
  | "pvp"
  | "guilds"
  | "world"
  | "market";

interface GameNavProps {
  currentTab: GameTab;
  onTabChange: (tab: GameTab) => void;
}

const tabs: { label: string; value: GameTab }[] = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Character", value: "character" },
  { label: "Skills", value: "skills" },
  { label: "Crafting", value: "crafting" },
  { label: "PvP", value: "pvp" },
  { label: "Guilds", value: "guilds" },
  { label: "World Map", value: "world" },
  { label: "Market", value: "market" },
];

const GameNav: React.FC<GameNavProps> = ({ currentTab, onTabChange }) => (
  <nav className="game-nav flex gap-2 bg-surface px-4 py-2 border-b border-gray-200">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        className={`nav-tab px-3 py-1 rounded font-medium transition-colors border
          ${
            currentTab === tab.value
              ? "bg-primary text-white border-primary"
              : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
          }
        `}
        onClick={() => onTabChange(tab.value)}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);

export default GameNav;
