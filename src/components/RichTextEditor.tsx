
import React, { useState, useRef } from 'react';
import { EditorToolbar } from './editor/EditorToolbar';
import { EditorContent } from './editor/EditorContent';
import { EditorSidebar } from './editor/EditorSidebar';
import { toast } from 'sonner';
import { useEditorStore } from '@/store/editorStore';
import { useMediaQuery } from '@/hooks/use-mobile';

export function RichTextEditor() {
  const [showSidebar, setShowSidebar] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { 
    currentFont, 
    currentFontSize, 
    currentFontWeight, 
    currentColor, 
    currentAlignment, 
    currentGradient, 
    resetEditor, 
    canUndo, 
    canRedo, 
    undo, 
    redo 
  } = useEditorStore();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleExport = () => {
    if (!contentRef.current) return;
    
    try {
      // Create a new document with styled content
      const content = contentRef.current.innerHTML;
      const blob = new Blob([`
        <html>
          <head>
            <style>
              body { font-family: system-ui, sans-serif; margin: 40px; }
              .editor-content { 
                max-width: 800px; 
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #eee;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="editor-content">${content}</div>
          </body>
        </html>
      `], { type: 'text/html' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.html';
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      toast.success("Document exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export document");
    }
  };

  const handlePrint = () => {
    if (!contentRef.current) return;
    
    try {
      const content = contentRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        toast.error("Unable to open print window. Please check your popup settings.");
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
            <style>
              body { font-family: system-ui, sans-serif; margin: 40px; }
              .print-content { 
                max-width: 800px; 
                margin: 0 auto;
                line-height: 1.5;
              }
              @media print {
                body { margin: 0; }
                .print-content { max-width: 100%; }
              }
            </style>
          </head>
          <body>
            <div class="print-content">${content}</div>
            <script>
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      toast.success("Preparing document for printing...");
    } catch (error) {
      console.error("Print failed:", error);
      toast.error("Failed to print document");
    }
  };

  const handleSave = () => {
    toast.success("Document saved successfully!");
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Editor toolbar */}
      <EditorToolbar 
        toggleSidebar={toggleSidebar} 
        onExport={handleExport}
        onPrint={handlePrint}
        onSave={handleSave}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onReset={resetEditor}
      />
      
      {/* Main content area with editor and sidebar */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Editor content - always visible */}
        <div className={`flex-grow overflow-auto p-4 bg-gray-50 transition-all duration-300 ${showSidebar ? 'md:mr-64' : ''}`}>
          <EditorContent 
            ref={contentRef} 
            font={currentFont}
            fontSize={currentFontSize}
            fontWeight={currentFontWeight}
            color={currentColor}
            gradient={currentGradient}
            alignment={currentAlignment}
          />
        </div>
        
        {/* Sidebar - fixed position on mobile, integrated on desktop */}
        <div 
          className={`fixed inset-y-0 right-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out border-l border-gray-200
            ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0 md:opacity-0'}
          `}
          style={{ top: isMobile ? '0' : '64px', height: isMobile ? '100%' : 'calc(100% - 64px)' }}
        >
          <EditorSidebar onClose={() => setShowSidebar(false)} />
        </div>
      </div>
    </div>
  );
}
