
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Undo, Redo, Save, Printer, Download, Menu, RotateCcw } from 'lucide-react';
import { FormatControls } from './toolbar/FormatControls';
import { AlignmentControls } from './toolbar/AlignmentControls';
import { ListControls } from './toolbar/ListControls';
import { useMediaQuery } from '@/hooks/use-mobile';

interface EditorToolbarProps {
  toggleSidebar: () => void;
  onExport: () => void;
  onPrint: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset: () => void;
}

export function EditorToolbar({
  toggleSidebar,
  onExport,
  onPrint,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onReset
}: EditorToolbarProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div className="bg-white border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onRedo}
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
          onClick={onReset}
          title="Reset"
          className="h-8 w-8"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onPrint}
          title="Print"
          className="h-8 w-8"
        >
          <Printer className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onExport}
          title="Export"
          className="h-8 w-8"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          onClick={onSave}
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
