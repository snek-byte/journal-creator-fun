
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TextStyling } from './sidebar/TextStyling';
import { TextEffects } from './sidebar/TextEffects';
import { InsertOptions } from './sidebar/InsertOptions';
import { EmojiPicker } from './sidebar/EmojiPicker';
import { X } from 'lucide-react';

interface EditorSidebarProps {
  onClose: () => void;
}

export function EditorSidebar({ onClose }: EditorSidebarProps) {
  return (
    <div className="w-80 border-r bg-background flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Editor Tools</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>
      
      <Tabs defaultValue="text">
        <TabsList className="w-full justify-start px-4 pt-2">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="insert">Insert</TabsTrigger>
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="p-4">
            <TabsContent value="text" className="mt-0">
              <TextStyling />
            </TabsContent>
            
            <TabsContent value="effects" className="mt-0">
              <TextEffects />
            </TabsContent>
            
            <TabsContent value="insert" className="mt-0">
              <InsertOptions />
            </TabsContent>
            
            <TabsContent value="emoji" className="mt-0">
              <EmojiPicker />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
