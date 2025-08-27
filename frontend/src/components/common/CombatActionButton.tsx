import React from 'react';

interface CombatActionButtonProps {
  action: string;
  onClick: () => void;
  disabled?: boolean;
}

const CombatActionButton: React.FC<CombatActionButtonProps> = ({ action, onClick, disabled }) => (
  <button
    className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
    onClick={onClick}
    disabled={disabled}
  >
    {action}
  </button>
);

export default CombatActionButton;
