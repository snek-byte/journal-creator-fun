
import React from 'react';
import { Trash2 } from 'lucide-react';

interface ClearButtonProps {
  onClick: () => void;
  className?: string;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onClick, className }) => {
  console.log("ClearButton rendered");
  return (
    <button
      className={`absolute top-4 right-4 bg-red-600/60 hover:bg-red-700/80 text-white p-2 rounded-full shadow-md transition-colors ${className || ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("ClearButton clicked - initiating canvas clear");
        onClick();
      }}
      title="Clear Canvas"
      type="button"
      aria-label="Clear all drawing content"
    >
      <Trash2 size={16} />
    </button>
  );
};
