
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sticker as StickerIcon } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('emoji');

  // Clear, organized sticker categories
  const stickerCategories = {
    emoji: [
      'https://api.iconify.design/twemoji:grinning-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:face-with-tears-of-joy.svg?color=%23000000',
      'https://api.iconify.design/twemoji:smiling-face-with-heart-eyes.svg?color=%23000000',
      'https://api.iconify.design/twemoji:thinking-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:worried-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:face-screaming-in-fear.svg?color=%23000000',
      'https://api.iconify.design/twemoji:partying-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:winking-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:smiling-face-with-sunglasses.svg?color=%23000000',
      'https://api.iconify.design/twemoji:nerd-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:face-with-monocle.svg?color=%23000000',
      'https://api.iconify.design/twemoji:confused-face.svg?color=%23000000',
    ],
    animals: [
      'https://api.iconify.design/twemoji:cat-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:dog-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:unicorn.svg?color=%23000000',
      'https://api.iconify.design/twemoji:fox.svg?color=%23000000',
      'https://api.iconify.design/twemoji:monkey-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:koala.svg?color=%23000000',
      'https://api.iconify.design/twemoji:panda-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:penguin.svg?color=%23000000',
      'https://api.iconify.design/twemoji:pig-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:rabbit-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:wolf-face.svg?color=%23000000',
      'https://api.iconify.design/twemoji:bear-face.svg?color=%23000000',
    ],
    food: [
      'https://api.iconify.design/twemoji:hamburger.svg?color=%23000000',
      'https://api.iconify.design/twemoji:pizza.svg?color=%23000000',
      'https://api.iconify.design/twemoji:hot-beverage.svg?color=%23000000',
      'https://api.iconify.design/twemoji:tropical-drink.svg?color=%23000000',
      'https://api.iconify.design/twemoji:birthday-cake.svg?color=%23000000',
      'https://api.iconify.design/twemoji:ice-cream.svg?color=%23000000',
      'https://api.iconify.design/twemoji:cookie.svg?color=%23000000',
      'https://api.iconify.design/twemoji:doughnut.svg?color=%23000000',
      'https://api.iconify.design/twemoji:strawberry.svg?color=%23000000',
      'https://api.iconify.design/twemoji:watermelon.svg?color=%23000000',
      'https://api.iconify.design/twemoji:grapes.svg?color=%23000000',
      'https://api.iconify.design/twemoji:peach.svg?color=%23000000',
    ],
    objects: [
      'https://api.iconify.design/twemoji:red-heart.svg?color=%23000000',
      'https://api.iconify.design/twemoji:sparkling-heart.svg?color=%23000000',
      'https://api.iconify.design/twemoji:star.svg?color=%23000000',
      'https://api.iconify.design/twemoji:thumbs-up.svg?color=%23000000',
      'https://api.iconify.design/twemoji:airplane.svg?color=%23000000',
      'https://api.iconify.design/twemoji:rocket.svg?color=%23000000',
      'https://api.iconify.design/twemoji:wrapped-gift.svg?color=%23000000',
      'https://api.iconify.design/twemoji:trophy.svg?color=%23000000',
      'https://api.iconify.design/twemoji:camera.svg?color=%23000000',
      'https://api.iconify.design/twemoji:mobile-phone.svg?color=%23000000',
      'https://api.iconify.design/twemoji:laptop.svg?color=%23000000',
      'https://api.iconify.design/twemoji:television.svg?color=%23000000',
    ],
  };

  const handleStickerSelect = (stickerUrl: string) => {
    onStickerSelect(stickerUrl);
    toast.success("Sticker added! Click and drag to position it.");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Stickers</h3>
      </div>

      <Tabs defaultValue="emoji" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="emoji" className="text-[10px]">Emoji</TabsTrigger>
          <TabsTrigger value="animals" className="text-[10px]">Animals</TabsTrigger>
          <TabsTrigger value="food" className="text-[10px]">Food</TabsTrigger>
          <TabsTrigger value="objects" className="text-[10px]">Objects</TabsTrigger>
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
