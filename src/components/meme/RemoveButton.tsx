
import React from 'react';
import { X } from 'lucide-react';

interface RemoveButtonProps {
  onRemove: (e: React.MouseEvent) => void;
}

export function RemoveButton({ onRemove }: RemoveButtonProps) {
  return (
    <button 
      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-50"
      onClick={onRemove}
      title="Remove background"
    >
      <X className="w-4 h-4" />
    </button>
  );
}
