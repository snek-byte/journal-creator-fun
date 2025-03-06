
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewControlsProps {
  isDrawingMode: boolean;
  onDrawingModeToggle: (enabled: boolean) => void;
  onCreateTextBox?: () => void;
}

export function PreviewControls({
  isDrawingMode,
  onDrawingModeToggle,
  onCreateTextBox
}: PreviewControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      {(!isDrawingMode && onCreateTextBox) && (
        <Button 
          variant="subtle" 
          size="sm" 
          className="rounded-full"
          onClick={onCreateTextBox}
        >
          <Plus className="h-4 w-4 mr-1" />
          Text
        </Button>
      )}
      
      <Button
        variant="subtle"
        size="sm"
        className={cn(
          "rounded-full",
          isDrawingMode ? "bg-blue-100 border-blue-300" : ""
        )}
        onClick={() => onDrawingModeToggle(!isDrawingMode)}
      >
        <PenTool className="h-4 w-4 mr-1" />
        Draw
      </Button>
    </div>
  );
}
