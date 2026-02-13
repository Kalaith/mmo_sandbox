import React from "react";

interface Attribute {
  name: string;
  value: number;
}

interface Equipment {
  slot: string;
  item?: string;
}

interface CharacterTabProps {
  characterName?: string;
  attributes?: Attribute[];
  equipment?: Equipment[];
}

const defaultAttributes: Attribute[] = [
  { name: "Strength", value: 10 },
  { name: "Dexterity", value: 10 },
  { name: "Intelligence", value: 10 },
  { name: "Constitution", value: 10 },
];

const defaultEquipment: Equipment[] = [
  { slot: "Head" },
  { slot: "Chest" },
  { slot: "Legs" },
  { slot: "Weapon" },
  { slot: "Accessory" },
];

const CharacterTab: React.FC<CharacterTabProps> = ({
  characterName = "Adventurer",
  attributes = defaultAttributes,
  equipment = defaultEquipment,
}) => {
  return (
    <div className="character-panel flex flex-col md:flex-row gap-8">
      <div className="character-display flex flex-col items-center">
        <div className="character-model text-6xl mb-2">👤</div>
        <h3 className="text-xl font-bold mb-4">{characterName}</h3>
        <div className="equipment-slots grid grid-cols-2 gap-2">
          {equipment.map((eq, idx) => (
            <div
              key={idx}
              className="equipment-slot border rounded p-2 flex flex-col items-center bg-surface"
            >
              <span className="font-semibold text-xs mb-1">{eq.slot}</span>
              <span className="text-gray-500 text-sm">
                {eq.item || "Empty"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="character-attributes flex-1">
        <h3 className="font-bold mb-2">Attributes</h3>
        <ul className="attribute-list space-y-2">
          {attributes.map((attr, idx) => (
            <li
              key={idx}
              className="attribute flex justify-between border-b pb-1"
            >
              <span>{attr.name}</span>
              <span className="font-mono">{attr.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CharacterTab;
