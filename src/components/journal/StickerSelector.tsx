
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sticker as StickerIcon } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import type { Sticker } from '@/types/journal';

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('emoji');

  // Predefined sticker sets
  const stickerSets = {
    emoji: [
      '/stickers/emoji/emoji-1.png',
      '/stickers/emoji/emoji-2.png',
      '/stickers/emoji/emoji-3.png',
      '/stickers/emoji/emoji-4.png',
      '/stickers/emoji/emoji-5.png',
      '/stickers/emoji/emoji-6.png',
      '/stickers/emoji/emoji-7.png',
      '/stickers/emoji/emoji-8.png',
    ],
    animals: [
      '/stickers/animals/animal-1.png',
      '/stickers/animals/animal-2.png',
      '/stickers/animals/animal-3.png',
      '/stickers/animals/animal-4.png',
      '/stickers/animals/animal-5.png',
      '/stickers/animals/animal-6.png',
      '/stickers/animals/animal-7.png',
      '/stickers/animals/animal-8.png',
    ],
    food: [
      '/stickers/food/food-1.png',
      '/stickers/food/food-2.png',
      '/stickers/food/food-3.png',
      '/stickers/food/food-4.png',
      '/stickers/food/food-5.png',
      '/stickers/food/food-6.png',
      '/stickers/food/food-7.png',
      '/stickers/food/food-8.png',
    ],
    travel: [
      '/stickers/travel/travel-1.png',
      '/stickers/travel/travel-2.png',
      '/stickers/travel/travel-3.png',
      '/stickers/travel/travel-4.png',
      '/stickers/travel/travel-5.png',
      '/stickers/travel/travel-6.png',
      '/stickers/travel/travel-7.png',
      '/stickers/travel/travel-8.png',
    ],
    weather: [
      '/stickers/weather/weather-1.png',
      '/stickers/weather/weather-2.png',
      '/stickers/weather/weather-3.png',
      '/stickers/weather/weather-4.png',
      '/stickers/weather/weather-5.png',
      '/stickers/weather/weather-6.png',
      '/stickers/weather/weather-7.png',
      '/stickers/weather/weather-8.png',
    ],
  };

  // Placeholder stickers for demo purposes
  const placeholderStickers = [
    'https://api.iconify.design/twemoji:grinning-face.svg?color=%23000000',
    'https://api.iconify.design/twemoji:face-with-tears-of-joy.svg?color=%23000000',
    'https://api.iconify.design/twemoji:smiling-face-with-heart-eyes.svg?color=%23000000',
    'https://api.iconify.design/twemoji:thinking-face.svg?color=%23000000',
    'https://api.iconify.design/twemoji:worried-face.svg?color=%23000000',
    'https://api.iconify.design/twemoji:face-screaming-in-fear.svg?color=%23000000',
    'https://api.iconify.design/twemoji:crying-face.svg?color=%23000000',
    'https://api.iconify.design/twemoji:partying-face.svg?color=%23000000',
    'https://api.iconify.design/twemoji:winking-face.svg?color=%23000000',
    'https://api.iconify.design/twemoji:smiling-face-with-sunglasses.svg?color=%23000000',
    'https://api.iconify.design/twemoji:thumbs-up.svg?color=%23000000',
    'https://api.iconify.design/twemoji:red-heart.svg?color=%23000000',
    'https://api.iconify.design/twemoji:birthday-cake.svg?color=%23000000',
    'https://api.iconify.design/twemoji:sparkling-heart.svg?color=%23000000',
    'https://api.iconify.design/twemoji:cat-face.svg?color=%23000000',
    'https://api.iconify.design/twemoji:dog-face.svg?color=%23000000',
    'https://api.iconify.design/twemoji:unicorn.svg?color=%23000000',
    'https://api.iconify.design/twemoji:fox.svg?color=%23000000',
    'https://api.iconify.design/twemoji:hamburger.svg?color=%23000000',
    'https://api.iconify.design/twemoji:pizza.svg?color=%23000000',
    'https://api.iconify.design/twemoji:hot-beverage.svg?color=%23000000',
    'https://api.iconify.design/twemoji:tropical-drink.svg?color=%23000000',
    'https://api.iconify.design/twemoji:airplane.svg?color=%23000000',
    'https://api.iconify.design/twemoji:rocket.svg?color=%23000000'
  ];

  const handleStickerSelect = (stickerUrl: string) => {
    onStickerSelect(stickerUrl);
    toast.success("Sticker added! Click and drag to position it.");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Stickers</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => setSelectedCategory('emoji')}
        >
          <StickerIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
        <Button
          variant={selectedCategory === 'emoji' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setSelectedCategory('emoji')}
        >
          Emoji
        </Button>
        <Button
          variant={selectedCategory === 'animals' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setSelectedCategory('animals')}
        >
          Animals
        </Button>
        <Button
          variant={selectedCategory === 'food' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setSelectedCategory('food')}
        >
          Food
        </Button>
        <Button
          variant={selectedCategory === 'travel' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setSelectedCategory('travel')}
        >
          Travel
        </Button>
        <Button
          variant={selectedCategory === 'weather' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setSelectedCategory('weather')}
        >
          Weather
        </Button>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="grid grid-cols-4 gap-2">
          {placeholderStickers.map((sticker, index) => (
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
    </div>
  );
}
