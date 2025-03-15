
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link 
} from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export function FormatControls() {
  const { 
    toggleBold, 
    toggleItalic, 
    toggleUnderline, 
    toggleStrikethrough, 
    toggleCode, 
    toggleLink,
    activeMark
  } = useEditorStore();
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={activeMark.includes('bold') ? 'default' : 'outline'}
        size="icon"
        onClick={toggleBold}
        title="Bold"
        className="h-8 w-8"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('italic') ? 'default' : 'outline'}
        size="icon"
        onClick={toggleItalic}
        title="Italic"
        className="h-8 w-8"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('underline') ? 'default' : 'outline'}
        size="icon"
        onClick={toggleUnderline}
        title="Underline"
        className="h-8 w-8"
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('strikethrough') ? 'default' : 'outline'}
        size="icon"
        onClick={toggleStrikethrough}
        title="Strikethrough"
        className="h-8 w-8"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('code') ? 'default' : 'outline'}
        size="icon"
        onClick={toggleCode}
        title="Code"
        className="h-8 w-8"
      >
        <Code className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('link') ? 'default' : 'outline'}
        size="icon"
        onClick={toggleLink}
        title="Link"
        className="h-8 w-8"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
}
