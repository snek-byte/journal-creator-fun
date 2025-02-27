
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sticker as Image, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import type { Sticker } from '@/types/journal';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StickerSelectorProps {
  onStickerSelect: (sticker: Sticker) => void;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [search, setSearch] = useState('');
  const [trendingStickers, setTrendingStickers] = useState<any[]>([]);
  const [searchedStickers, setSearchedStickers] = useState<any[]>([]);
  const [recentStickers, setRecentStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load trending stickers by default
  useEffect(() => {
    fetchTrendingStickers();
    loadRecentStickers();
  }, []);

  const loadRecentStickers = () => {
    try {
      const savedStickers = localStorage.getItem('recentStickers');
      if (savedStickers) {
        setRecentStickers(JSON.parse(savedStickers));
      }
    } catch (error) {
      console.error('Error loading recent stickers:', error);
    }
  };

  const saveRecentSticker = (sticker: any) => {
    try {
      const existingStickers = JSON.parse(localStorage.getItem('recentStickers') || '[]');
      // Check if sticker already exists
      const exists = existingStickers.some((s: any) => s.id === sticker.id);
      if (!exists) {
        // Add new sticker to the front and keep only the last 8
        const updatedStickers = [sticker, ...existingStickers].slice(0, 8);
        localStorage.setItem('recentStickers', JSON.stringify(updatedStickers));
        setRecentStickers(updatedStickers);
      }
    } catch (error) {
      console.error('Error saving recent sticker:', error);
    }
  };

  const fetchTrendingStickers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.giphy.com/v1/stickers/trending?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&limit=30'
      );
      const data = await response.json();
      setTrendingStickers(data.data || []);
    } catch (error) {
      console.error('Error fetching trending stickers:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchStickers = async () => {
    if (!search) {
      setSearchedStickers([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/stickers/search?q=${encodeURIComponent(search)}&api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&limit=30`
      );
      const data = await response.json();
      setSearchedStickers(data.data || []);
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
    saveRecentSticker(sticker);
    setDialogOpen(false); // Close dialog after selection
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            className="flex-1"
          />
          <Button onClick={searchStickers} disabled={loading} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  Loading stickers...
                </div>
              ) : trendingStickers.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No stickers found. Try refreshing.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {trendingStickers.map((sticker: any) => (
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
          </TabsContent>
          
          <TabsContent value="search">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  Loading stickers...
                </div>
              ) : searchedStickers.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {search ? "No stickers found. Try a different search term." : "Type something to search for stickers."}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {searchedStickers.map((sticker: any) => (
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
          </TabsContent>
          
          <TabsContent value="recent">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {recentStickers.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No recent stickers. Add some stickers to see them here.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {recentStickers.map((sticker: any) => (
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
