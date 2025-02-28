
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stickerSize, setStickerSize] = useState(currentStickerSize);
  
  // Update local size when prop changes
  useEffect(() => {
    setStickerSize(currentStickerSize);
  }, [currentStickerSize]);
  
  // Pre-defined stickers array
  const stickers = [
    // Basic stickers
    { url: '/stickers/star.svg', category: 'basic', keywords: ['star', 'achievement', 'award'] },
    { url: '/stickers/heart.svg', category: 'basic', keywords: ['heart', 'love', 'like'] },
    { url: '/stickers/thumbsup.svg', category: 'basic', keywords: ['thumbs up', 'like', 'approval'] },
    { url: '/stickers/happy.svg', category: 'emotions', keywords: ['happy', 'smile', 'emotion'] },
    { url: '/stickers/sad.svg', category: 'emotions', keywords: ['sad', 'unhappy', 'emotion'] },
    { url: '/stickers/gift.svg', category: 'celebration', keywords: ['gift', 'present', 'birthday', 'celebration'] },
    { url: '/stickers/cake.svg', category: 'celebration', keywords: ['cake', 'birthday', 'celebration', 'dessert'] },
    { url: '/stickers/camera.svg', category: 'objects', keywords: ['camera', 'photo', 'picture'] },
    // Additional stickers
    { url: 'https://cdn-icons-png.flaticon.com/512/1968/1968666.png', category: 'animals', keywords: ['cat', 'pet', 'animal'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/1864/1864593.png', category: 'animals', keywords: ['dog', 'pet', 'animal'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/7870/7870952.png', category: 'nature', keywords: ['flower', 'plant', 'nature'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/1146/1146066.png', category: 'nature', keywords: ['tree', 'plant', 'nature'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/2956/2956744.png', category: 'weather', keywords: ['sun', 'weather', 'sunny'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/1146/1146858.png', category: 'weather', keywords: ['cloud', 'weather', 'cloudy'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/2864/2864653.png', category: 'weather', keywords: ['rainbow', 'weather', 'colorful'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/599/599516.png', category: 'food', keywords: ['pizza', 'food', 'meal'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/1046/1046751.png', category: 'food', keywords: ['ice cream', 'dessert', 'cold'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/2405/2405412.png', category: 'food', keywords: ['coffee', 'drink', 'hot'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/2977/2977492.png', category: 'travel', keywords: ['plane', 'travel', 'airplane', 'flight'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/2553/2553627.png', category: 'travel', keywords: ['suitcase', 'travel', 'luggage'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/8018/8018042.png', category: 'travel', keywords: ['map', 'travel', 'location', 'direction'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/3616/3616986.png', category: 'school', keywords: ['book', 'study', 'reading', 'education'] },
    { url: 'https://cdn-icons-png.flaticon.com/512/694/694593.png', category: 'school', keywords: ['pencil', 'write', 'drawing', 'education'] },
  ];
  
  // Filter stickers based on search and category
  const filteredStickers = stickers.filter(sticker => {
    // Filter by category
    if (selectedCategory !== 'all' && sticker.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !sticker.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });
  
  const handleStickerSelect = (url: string) => {
    console.log("Sticker selected:", url);
    onStickerSelect(url);
  };
  
  const handleSizeChange = (value: number[]) => {
    const newSize = value[0];
    setStickerSize(newSize);
    if (onStickerResize) {
      console.log("Resizing sticker to:", newSize);
      onStickerResize(newSize);
    }
  };
  
  console.log("Current sticker size:", stickerSize);
  console.log("Selected sticker ID:", selectedStickerId);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Stickers</h3>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stickers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Sticker resizer control */}
      <div className={`space-y-2 ${selectedStickerId ? '' : 'opacity-50'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-xs font-medium">Sticker Size</h4>
          </div>
          <span className="text-xs text-muted-foreground">{stickerSize}px</span>
        </div>
        <Slider 
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
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="all" className="text-[10px]">All</TabsTrigger>
          <TabsTrigger value="basic" className="text-[10px]">Basic</TabsTrigger>
          <TabsTrigger value="emotions" className="text-[10px]">Emotions</TabsTrigger>
          <TabsTrigger value="animals" className="text-[10px]">Animals</TabsTrigger>
        </TabsList>
        
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="food" className="text-[10px]">Food</TabsTrigger>
          <TabsTrigger value="travel" className="text-[10px]">Travel</TabsTrigger>
          <TabsTrigger value="celebration" className="text-[10px]">Party</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[200px] pr-2">
          <div className="grid grid-cols-3 gap-2 mt-2">
            {filteredStickers.map((sticker, index) => (
              <button
                key={index}
                className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-24 flex items-center justify-center p-2"
                onClick={() => handleStickerSelect(sticker.url)}
              >
                <img 
                  src={sticker.url} 
                  alt={`Sticker ${index + 1}`} 
                  className="max-h-full object-contain" 
                  loading="lazy"
                />
              </button>
            ))}
          </div>
          
          {filteredStickers.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground">
              <p>No stickers found.</p>
              <p className="text-xs mt-1">Try a different search term.</p>
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
