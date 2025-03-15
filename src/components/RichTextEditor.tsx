
import React from 'react';
import { EditorSidebar } from './editor/EditorSidebar';
import { EditorContent } from './editor/EditorContent';
import { EditorToolbar } from './editor/toolbar/EditorToolbar';
import { useEditorStore } from '@/store/editorStore';

export function RichTextEditor() {
  const { content } = useEditorStore();

  return (
    <div className="flex flex-col h-screen">
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar />
        <EditorContent content={content} />
      </div>
    </div>
  );
}
