
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
  onStickerResize?: (size: number) => void;
  currentStickerSize?: number;
  selectedStickerId?: string | null;
}

// Giphy API sticker interface
interface GiphySticker {
  id: string;
  url: string;
  images: {
    fixed_width: {
      url: string;
      width: string;
      height: string;
    },
    original: {
      url: string;
    }
  };
  title: string;
}

// Pixabay image interface
interface PixabayImage {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
}

// Combined sticker interface for our component
interface StoreSticker {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  category: string;
  keywords: string[];
  source: 'local' | 'giphy' | 'pixabay';
  isTransparent?: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allStickers, setAllStickers] = useState<StoreSticker[]>([]);
  const [giphyStickers, setGiphyStickers] = useState<StoreSticker[]>([]);
  const [pixabayImages, setPixabayImages] = useState<StoreSticker[]>([]);
  
  // API Keys (these are public API keys - free tier)
  const GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';
  const PIXABAY_API_KEY = '36933588-c28bbd3088d23da8dad6740f4';
  
  // Update local size when prop changes
  useEffect(() => {
    setStickerSize(currentStickerSize);
  }, [currentStickerSize]);
  
  // Load local stickers
  useEffect(() => {
    // Pre-defined stickers array
    const localStickers: StoreSticker[] = [
      // Built-in stickers
      { id: 'star', url: '/stickers/star.svg', title: 'Star', category: 'basic', keywords: ['star', 'achievement', 'award'], source: 'local', isTransparent: true },
      { id: 'heart', url: '/stickers/heart.svg', title: 'Heart', category: 'basic', keywords: ['heart', 'love', 'like'], source: 'local', isTransparent: true },
      { id: 'thumbsup', url: '/stickers/thumbsup.svg', title: 'Thumbs Up', category: 'basic', keywords: ['thumbs up', 'like', 'approval'], source: 'local', isTransparent: true },
      { id: 'happy', url: '/stickers/happy.svg', title: 'Happy Face', category: 'emotions', keywords: ['happy', 'smile', 'emotion'], source: 'local', isTransparent: true },
      { id: 'sad', url: '/stickers/sad.svg', title: 'Sad Face', category: 'emotions', keywords: ['sad', 'unhappy', 'emotion'], source: 'local', isTransparent: true },
      { id: 'gift', url: '/stickers/gift.svg', title: 'Gift', category: 'celebration', keywords: ['gift', 'present', 'birthday', 'celebration'], source: 'local', isTransparent: true },
      { id: 'cake', url: '/stickers/cake.svg', title: 'Cake', category: 'celebration', keywords: ['cake', 'birthday', 'celebration', 'dessert'], source: 'local', isTransparent: true },
      { id: 'camera', url: '/stickers/camera.svg', title: 'Camera', category: 'objects', keywords: ['camera', 'photo', 'picture'], source: 'local', isTransparent: true },
      
      // Flaticon transparent stickers with attribution
      { id: 'cat1', url: 'https://cdn-icons-png.flaticon.com/512/1864/1864514.png', title: 'Cat', category: 'animals', keywords: ['cat', 'pet', 'animal'], source: 'local', isTransparent: true },
      { id: 'dog1', url: 'https://cdn-icons-png.flaticon.com/512/1864/1864593.png', title: 'Dog', category: 'animals', keywords: ['dog', 'pet', 'animal'], source: 'local', isTransparent: true },
      { id: 'flower1', url: 'https://cdn-icons-png.flaticon.com/512/826/826957.png', title: 'Flower', category: 'nature', keywords: ['flower', 'plant', 'nature'], source: 'local', isTransparent: true },
      { id: 'tree1', url: 'https://cdn-icons-png.flaticon.com/512/489/489969.png', title: 'Tree', category: 'nature', keywords: ['tree', 'plant', 'nature'], source: 'local', isTransparent: true },
      { id: 'sun1', url: 'https://cdn-icons-png.flaticon.com/512/869/869869.png', title: 'Sun', category: 'weather', keywords: ['sun', 'weather', 'sunny'], source: 'local', isTransparent: true },
      { id: 'cloud1', url: 'https://cdn-icons-png.flaticon.com/512/414/414927.png', title: 'Cloud', category: 'weather', keywords: ['cloud', 'weather', 'cloudy'], source: 'local', isTransparent: true },
      { id: 'rainbow1', url: 'https://cdn-icons-png.flaticon.com/512/4838/4838145.png', title: 'Rainbow', category: 'weather', keywords: ['rainbow', 'weather', 'colorful'], source: 'local', isTransparent: true },
      { id: 'pizza1', url: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png', title: 'Pizza', category: 'food', keywords: ['pizza', 'food', 'meal'], source: 'local', isTransparent: true },
      { id: 'icecream1', url: 'https://cdn-icons-png.flaticon.com/512/938/938063.png', title: 'Ice Cream', category: 'food', keywords: ['ice cream', 'dessert', 'cold'], source: 'local', isTransparent: true },
      { id: 'coffee1', url: 'https://cdn-icons-png.flaticon.com/512/924/924514.png', title: 'Coffee', category: 'food', keywords: ['coffee', 'drink', 'hot'], source: 'local', isTransparent: true },
      { id: 'plane1', url: 'https://cdn-icons-png.flaticon.com/512/3126/3126609.png', title: 'Plane', category: 'travel', keywords: ['plane', 'travel', 'airplane', 'flight'], source: 'local', isTransparent: true },
      { id: 'suitcase1', url: 'https://cdn-icons-png.flaticon.com/512/2553/2553627.png', title: 'Suitcase', category: 'travel', keywords: ['suitcase', 'travel', 'luggage'], source: 'local', isTransparent: true },
      { id: 'map1', url: 'https://cdn-icons-png.flaticon.com/512/854/854878.png', title: 'Map', category: 'travel', keywords: ['map', 'travel', 'location', 'direction'], source: 'local', isTransparent: true },
      { id: 'book1', url: 'https://cdn-icons-png.flaticon.com/512/3616/3616986.png', title: 'Book', category: 'school', keywords: ['book', 'study', 'reading', 'education'], source: 'local', isTransparent: true },
      { id: 'pencil1', url: 'https://cdn-icons-png.flaticon.com/512/2919/2919592.png', title: 'Pencil', category: 'school', keywords: ['pencil', 'write', 'drawing', 'education'], source: 'local', isTransparent: true },
    ];
    
    setAllStickers(prevStickers => {
      const combinedStickers = [...localStickers];
      
      // Deduplicate stickers by ID
      const uniqueStickers = combinedStickers.filter((sticker, index, self) => 
        index === self.findIndex(s => s.id === sticker.id)
      );
      
      return uniqueStickers;
    });
    
    // Load Giphy stickers
    fetchGiphyStickers('trending');
    
    // Load Pixabay images with transparent backgrounds
    fetchPixabayImages('transparent');
    
  }, []);
  
  // Function to fetch stickers from Giphy API
  const fetchGiphyStickers = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const endpoint = searchTerm === 'trending' 
        ? `https://api.giphy.com/v1/stickers/trending?api_key=${GIPHY_API_KEY}&limit=25`
        : `https://api.giphy.com/v1/stickers/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=25`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const formattedStickers: StoreSticker[] = data.data.map((sticker: GiphySticker) => ({
          id: `giphy-${sticker.id}`,
          url: sticker.images.original.url,
          thumbnailUrl: sticker.images.fixed_width.url,
          title: sticker.title || 'Giphy Sticker',
          category: 'giphy',
          keywords: sticker.title ? sticker.title.split(' ') : ['sticker'],
          source: 'giphy',
          isTransparent: true
        }));
        
        setGiphyStickers(formattedStickers);
        
        // Add to all stickers
        setAllStickers(prevStickers => {
          const combinedStickers = [...prevStickers, ...formattedStickers];
          
          // Deduplicate stickers by ID
          const uniqueStickers = combinedStickers.filter((sticker, index, self) => 
            index === self.findIndex(s => s.id === sticker.id)
          );
          
          return uniqueStickers;
        });
      }
    } catch (error) {
      console.error('Error fetching Giphy stickers:', error);
      toast.error('Failed to load stickers from Giphy');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to fetch images from Pixabay with transparent backgrounds
  const fetchPixabayImages = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const endpoint = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=photo&per_page=25&safesearch=true`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.hits && Array.isArray(data.hits)) {
        const formattedImages: StoreSticker[] = data.hits.map((image: PixabayImage) => ({
          id: `pixabay-${image.id}`,
          url: image.largeImageURL,
          thumbnailUrl: image.webformatURL,
          title: image.tags || 'Pixabay Image',
          category: 'pixabay',
          keywords: image.tags ? image.tags.split(', ') : ['image'],
          source: 'pixabay',
          isTransparent: searchTerm === 'transparent'
        }));
        
        setPixabayImages(formattedImages);
        
        // Add to all stickers
        setAllStickers(prevStickers => {
          const combinedStickers = [...prevStickers, ...formattedImages];
          
          // Deduplicate stickers by ID
          const uniqueStickers = combinedStickers.filter((sticker, index, self) => 
            index === self.findIndex(s => s.id === sticker.id)
          );
          
          return uniqueStickers;
        });
      }
    } catch (error) {
      console.error('Error fetching Pixabay images:', error);
      toast.error('Failed to load images from Pixabay');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim().length < 2) return;
    
    fetchGiphyStickers(searchQuery);
    fetchPixabayImages(searchQuery + ' transparent');
  };
  
  // Filter stickers based on search and category
  const filteredStickers = allStickers.filter(sticker => {
    // Filter by category
    if (selectedCategory !== 'all' && selectedCategory !== sticker.source && 
        selectedCategory !== sticker.category) {
      return false;
    }
    
    // Filter by search query (if not empty and we're not already searching via API)
    if (searchQuery && sticker.source === 'local') {
      return sticker.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      ) || sticker.title.toLowerCase().includes(searchQuery.toLowerCase());
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
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  console.log("Current sticker size:", stickerSize);
  console.log("Selected sticker ID:", selectedStickerId);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Stickers</h3>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stickers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button 
          size="sm" 
          onClick={handleSearch}
          disabled={searchQuery.trim().length < 2 || isLoading}
          className="flex-shrink-0"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
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
          <TabsTrigger value="local" className="text-[10px]">Basic</TabsTrigger>
          <TabsTrigger value="giphy" className="text-[10px]">Giphy</TabsTrigger>
          <TabsTrigger value="pixabay" className="text-[10px]">Pixabay</TabsTrigger>
        </TabsList>
        
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="animals" className="text-[10px]">Animals</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="food" className="text-[10px]">Food</TabsTrigger>
          <TabsTrigger value="celebration" className="text-[10px]">Celebration</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[300px] pr-2">
          {isLoading && searchQuery ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Searching for stickers...</p>
            </div>
          ) : filteredStickers.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {filteredStickers.map((sticker) => (
                <button
                  key={sticker.id}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-24 flex items-center justify-center p-2"
                  onClick={() => handleStickerSelect(sticker.url)}
                >
                  <img 
                    src={sticker.thumbnailUrl || sticker.url} 
                    alt={sticker.title} 
                    className="max-h-full object-contain" 
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground">
              <p>No stickers found.</p>
              <p className="text-xs mt-1">Try a different search term or category.</p>
            </div>
          )}
          
          {!isLoading && filteredStickers.length > 0 && (
            <div className="mt-4 mb-2 text-center">
              <p className="text-xs text-muted-foreground">
                Found {filteredStickers.length} stickers
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Stickers provided by Giphy, Pixabay, and Flaticon
              </p>
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
