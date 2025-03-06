
import React from 'react';
import { Trash2 } from 'lucide-react';

interface ClearButtonProps {
  onClick: () => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onClick }) => {
  console.log("ClearButton rendered");
  return (
    <button
      className="absolute top-4 right-4 bg-red-600/60 hover:bg-red-700/80 text-white p-2 rounded-full shadow-md transition-colors"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("ClearButton clicked - initiating canvas clear");
        // Force this to run in a new execution context
        setTimeout(() => onClick(), 0);
      }}
      title="Clear Canvas"
      type="button"
      aria-label="Clear all drawing content"
    >
      <Trash2 size={16} />
    </button>
  );
};
