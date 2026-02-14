import React from 'react';

interface SkillCategoryButtonProps {
  name: string;
  color?: string;
  active?: boolean;
  onClick: () => void;
}

const SkillCategoryButton: React.FC<SkillCategoryButtonProps> = ({
  name,
  color,
  active,
  onClick,
}) => (
  <button
    className={`px-2 py-1 rounded ${active ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
    style={color ? { borderLeft: `4px solid ${color}` } : {}}
    onClick={onClick}
  >
    {name}
  </button>
);

export default SkillCategoryButton;
