
import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, ArrowUpDown } from "lucide-react"; // Fixed to ArrowUpDown (not ArrowsUpDown)
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
  onStickerResize?: (size: number) => void;
  currentStickerSize?: number;
  selectedStickerId?: string | null;
}

// Sticker metadata structure
interface Sticker {
  url: string;
  keywords: string[];
  category: string;
  name: string;
}

export function StickerSelector({ 
  onStickerSelect, 
  onStickerResize,
  currentStickerSize = 100,
  selectedStickerId 
}: StickerSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [stickerSize, setStickerSize] = useState(currentStickerSize);
  
  // Update local size state when prop changes
  useEffect(() => {
    setStickerSize(currentStickerSize);
  }, [currentStickerSize]);
  
  // Initialize sticker library with actual stickers (SVGs with transparency)
  useEffect(() => {
    // These are SVG stickers with transparency - actual stickers, not background images
    const stickerLibrary: Sticker[] = [
      {
        url: '/stickers/star.svg',
        keywords: ['star', 'favorite', 'achievement', 'rating'],
        category: 'basic',
        name: 'Star'
      },
      {
        url: '/stickers/heart.svg',
        keywords: ['heart', 'love', 'like', 'romance'],
        category: 'basic',
        name: 'Heart'
      },
      {
        url: '/stickers/happy.svg',
        keywords: ['happy', 'smile', 'emotion', 'face'],
        category: 'basic',
        name: 'Smile'
      },
      {
        url: '/stickers/sad.svg',
        keywords: ['sad', 'frown', 'emotion', 'face'],
        category: 'basic',
        name: 'Frown'
      },
      {
        url: '/stickers/thumbsup.svg',
        keywords: ['thumbs up', 'like', 'approve', 'good'],
        category: 'basic',
        name: 'Thumbs Up'
      },
      {
        url: '/stickers/camera.svg',
        keywords: ['camera', 'photo', 'picture', 'image'],
        category: 'basic',
        name: 'Camera'
      },
      {
        url: '/stickers/gift.svg',
        keywords: ['gift', 'present', 'birthday', 'celebration'],
        category: 'basic',
        name: 'Gift'
      },
      {
        url: '/stickers/cake.svg',
        keywords: ['cake', 'birthday', 'celebration', 'dessert', 'food'],
        category: 'food',
        name: 'Cake'
      }
    ];
    
    setStickers(stickerLibrary);
  }, []);

  // Filter stickers based on search query and category
  const filteredStickers = useMemo(() => {
    // Show loading state while filtering
    setIsLoading(true);
    
    let results = [...stickers];
    
    // Filter by category if not "all"
    if (selectedCategory !== 'all') {
      results = results.filter(sticker => sticker.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(sticker => {
        // Check if query matches any keyword or the name
        return sticker.keywords.some(keyword => 
          keyword.toLowerCase().includes(query)
        ) || sticker.name.toLowerCase().includes(query);
      });
    }
    
    // Sort by relevance if there's a search query
    if (searchQuery.trim()) {
      results.sort((a, b) => {
        // Give higher priority to exact matches in name
        const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        // Then check keyword matches
        const aKeywordMatch = a.keywords.filter(k => 
          k.toLowerCase().includes(searchQuery.toLowerCase())
        ).length;
        const bKeywordMatch = b.keywords.filter(k => 
          k.toLowerCase().includes(searchQuery.toLowerCase())
        ).length;
        
        return bKeywordMatch - aKeywordMatch;
      });
    }
    
    // Clear loading state
    setIsLoading(false);
    
    return results;
  }, [stickers, searchQuery, selectedCategory]);

  const handleStickerSelect = (stickerUrl: string) => {
    console.log("Sticker selected:", stickerUrl);
    onStickerSelect(stickerUrl);
  };
  
  const handleSizeChange = (value: number[]) => {
    const newSize = value[0];
    setStickerSize(newSize);
    if (onStickerResize) {
      onStickerResize(newSize);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Sticker Library</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stickers (e.g. rose, cat, coffee)..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Sticker Size Control */}
      <div className={`space-y-2 ${selectedStickerId ? '' : 'opacity-50'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-xs font-medium">Sticker Size</h4>
          </div>
          <span className="text-xs text-muted-foreground">{stickerSize}px</span>
        </div>
        <Slider 
          defaultValue={[stickerSize]}
          value={[stickerSize]} 
          min={20} 
          max={250} 
          step={1}
          onValueChange={handleSizeChange}
          disabled={!selectedStickerId}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          {selectedStickerId 
            ? "Adjust the size of the selected sticker" 
            : "Select a sticker to resize it"}
        </p>
      </div>

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all" className="text-[10px]">All</TabsTrigger>
          <TabsTrigger value="basic" className="text-[10px]">Basic</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="animals" className="text-[10px]">Animals</TabsTrigger>
          <TabsTrigger value="food" className="text-[10px]">Food</TabsTrigger>
        </TabsList>
        
        <div className="mt-2">
          <ScrollArea className="h-[220px] pr-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStickers.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {filteredStickers.map((sticker, index) => (
                  <button
                    key={index}
                    className="rounded-md border border-muted hover:border-primary transition-colors bg-card overflow-hidden flex flex-col items-center"
                    onClick={() => handleStickerSelect(sticker.url)}
                    title={sticker.name}
                  >
                    <div className="w-full aspect-square flex items-center justify-center p-1 bg-gray-50">
                      <img 
                        src={sticker.url} 
                        alt={sticker.name}
                        className="max-h-full max-w-full object-contain" 
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full bg-muted/30 p-1 text-[10px] text-center truncate">
                      {sticker.name}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[150px] text-sm text-muted-foreground">
                <p>No stickers found.</p>
                <p className="text-xs mt-1">Try a different search term.</p>
              </div>
            )}
          </ScrollArea>
          
          <div className="mt-2 text-xs text-muted-foreground">
            {filteredStickers.length > 0 && (
              <p>{filteredStickers.length} stickers found</p>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
