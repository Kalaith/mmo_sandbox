import React, { useState } from 'react';
import SkillCategoryButton from '../common/SkillCategoryButton';
import SkillItem from '../common/SkillItem';

interface Skill {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
}

interface SkillCategory {
  name: string;
  color?: string;
  skills: Skill[];
}

interface SkillsTabProps {
  categories?: SkillCategory[];
}

const defaultCategories: SkillCategory[] = [
  {
    name: 'Combat',
    color: '#ff6b6b',
    skills: [
      { name: 'Melee Combat', level: 5, xp: 40, maxXp: 100 },
      { name: 'Ranged Combat', level: 3, xp: 20, maxXp: 80 },
      { name: 'Magic', level: 2, xp: 10, maxXp: 60 },
      { name: 'Defense', level: 4, xp: 30, maxXp: 90 },
    ],
  },
  {
    name: 'Crafting',
    color: '#4ecdc4',
    skills: [
      { name: 'Smithing', level: 6, xp: 60, maxXp: 120 },
      { name: 'Alchemy', level: 2, xp: 15, maxXp: 50 },
      { name: 'Tailoring', level: 1, xp: 5, maxXp: 40 },
      { name: 'Enchanting', level: 0, xp: 0, maxXp: 30 },
    ],
  },
  {
    name: 'Gathering',
    color: '#45b7d1',
    skills: [
      { name: 'Mining', level: 3, xp: 25, maxXp: 70 },
      { name: 'Herbalism', level: 2, xp: 10, maxXp: 50 },
      { name: 'Fishing', level: 1, xp: 5, maxXp: 40 },
      { name: 'Hunting', level: 2, xp: 12, maxXp: 45 },
    ],
  },
  {
    name: 'Social',
    color: '#96ceb4',
    skills: [
      { name: 'Leadership', level: 1, xp: 5, maxXp: 30 },
      { name: 'Trading', level: 2, xp: 10, maxXp: 40 },
      { name: 'Diplomacy', level: 0, xp: 0, maxXp: 20 },
      { name: 'Guild Management', level: 0, xp: 0, maxXp: 20 },
    ],
  },
];

const SkillsTab: React.FC<SkillsTabProps> = ({ categories = defaultCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div className="skills-container flex flex-col md:flex-row gap-8">
      <div className="skill-categories flex md:flex-col gap-2 mb-4 md:mb-0">
        {categories.map(cat => (
          <SkillCategoryButton
            key={cat.name}
            name={cat.name}
            color={cat.color}
            active={selectedCategory.name === cat.name}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </div>
      <div className="skill-tree flex-1">
        <h3 className="font-bold mb-2">{selectedCategory.name} Skills</h3>
        <div className="space-y-2">
          {selectedCategory.skills.map(skill => (
            <SkillItem
              key={skill.name}
              name={skill.name}
              level={skill.level}
              xp={skill.xp}
              maxXp={skill.maxXp}
              onUpgrade={() => alert(`Upgrade ${skill.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;
