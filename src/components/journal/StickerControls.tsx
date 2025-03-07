
import { useState, useEffect } from 'react';
import type { Sticker } from '@/types/journal';

interface StickerControlsProps {
  stickers: Sticker[];
  selectedStickerId: string | null;
  onStickerSelect: (id: string | null) => void;
  onStickerResize: (size: number) => void;
}

export function StickerControls({
  stickers,
  selectedStickerId,
  onStickerSelect,
  onStickerResize
}: StickerControlsProps) {
  const [stickerSize, setStickerSize] = useState(100);
  
  useEffect(() => {
    if (selectedStickerId) {
      const sticker = stickers.find(s => s.id === selectedStickerId);
      if (sticker && sticker.width) {
        setStickerSize(sticker.width);
        console.log("Set sticker size to:", sticker.width);
      }
    }
  }, [selectedStickerId, stickers]);
  
  const handleStickerResize = (size: number) => {
    console.log("StickerControls: handleStickerResize called with size", size);
    setStickerSize(size);
    onStickerResize(size);
  };
  
  return null; // This component doesn't render anything, it just manages sticker state
}
