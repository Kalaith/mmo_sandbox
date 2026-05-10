import React, { useEffect, useState } from 'react';
import SkillCategoryButton from '../common/SkillCategoryButton';
import SkillItem from '../common/SkillItem';
import { getSkills, upgradeSkill, type SkillCategory } from '../../api/handlers';

interface SkillsTabProps {
  categories?: SkillCategory[];
}

const SkillsTab: React.FC<SkillsTabProps> = ({ categories: initialCategories = [] }) => {
  const [categories, setCategories] = useState<SkillCategory[]>(initialCategories);
  const [selectedCategoryName, setSelectedCategoryName] = useState(initialCategories[0]?.name ?? '');

  useEffect(() => {
    getSkills()
      .then(data => {
        setCategories(data);
        setSelectedCategoryName(current => current || data[0]?.name || '');
      })
      .catch(() => setCategories(initialCategories));
  }, [initialCategories]);

  const selectedCategory = categories.find(cat => cat.name === selectedCategoryName) ?? categories[0];

  const handleUpgrade = async (skillName: string) => {
    try {
      const nextCategories = await upgradeSkill(skillName);
      setCategories(nextCategories);
    } catch {
      // Keep the existing skill display when the backend rejects the upgrade.
    }
  };

  if (!selectedCategory) {
    return <div className="text-gray-500">No skills available.</div>;
  }

  return (
    <div className="skills-container flex flex-col md:flex-row gap-8">
      <div className="skill-categories flex md:flex-col gap-2 mb-4 md:mb-0">
        {categories.map(cat => (
          <SkillCategoryButton
            key={cat.name}
            name={cat.name}
            color={cat.color}
            active={selectedCategory.name === cat.name}
            onClick={() => setSelectedCategoryName(cat.name)}
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
              onUpgrade={() => void handleUpgrade(skill.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;
