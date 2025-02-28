
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sticker as StickerIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('emoji');
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh stickers
  const refreshStickers = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Stickers refreshed');
  };

  // Clear, organized sticker categories with timestamp to force refresh
  const stickerCategories = {
    emoji: [
      `https://api.iconify.design/twemoji:grinning-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:face-with-tears-of-joy.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:smiling-face-with-heart-eyes.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:thinking-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:worried-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:face-screaming-in-fear.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:partying-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:winking-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:smiling-face-with-sunglasses.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:nerd-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:face-with-monocle.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:confused-face.svg?color=%23000000&t=${refreshKey}`,
    ],
    animals: [
      `https://api.iconify.design/twemoji:cat-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:dog-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:unicorn.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:fox.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:monkey-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:koala.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:panda-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:penguin.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:pig-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:rabbit-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:wolf-face.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:bear-face.svg?color=%23000000&t=${refreshKey}`,
    ],
    food: [
      `https://api.iconify.design/twemoji:hamburger.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:pizza.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:hot-beverage.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:tropical-drink.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:birthday-cake.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:ice-cream.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:cookie.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:doughnut.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:strawberry.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:watermelon.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:grapes.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:peach.svg?color=%23000000&t=${refreshKey}`,
    ],
    objects: [
      `https://api.iconify.design/twemoji:red-heart.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:sparkling-heart.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:star.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:thumbs-up.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:airplane.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:rocket.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:wrapped-gift.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:trophy.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:camera.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:mobile-phone.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:laptop.svg?color=%23000000&t=${refreshKey}`,
      `https://api.iconify.design/twemoji:television.svg?color=%23000000&t=${refreshKey}`,
    ],
    // Add a few more local stickers that don't rely on external services
    local: [
      '/stickers/happy.svg',
      '/stickers/sad.svg',
      '/stickers/star.svg',
      '/stickers/heart.svg',
      '/stickers/thumbsup.svg',
      '/stickers/cake.svg',
      '/stickers/gift.svg',
      '/stickers/camera.svg',
      'https://cdn-icons-png.flaticon.com/512/742/742751.png',
      'https://cdn-icons-png.flaticon.com/512/742/742923.png',
      'https://cdn-icons-png.flaticon.com/512/742/742940.png',
      'https://cdn-icons-png.flaticon.com/512/742/742935.png',
    ],
  };

  // Common stickers that we can fall back to
  const fallbackStickers = [
    'https://cdn-icons-png.flaticon.com/512/742/742751.png',
    'https://cdn-icons-png.flaticon.com/512/742/742923.png', 
    'https://cdn-icons-png.flaticon.com/512/742/742940.png',
    'https://cdn-icons-png.flaticon.com/512/742/742935.png',
    'https://cdn-icons-png.flaticon.com/512/1968/1968620.png',
    'https://cdn-icons-png.flaticon.com/512/1968/1968610.png',
    'https://cdn-icons-png.flaticon.com/512/1968/1968647.png',
    'https://cdn-icons-png.flaticon.com/512/1968/1968713.png',
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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshStickers} 
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="emoji" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="emoji" className="text-[10px]">Emoji</TabsTrigger>
          <TabsTrigger value="animals" className="text-[10px]">Animals</TabsTrigger>
          <TabsTrigger value="food" className="text-[10px]">Food</TabsTrigger>
          <TabsTrigger value="objects" className="text-[10px]">Objects</TabsTrigger>
          <TabsTrigger value="local" className="text-[10px]">Local</TabsTrigger>
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
                        // If image fails to load, replace with a fallback
                        if (fallbackStickers.length > 0) {
                          console.log("Sticker failed to load, using fallback");
                          e.currentTarget.src = fallbackStickers[index % fallbackStickers.length];
                        }
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
