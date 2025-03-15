
import React, { useState, useRef } from 'react';
import { EditorSidebar } from './editor/EditorSidebar';
import { EditorContent } from './editor/EditorContent';
import { EditorToolbar } from './editor/toolbar/EditorToolbar';
import { useEditorStore } from '@/store/editorStore';

export function RichTextEditor() {
  const { 
    content, 
    currentFont, 
    currentFontSize, 
    currentFontWeight, 
    currentColor, 
    currentGradient, 
    currentAlignment 
  } = useEditorStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar onClose={handleCloseSidebar} />
        <EditorContent 
          ref={editorRef}
          font={currentFont}
          fontSize={currentFontSize}
          fontWeight={currentFontWeight}
          color={currentColor}
          gradient={currentGradient}
          alignment={currentAlignment}
        />
      </div>
    </div>
  );
}
