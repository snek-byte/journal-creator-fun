
import React from 'react';
import { FormatControls } from './FormatControls';
import { AlignmentControls } from './AlignmentControls';
import { ListControls } from './ListControls';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/store/editorStore';

export function EditorToolbar() {
  const { resetEditor, undo, redo, canUndo, canRedo } = useEditorStore();
  
  return (
    <div className="p-2 border-b flex flex-wrap items-center gap-2 bg-white">
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6"></path>
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
          </svg>
        </button>
        
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7v6h-6"></path>
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
          </svg>
        </button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      <FormatControls />
      
      <Separator orientation="vertical" className="h-6" />
      
      <AlignmentControls />
      
      <Separator orientation="vertical" className="h-6" />
      
      <ListControls />
      
      <div className="ml-auto">
        <button
          onClick={resetEditor}
          className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded"
        >
          Reset Editor
        </button>
      </div>
    </div>
  );
}
