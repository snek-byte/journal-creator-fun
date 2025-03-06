
import React from 'react';
import { Eraser } from 'lucide-react'; // Using Eraser icon instead of trash can

interface ClearButtonProps {
  onClick: () => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onClick }) => {
  console.log("ClearButton rendered");
  return (
    <button
      className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-md transition-colors"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("ClearButton clicked");
        onClick();
      }}
      title="Clear Canvas"
      type="button"
    >
      <Eraser size={16} />
    </button>
  );
};
