
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Undo, Redo, Save, Printer, Download, Menu, RotateCcw } from 'lucide-react';
import { FormatControls } from './FormatControls';
import { AlignmentControls } from './AlignmentControls';
import { ListControls } from './ListControls';
import { useEditorStore } from '@/store/editorStore';
import { useMediaQuery } from '@/hooks/use-mobile';

export function EditorToolbar() {
  const { undo, redo, canUndo, canRedo, resetEditor } = useEditorStore();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSave = () => {
    // Save functionality will be implemented later
    console.log("Save clicked");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export functionality will be implemented later
    console.log("Export clicked");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="outline"
          size="icon"
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <FormatControls />
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <AlignmentControls />
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <ListControls />
      
      <div className="flex-grow"></div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={resetEditor}
          title="Reset"
          className="h-8 w-8"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrint}
          title="Print"
          className="h-8 w-8"
        >
          <Printer className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleExport}
          title="Export"
          className="h-8 w-8"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          onClick={handleSave}
          className="hidden sm:flex"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden h-8 w-8"
          title="Toggle Sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
