
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('basic');

  // Actual stickers organized by category
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
    ],
    emoji: [
      'https://cdn-icons-png.flaticon.com/512/742/742751.png',
      'https://cdn-icons-png.flaticon.com/512/742/742923.png', 
      'https://cdn-icons-png.flaticon.com/512/742/742940.png',
      'https://cdn-icons-png.flaticon.com/512/742/742935.png',
      'https://cdn-icons-png.flaticon.com/512/1968/1968620.png',
      'https://cdn-icons-png.flaticon.com/512/1968/1968610.png',
      'https://cdn-icons-png.flaticon.com/512/1968/1968647.png',
      'https://cdn-icons-png.flaticon.com/512/1968/1968713.png',
    ],
    decorative: [
      'https://cdn-icons-png.flaticon.com/512/3418/3418886.png',
      'https://cdn-icons-png.flaticon.com/512/3082/3082001.png',
      'https://cdn-icons-png.flaticon.com/512/2928/2928880.png',
      'https://cdn-icons-png.flaticon.com/512/1792/1792631.png',
      'https://cdn-icons-png.flaticon.com/512/1250/1250615.png',
      'https://cdn-icons-png.flaticon.com/512/2913/2913116.png',
      'https://cdn-icons-png.flaticon.com/512/2346/2346112.png',
      'https://cdn-icons-png.flaticon.com/512/2698/2698006.png',
    ],
    nature: [
      'https://cdn-icons-png.flaticon.com/512/3337/3337025.png',
      'https://cdn-icons-png.flaticon.com/512/826/826957.png',
      'https://cdn-icons-png.flaticon.com/512/616/616661.png',
      'https://cdn-icons-png.flaticon.com/512/1588/1588596.png',
      'https://cdn-icons-png.flaticon.com/512/2826/2826187.png',
      'https://cdn-icons-png.flaticon.com/512/3094/3094845.png',
      'https://cdn-icons-png.flaticon.com/512/2540/2540201.png',
      'https://cdn-icons-png.flaticon.com/512/1669/1669163.png',
    ],
    fun: [
      'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
      'https://cdn-icons-png.flaticon.com/512/2416/2416582.png',
      'https://cdn-icons-png.flaticon.com/512/3152/3152362.png',
      'https://cdn-icons-png.flaticon.com/512/3152/3152361.png',
      'https://cdn-icons-png.flaticon.com/512/3152/3152358.png', 
      'https://cdn-icons-png.flaticon.com/512/2416/2416574.png',
      'https://cdn-icons-png.flaticon.com/512/3152/3152453.png',
      'https://cdn-icons-png.flaticon.com/512/3152/3152340.png',
    ],
  };

  const handleStickerSelect = (stickerUrl: string) => {
    console.log("Sticker selected:", stickerUrl);
    onStickerSelect(stickerUrl);
    toast.success("Sticker added! Click and drag to position it.");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Stickers</h3>
      </div>

      <Tabs defaultValue="basic" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="basic" className="text-[10px]">Basic</TabsTrigger>
          <TabsTrigger value="emoji" className="text-[10px]">Emoji</TabsTrigger>
          <TabsTrigger value="decorative" className="text-[10px]">Decor</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="fun" className="text-[10px]">Fun</TabsTrigger>
        </TabsList>
        
        {Object.entries(stickerCategories).map(([category, stickers]) => (
          <TabsContent key={category} value={category}>
            <ScrollArea className="h-[200px] mt-2">
              <div className="grid grid-cols-4 gap-2">
                {stickers.map((sticker, index) => (
                  <button
                    key={index}
                    className="p-1 rounded hover:bg-accent transition-colors flex items-center justify-center h-14 w-14"
                    onClick={() => handleStickerSelect(sticker)}
                  >
                    <img 
                      src={sticker} 
                      alt={`Sticker ${index + 1}`}
                      className="h-10 w-10 object-contain" 
                      onError={(e) => {
                        console.error(`Failed to load sticker: ${sticker}`);
                        // Default to a basic sticker if error
                        e.currentTarget.src = '/stickers/star.svg';
                      }}
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
