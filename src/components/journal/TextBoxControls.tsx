
import React from 'react';
import { X, RotateCw } from "lucide-react";

interface TextBoxControlsProps {
  onDelete: (e: React.MouseEvent) => void;
  onRotate: (e: React.MouseEvent) => void;
}

export function TextBoxControls({ onDelete, onRotate }: TextBoxControlsProps) {
  return (
    <>
      {/* Delete button */}
      <button
        className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10 text-box-controls"
        onClick={onDelete}
        aria-label="Delete text box"
      >
        <X size={14} />
      </button>
      
      {/* Rotate button */}
      <div className="absolute -top-2 -left-2 flex gap-1 text-box-controls">
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 p-1 rounded-full"
          onClick={onRotate}
          title="Rotate"
        >
          <RotateCw size={12} />
        </button>
      </div>
    </>
  );
}
