import React from "react";

interface NavTabProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavTab: React.FC<NavTabProps> = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 rounded-t ${active ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default NavTab;
