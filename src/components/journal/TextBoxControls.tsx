
import React from 'react';
import { X, RotateCw } from "lucide-react";
import { TextBox } from '@/types/journal';

interface TextBoxControlsProps {
  textBox: TextBox;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TextBox>) => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function TextBoxControls({ 
  textBox, 
  onRemove, 
  onUpdate,
  isEditing,
  setIsEditing,
  text,
  handleChange,
  handleBlur,
  handleKeyDown
}: TextBoxControlsProps) {
  // Handlers
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(textBox.id);
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = (textBox.rotation || 0) + 15;
    onUpdate(textBox.id, { rotation: newRotation });
  };

  if (isEditing) {
    return null; // Don't show controls while editing
  }

  return (
    <>
      {/* Delete button */}
      <button
        className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10 text-box-controls"
        onClick={handleDelete}
        aria-label="Delete text box"
      >
        <X size={14} />
      </button>
      
      {/* Rotate button */}
      <div className="absolute -top-2 -left-2 flex gap-1 text-box-controls">
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 p-1 rounded-full"
          onClick={handleRotate}
          title="Rotate"
        >
          <RotateCw size={12} />
        </button>
      </div>
    </>
  );
}
