
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Code, Strikethrough, Link } from 'lucide-react';
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
    <div className="flex items-center flex-wrap gap-1">
      <Button
        variant={activeMark.includes('bold') ? "default" : "outline"}
        size="icon"
        onClick={toggleBold}
        className="h-8 w-8"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('italic') ? "default" : "outline"}
        size="icon"
        onClick={toggleItalic}
        className="h-8 w-8"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('underline') ? "default" : "outline"}
        size="icon"
        onClick={toggleUnderline}
        className="h-8 w-8"
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('strikethrough') ? "default" : "outline"}
        size="icon"
        onClick={toggleStrikethrough}
        className="h-8 w-8"
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('code') ? "default" : "outline"}
        size="icon"
        onClick={toggleCode}
        className="h-8 w-8"
        title="Code"
      >
        <Code className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeMark.includes('link') ? "default" : "outline"}
        size="icon"
        onClick={toggleLink}
        className="h-8 w-8"
        title="Link"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
}
