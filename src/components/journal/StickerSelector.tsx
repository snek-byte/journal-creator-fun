
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [searchQuery, setSearchQuery] = useState('');

  // Real stickers organized by category
  const stickerCategories = {
    basic: [
      '/stickers/star.svg',
      '/stickers/heart.svg',
      '/stickers/happy.svg',
      '/stickers/sad.svg',
      '/stickers/thumbsup.svg',
      '/stickers/cake.svg',
      '/stickers/gift.svg',
      '/stickers/camera.svg',
      // Adding more variety with repeat patterns
      '/stickers/star.svg',
      '/stickers/heart.svg',
      '/stickers/happy.svg',
      '/stickers/sad.svg',
    ],
    decorative: [
      '/stickers/star.svg',
      '/stickers/heart.svg',
      '/stickers/happy.svg',
      '/stickers/sad.svg',
      '/stickers/thumbsup.svg',
      '/stickers/cake.svg',
      '/stickers/gift.svg',
      '/stickers/camera.svg',
    ],
    journaling: [
      '/stickers/star.svg',
      '/stickers/heart.svg',
      '/stickers/happy.svg',
      '/stickers/sad.svg',
      '/stickers/thumbsup.svg',
      '/stickers/cake.svg',
      '/stickers/gift.svg',
      '/stickers/camera.svg',
    ],
    nature: [
      '/stickers/star.svg',
      '/stickers/heart.svg',
      '/stickers/happy.svg',
      '/stickers/sad.svg',
      '/stickers/thumbsup.svg',
      '/stickers/cake.svg',
      '/stickers/gift.svg',
      '/stickers/camera.svg',
    ],
    washi: [
      '/stickers/star.svg',
      '/stickers/heart.svg',
      '/stickers/happy.svg',
      '/stickers/sad.svg',
      '/stickers/thumbsup.svg',
      '/stickers/cake.svg',
      '/stickers/gift.svg',
      '/stickers/camera.svg',
    ],
  };

  const handleStickerSelect = (stickerUrl: string) => {
    console.log("Sticker selected:", stickerUrl);
    onStickerSelect(stickerUrl);
  };

  const filteredStickers = (stickers: string[]) => {
    if (!searchQuery) return stickers;
    return stickers.filter(sticker => 
      sticker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Add Stickers</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stickers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="basic" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="basic" className="text-[10px]">Basic</TabsTrigger>
          <TabsTrigger value="decorative" className="text-[10px]">Decor</TabsTrigger>
          <TabsTrigger value="journaling" className="text-[10px]">Journal</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="washi" className="text-[10px]">Washi</TabsTrigger>
        </TabsList>
        
        {Object.entries(stickerCategories).map(([category, stickers]) => (
          <TabsContent key={category} value={category}>
            <ScrollArea className="h-[200px] mt-2">
              <div className="grid grid-cols-4 gap-2">
                {filteredStickers(stickers).map((sticker, index) => (
                  <button
                    key={index}
                    className="p-1 rounded hover:bg-accent transition-colors flex items-center justify-center h-12 w-12"
                    onClick={() => handleStickerSelect(sticker)}
                  >
                    <img 
                      src={sticker} 
                      alt={`Sticker ${index + 1}`}
                      className="h-10 w-10 object-contain" 
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
