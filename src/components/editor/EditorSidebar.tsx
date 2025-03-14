
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TextStyling } from './sidebar/TextStyling';
import { ColorControls } from './sidebar/ColorControls';
import { InsertOptions } from './sidebar/InsertOptions';
import { TextEffects } from './sidebar/TextEffects';
import { EmojiPicker } from './sidebar/EmojiPicker';
import { useMediaQuery } from '@/hooks/use-mobile';

interface EditorSidebarProps {
  onClose: () => void;
}

export function EditorSidebar({ onClose }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState('styling');
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">Document Styling</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 px-3 pt-3">
          <TabsTrigger value="styling" className="text-xs">Text</TabsTrigger>
          <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
          <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
          <TabsTrigger value="insert" className="text-xs">Insert</TabsTrigger>
          <TabsTrigger value="emoji" className="text-xs">Emoji</TabsTrigger>
        </TabsList>
        
        <ScrollArea className={`flex-1 ${isMobile ? 'mobile-scroll-no-padding' : ''}`}>
          <div className="p-3">
            <TabsContent value="styling" className="mt-0">
              <TextStyling />
            </TabsContent>
            
            <TabsContent value="colors" className="mt-0">
              <ColorControls />
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
