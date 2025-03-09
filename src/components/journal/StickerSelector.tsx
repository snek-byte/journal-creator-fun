
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from '@/hooks/use-mobile';

// Import sticker URLs or use a configuration file
const STICKERS = [
  { id: 'happy', url: '/stickers/happy.svg' },
  { id: 'sad', url: '/stickers/sad.svg' },
  { id: 'heart', url: '/stickers/heart.svg' },
  { id: 'star', url: '/stickers/star.svg' },
  { id: 'thumbsup', url: '/stickers/thumbsup.svg' },
  { id: 'cake', url: '/stickers/cake.svg' },
  { id: 'camera', url: '/stickers/camera.svg' },
  { id: 'gift', url: '/stickers/gift.svg' },
];

interface StickerSelectorProps {
  onStickerSelect: (url: string) => void;
  onStickerResize?: (size: number) => void;
  currentStickerSize?: number;
  selectedStickerId?: string | null;
}

export function StickerSelector({
  onStickerSelect,
  onStickerResize,
  currentStickerSize = 100,
  selectedStickerId
}: StickerSelectorProps) {
  const [size, setSize] = useState(currentStickerSize);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Only show the first row (4 stickers) on mobile
  const displayedStickers = isMobile ? STICKERS.slice(0, 4) : STICKERS;

  const handleSizeChange = (values: number[]) => {
    const newSize = values[0];
    setSize(newSize);
    if (onStickerResize) {
      onStickerResize(newSize);
    }
  };

  const handleStickerClick = (sticker: { id: string, url: string }) => {
    onStickerSelect(sticker.url);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Stickers</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {displayedStickers.map((sticker) => (
          <button
            key={sticker.id}
            className={`
              p-1 bg-background border rounded-md hover:bg-accent/50 transition-colors
              ${selectedStickerId === sticker.id ? 'ring-2 ring-primary' : ''}
            `}
            onClick={() => handleStickerClick(sticker)}
          >
            <img
              src={sticker.url}
              alt={`${sticker.id} sticker`}
              className="w-full h-auto"
              style={{ opacity: selectedStickerId === sticker.id ? 0.8 : 1 }}
            />
          </button>
        ))}
      </div>
      
      {onStickerResize && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="sticker-size" className="text-xs">Size</Label>
            <span className="text-xs text-muted-foreground">{size}%</span>
          </div>
          <Slider
            id="sticker-size"
            value={[size]}
            min={20}
            max={200}
            step={5}
            onValueChange={handleSizeChange}
          />
        </div>
      )}
    </div>
  );
}
