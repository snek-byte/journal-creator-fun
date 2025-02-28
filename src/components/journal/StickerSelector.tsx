
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

  // Real stickers organized by category
  const stickerCategories = {
    basic: [
      'https://kcdesign.sirv.com/journal-stickers/sticker-flower-1.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-flower-2.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-heart-1.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-heart-2.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-star-1.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-star-2.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-moon.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-sun.png',
    ],
    decorative: [
      'https://kcdesign.sirv.com/journal-stickers/sticker-border-1.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-border-2.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-corner-1.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-corner-2.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-divider-1.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-divider-2.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-frame-1.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-frame-2.png',
    ],
    journaling: [
      'https://kcdesign.sirv.com/journal-stickers/sticker-important.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-note.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-todo.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-remember.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-today.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-thought.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-quote.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-idea.png',
    ],
    nature: [
      'https://kcdesign.sirv.com/journal-stickers/sticker-leaf-1.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-leaf-2.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-plant-1.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-plant-2.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-cloud.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-sun.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-mountain.png',
      'https://kcdesign.sirv.com/journal-stickers/sticker-rainbow.png',
    ],
    washi: [
      'https://kcdesign.sirv.com/journal-stickers/washi-tape-1.png',
      'https://kcdesign.sirv.com/journal-stickers/washi-tape-2.png',
      'https://kcdesign.sirv.com/journal-stickers/washi-tape-3.png',
      'https://kcdesign.sirv.com/journal-stickers/washi-tape-4.png',
      'https://kcdesign.sirv.com/journal-stickers/washi-tape-5.png',
      'https://kcdesign.sirv.com/journal-stickers/washi-tape-6.png',
      'https://kcdesign.sirv.com/journal-stickers/washi-tape-7.png',
      'https://kcdesign.sirv.com/journal-stickers/washi-tape-8.png',
    ],
  };

  // Fallback stickers if the CDN fails
  const fallbackStickers = [
    '/stickers/star.svg',
    '/stickers/heart.svg',
    '/stickers/happy.svg',
    '/stickers/sad.svg',
    '/stickers/thumbsup.svg',
    '/stickers/cake.svg',
    '/stickers/gift.svg',
    '/stickers/camera.svg',
  ];

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
          <TabsTrigger value="decorative" className="text-[10px]">Decor</TabsTrigger>
          <TabsTrigger value="journaling" className="text-[10px]">Journal</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="washi" className="text-[10px]">Washi</TabsTrigger>
        </TabsList>
        
        {Object.entries(stickerCategories).map(([category, stickers]) => (
          <TabsContent key={category} value={category}>
            <ScrollArea className="h-[200px] mt-2">
              <div className="grid grid-cols-4 gap-2">
                {stickers.map((sticker, index) => (
                  <button
                    key={index}
                    className="p-1 rounded hover:bg-accent transition-colors flex items-center justify-center h-16 w-16"
                    onClick={() => handleStickerSelect(sticker)}
                  >
                    <img 
                      src={sticker} 
                      alt={`Sticker ${index + 1}`}
                      className="h-14 w-14 object-contain" 
                      onError={(e) => {
                        console.error(`Failed to load sticker: ${sticker}`);
                        // Default to a fallback sticker if error
                        e.currentTarget.src = fallbackStickers[index % fallbackStickers.length];
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
