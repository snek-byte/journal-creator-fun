
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sticker as Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import type { Sticker } from '@/types/journal';
import { ScrollArea } from "@/components/ui/scroll-area";

interface StickerSelectorProps {
  onStickerSelect: (sticker: Sticker) => void;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [search, setSearch] = useState('');
  const [stickers, setStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load trending stickers by default
  useEffect(() => {
    fetchTrendingStickers();
  }, []);

  const fetchTrendingStickers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.giphy.com/v1/stickers/trending?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&limit=30'
      );
      const data = await response.json();
      setStickers(data.data || []);
    } catch (error) {
      console.error('Error fetching trending stickers:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchStickers = async () => {
    if (!search) {
      fetchTrendingStickers();
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/stickers/search?q=${encodeURIComponent(search)}&api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&limit=30`
      );
      const data = await response.json();
      setStickers(data.data || []);
    } catch (error) {
      console.error('Error searching stickers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStickerClick = (sticker: any) => {
    onStickerSelect({
      id: sticker.id,
      url: sticker.images.fixed_width.url,
      position: { x: 50, y: 50 }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <Image className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose a Sticker</DialogTitle>
          <DialogDescription>
            Search and select a sticker to add to your journal
          </DialogDescription>
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              Loading stickers...
            </div>
          ) : stickers.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No stickers found. Try a different search term.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {stickers.map((sticker: any) => (
                <button
                  key={sticker.id}
                  onClick={() => handleStickerClick(sticker)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <img
                    src={sticker.images.fixed_width.url}
                    alt={sticker.title}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
