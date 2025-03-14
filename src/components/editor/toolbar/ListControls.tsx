
import React from 'react';
import { Button } from '@/components/ui/button';
import { List, ListOrdered, CheckSquare } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export function ListControls() {
  const { 
    toggleBulletList, 
    toggleOrderedList, 
    toggleCheckList, 
    activeBlock 
  } = useEditorStore();
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={activeBlock.includes('bullet') ? "default" : "outline"}
        size="icon"
        onClick={toggleBulletList}
        className="h-8 w-8"
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeBlock.includes('ordered') ? "default" : "outline"}
        size="icon"
        onClick={toggleOrderedList}
        className="h-8 w-8"
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeBlock.includes('check') ? "default" : "outline"}
        size="icon"
        onClick={toggleCheckList}
        className="h-8 w-8"
        title="Check List"
      >
        <CheckSquare className="h-4 w-4" />
      </Button>
    </div>
  );
}
