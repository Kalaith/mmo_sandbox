import React from "react";

interface GuildActionButtonProps {
  action: string;
  onClick: () => void;
  disabled?: boolean;
}

const GuildActionButton: React.FC<GuildActionButtonProps> = ({
  action,
  onClick,
  disabled,
}) => (
  <button
    className="px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-400"
    onClick={onClick}
    disabled={disabled}
  >
    {action}
  </button>
);

export default GuildActionButton;
