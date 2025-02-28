
import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, ArrowsOutCardinal } from "lucide-react";
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
      // Basic stickers from public
      {
        url: "/stickers/star.svg",
        keywords: ["star", "sparkle", "favorite", "gold", "yellow", "rating", "sky"],
        category: "basic",
        name: "Gold Star"
      },
      {
        url: "/stickers/heart.svg",
        keywords: ["heart", "love", "romance", "valentine", "emotion", "like", "red"],
        category: "basic",
        name: "Red Heart"
      },
      {
        url: "/stickers/happy.svg",
        keywords: ["smile", "happy", "face", "emoji", "grin", "joy", "yellow"],
        category: "basic",
        name: "Happy Face"
      },
      {
        url: "/stickers/sad.svg",
        keywords: ["sad", "unhappy", "face", "emoji", "frown", "tear", "blue"],
        category: "basic",
        name: "Sad Face"
      },
      {
        url: "/stickers/thumbsup.svg",
        keywords: ["thumbs up", "like", "approve", "positive", "good", "hand", "blue"],
        category: "basic",
        name: "Thumbs Up"
      },
      {
        url: "/stickers/gift.svg",
        keywords: ["gift", "present", "birthday", "box", "celebration", "surprise", "wrapped"],
        category: "basic",
        name: "Gift Box"
      },
      {
        url: "/stickers/cake.svg",
        keywords: ["cake", "birthday", "celebration", "dessert", "party", "sweet", "candle"],
        category: "basic",
        name: "Birthday Cake"
      },
      {
        url: "/stickers/camera.svg",
        keywords: ["camera", "photo", "picture", "photography", "image", "memory", "capture"],
        category: "basic",
        name: "Camera"
      },
      // Emoji SVGs (transparent background stickers)
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f600.svg",
        keywords: ["smile", "happy", "grin", "face", "emoji", "joy"],
        category: "emoji",
        name: "Grinning Face"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f49a.svg",
        keywords: ["heart", "green", "love", "like"],
        category: "emoji",
        name: "Green Heart"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f499.svg",
        keywords: ["heart", "blue", "love", "like"],
        category: "emoji",
        name: "Blue Heart"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f49c.svg",
        keywords: ["heart", "purple", "love", "like"],
        category: "emoji",
        name: "Purple Heart"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f90d.svg",
        keywords: ["heart", "white", "love", "like"],
        category: "emoji",
        name: "White Heart"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f525.svg",
        keywords: ["fire", "flame", "hot", "burn", "lit"],
        category: "emoji",
        name: "Fire"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f389.svg",
        keywords: ["party", "celebrate", "celebration", "confetti", "popper"],
        category: "emoji",
        name: "Party Popper"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f381.svg",
        keywords: ["gift", "present", "birthday", "box", "wrapped"],
        category: "emoji",
        name: "Gift"
      },
      // Flower stickers
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f33a.svg",
        keywords: ["rose", "flower", "hibiscus", "plant", "red", "garden"],
        category: "nature",
        name: "Hibiscus"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f33b.svg",
        keywords: ["sunflower", "flower", "plant", "yellow", "garden", "sun"],
        category: "nature",
        name: "Sunflower"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f337.svg",
        keywords: ["tulip", "flower", "plant", "pink", "spring", "garden"],
        category: "nature",
        name: "Tulip"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f339.svg",
        keywords: ["rose", "flower", "plant", "red", "love", "romance", "garden"],
        category: "nature",
        name: "Rose"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f940.svg",
        keywords: ["flower", "wilted", "dead", "plant", "dried"],
        category: "nature",
        name: "Wilted Flower"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f338.svg",
        keywords: ["flower", "cherry", "blossom", "pink", "sakura", "spring", "garden"],
        category: "nature",
        name: "Cherry Blossom"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f33c.svg",
        keywords: ["flower", "blossom", "white", "daisy", "garden"],
        category: "nature",
        name: "Blossom"
      },
      // Animals
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f431.svg",
        keywords: ["cat", "kitten", "pet", "feline", "animal"],
        category: "animals",
        name: "Cat"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f436.svg",
        keywords: ["dog", "puppy", "pet", "canine", "animal"],
        category: "animals",
        name: "Dog"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f430.svg",
        keywords: ["rabbit", "bunny", "pet", "animal", "easter"],
        category: "animals",
        name: "Rabbit"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f98b.svg",
        keywords: ["butterfly", "insect", "bug", "animal", "fly", "colorful"],
        category: "animals",
        name: "Butterfly"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f41d.svg",
        keywords: ["bee", "honeybee", "insect", "bug", "honey", "pollination"],
        category: "animals",
        name: "Honeybee"
      },
      // Food
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f355.svg",
        keywords: ["pizza", "food", "slice", "italian", "cheese"],
        category: "food",
        name: "Pizza"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f36a.svg",
        keywords: ["cookie", "food", "sweet", "dessert", "snack", "chocolate"],
        category: "food",
        name: "Cookie"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f370.svg",
        keywords: ["cake", "food", "sweet", "dessert", "birthday", "celebration"],
        category: "food",
        name: "Cake"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f369.svg",
        keywords: ["donut", "doughnut", "food", "sweet", "dessert", "breakfast"],
        category: "food",
        name: "Donut"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f366.svg",
        keywords: ["ice cream", "food", "sweet", "dessert", "cold", "summer"],
        category: "food",
        name: "Ice Cream"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/2615.svg",
        keywords: ["coffee", "drink", "hot", "caffeine", "cup", "mug", "morning"],
        category: "food",
        name: "Coffee"
      },
      // Miscellaneous
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f4d6.svg",
        keywords: ["book", "reading", "open", "literature", "study", "education"],
        category: "misc",
        name: "Open Book"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f3b5.svg",
        keywords: ["music", "note", "song", "melody", "sound"],
        category: "misc",
        name: "Musical Note"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f48e.svg",
        keywords: ["gem", "diamond", "jewel", "crystal", "precious", "sparkle"],
        category: "misc",
        name: "Gem Stone"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f381.svg",
        keywords: ["gift", "present", "package", "birthday", "celebration", "wrapped"],
        category: "misc",
        name: "Wrapped Gift"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f308.svg",
        keywords: ["rainbow", "weather", "color", "sky", "pride", "arc"],
        category: "misc",
        name: "Rainbow"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f31f.svg",
        keywords: ["star", "sparkle", "glow", "shining", "glitter"],
        category: "misc",
        name: "Glowing Star"
      },
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f4a3.svg",
        keywords: ["bomb", "explosion", "boom", "dynamite"],
        category: "misc",
        name: "Bomb"
      },
      // More roses for search
      {
        url: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f490.svg",
        keywords: ["rose", "flower", "bouquet", "plant", "romance", "wedding", "valentine"],
        category: "nature",
        name: "Rose Bouquet"
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
            <ArrowsOutCardinal className="h-4 w-4 text-muted-foreground" />
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
