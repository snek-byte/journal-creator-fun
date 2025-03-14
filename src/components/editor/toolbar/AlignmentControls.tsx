
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export function AlignmentControls() {
  const { setAlignment, currentAlignment } = useEditorStore();
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={currentAlignment === 'left' ? "default" : "outline"}
        size="icon"
        onClick={() => setAlignment('left')}
        className="h-8 w-8"
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant={currentAlignment === 'center' ? "default" : "outline"}
        size="icon"
        onClick={() => setAlignment('center')}
        className="h-8 w-8"
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button
        variant={currentAlignment === 'right' ? "default" : "outline"}
        size="icon"
        onClick={() => setAlignment('right')}
        className="h-8 w-8"
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant={currentAlignment === 'justify' ? "default" : "outline"}
        size="icon"
        onClick={() => setAlignment('justify')}
        className="h-8 w-8"
        title="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </div>
  );
}
