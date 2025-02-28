
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "./ImageUploader";
import { Sticker, Upload, Brush, Image as ImageIcon } from "lucide-react";
import { StickerSelector } from "./StickerSelector";
import { IconContainer } from "./IconContainer";

interface JournalEditorSidebarProps {
  onImageUpload: (file: File) => Promise<string>;
}

export function JournalEditorSidebar({ onImageUpload }: JournalEditorSidebarProps) {
  const [activeTab, setActiveTab] = useState("image");
  
  return (
    <div className="w-full lg:flex lg:flex-col lg:max-w-[250px] border-r hidden print:hidden">
      <Tabs 
        defaultValue="image" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full h-full"
      >
        <TabsList className="grid grid-cols-3 h-12">
          <TabsTrigger value="image" className="flex items-center gap-1">
            <ImageIcon className="w-4 h-4" />
            <span>Image</span>
          </TabsTrigger>
          <TabsTrigger value="stickers" className="flex items-center gap-1">
            <Sticker className="w-4 h-4" />
            <span>Stickers</span>
          </TabsTrigger>
          <TabsTrigger value="icons" className="flex items-center gap-1">
            <Brush className="w-4 h-4" />
            <span>Icons</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="flex-grow p-4">
          <h3 className="text-sm font-medium mb-2">Upload an Image</h3>
          <p className="text-xs text-gray-500 mb-4">
            Add a custom image to your journal
          </p>
          <ImageUploader onImageUpload={onImageUpload} />
        </TabsContent>
        
        <TabsContent value="stickers" className="flex-grow p-4">
          <h3 className="text-sm font-medium mb-2">Add Stickers</h3>
          <p className="text-xs text-gray-500 mb-4">
            Decorate your journal with stickers
          </p>
          <StickerSelector fullPage />
        </TabsContent>
        
        <TabsContent value="icons" className="flex-grow p-4">
          <h3 className="text-sm font-medium mb-2">Add Icons</h3>
          <p className="text-xs text-gray-500 mb-4">
            Enhance your journal with decorative icons
          </p>
          <IconContainer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
