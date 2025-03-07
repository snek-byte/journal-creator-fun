
import { v4 as uuidv4 } from 'uuid';
import type { Sticker } from '@/types/journal';

interface StickerCreatorProps {
  stickerSize: number;
  onStickerAdd: (sticker: Sticker) => void;
}

export function StickerCreator({
  stickerSize,
  onStickerAdd
}: StickerCreatorProps) {
  const handleStickerAddFromUrl = (stickerUrl: string) => {
    console.log("Creating sticker from URL:", stickerUrl);
    const newSticker: Sticker = {
      id: uuidv4(),
      url: stickerUrl,
      position: { x: 50, y: 50 },
      width: stickerSize,
      height: stickerSize
    };
    console.log("New sticker object:", newSticker);
    onStickerAdd(newSticker);
  };
  
  return {
    handleStickerAddFromUrl
  };
}
