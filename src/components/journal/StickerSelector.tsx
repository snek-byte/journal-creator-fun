
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sticker as Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Sticker } from '@/types/journal';
import { ScrollArea } from "@/components/ui/scroll-area";

interface StickerSelectorProps {
  onStickerSelect: (sticker: Sticker) => void;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [search, setSearch] = useState('');
  const [stickers, setStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchStickers = async () => {
    if (!search) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.mojilala.com/v1/stickers/search?q=${encodeURIComponent(search)}&api_key=dc6zaTOxFJmzC`);
      const data = await response.json();
      setStickers(data.data || []);
    } catch (error) {
      console.error('Error fetching stickers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStickerClick = (sticker: any) => {
    onStickerSelect({
      id: sticker.id,
      url: sticker.images.fixed_width.url,
      position: { x: 0, y: 0 }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Image className="w-4 h-4 mr-2" />
          Add Sticker
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Stickers</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search stickers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchStickers()}
          />
          <Button onClick={searchStickers} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <div className="grid grid-cols-3 gap-4">
            {stickers.map((sticker: any) => (
              <button
                key={sticker.id}
                onClick={() => handleStickerClick(sticker)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={sticker.images.fixed_width.url}
                  alt={sticker.title}
                  className="w-full h-auto"
                />
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
