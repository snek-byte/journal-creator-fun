
import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
}

// Sticker metadata structure
interface Sticker {
  url: string;
  keywords: string[];
  category: string;
  name: string;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  
  // Initialize sticker library
  useEffect(() => {
    const stickerLibrary: Sticker[] = [
      // Nature category
      {
        url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=150&h=150",
        keywords: ["flower", "orange", "nature", "blossom", "plant", "garden"],
        category: "nature",
        name: "Orange Flower"
      },
      {
        url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=150&h=150",
        keywords: ["cat", "pet", "animal", "orange", "tabby", "kitten"],
        category: "animals",
        name: "Orange Cat"
      },
      {
        url: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=150&h=150",
        keywords: ["deer", "animal", "forest", "wildlife", "brown", "mammal"],
        category: "animals",
        name: "Brown Deer"
      },
      {
        url: "https://images.unsplash.com/photo-1438565434616-3ef039228b15?auto=format&fit=crop&w=150&h=150",
        keywords: ["goat", "animal", "mountain", "wildlife", "horns", "mammal"],
        category: "animals",
        name: "Mountain Goat"
      },
      {
        url: "https://images.unsplash.com/photo-1501286353178-1ec871814328?auto=format&fit=crop&w=150&h=150",
        keywords: ["monkey", "animal", "banana", "wildlife", "primate", "mammal"],
        category: "animals",
        name: "Monkey with Banana"
      },
      // Food category
      {
        url: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=150&h=150",
        keywords: ["coffee", "drink", "food", "cafe", "cup", "breakfast"],
        category: "food",
        name: "Coffee Cup"
      },
      {
        url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=150&h=150",
        keywords: ["strawberry", "food", "fruit", "dessert", "sweet", "berry", "red"],
        category: "food",
        name: "Strawberry"
      },
      {
        url: "https://images.unsplash.com/photo-1563289412-8a7161e7bd4c?auto=format&fit=crop&w=150&h=150",
        keywords: ["pizza", "food", "italian", "dinner", "lunch", "cheese"],
        category: "food",
        name: "Pizza Slice"
      },
      // Plants category
      {
        url: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=150&h=150",
        keywords: ["cactus", "plant", "succulent", "nature", "green", "desert"],
        category: "nature",
        name: "Cactus Plant"
      },
      {
        url: "https://images.unsplash.com/photo-1567748157439-651aca2ff064?auto=format&fit=crop&w=150&h=150",
        keywords: ["rose", "flower", "red", "love", "romantic", "plant", "garden"],
        category: "nature",
        name: "Red Rose"
      },
      {
        url: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=150&h=150",
        keywords: ["sunflower", "flower", "yellow", "nature", "summer", "plant", "garden"],
        category: "nature",
        name: "Sunflower"
      },
      {
        url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=150&h=150",
        keywords: ["rose", "flower", "pink", "bouquet", "romantic", "plant", "garden"],
        category: "nature",
        name: "Pink Rose"
      },
      // Beach and travel 
      {
        url: "https://images.unsplash.com/photo-1520699413807-5e25c58e5663?auto=format&fit=crop&w=150&h=150",
        keywords: ["beach", "ocean", "sea", "travel", "vacation", "summer", "sand"],
        category: "travel",
        name: "Beach View"
      },
      {
        url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=150&h=150",
        keywords: ["palm tree", "beach", "tropical", "vacation", "summer", "travel"],
        category: "travel",
        name: "Palm Trees"
      },
      // Decorative
      {
        url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=150&h=150",
        keywords: ["balloon", "celebration", "party", "birthday", "decoration", "colorful"],
        category: "decorative",
        name: "Colorful Balloons"
      },
      {
        url: "https://images.unsplash.com/photo-1577083553630-839d8d6262dc?auto=format&fit=crop&w=150&h=150",
        keywords: ["gift", "present", "box", "birthday", "celebration", "surprise"],
        category: "decorative",
        name: "Gift Box"
      },
      {
        url: "https://images.unsplash.com/photo-1547043688-32b236694495?auto=format&fit=crop&w=150&h=150",
        keywords: ["tape", "washi", "craft", "stationery", "decoration", "colorful"],
        category: "decorative",
        name: "Washi Tape"
      },
      // More nature items
      {
        url: "https://images.unsplash.com/photo-1552649166-9c3524d4793c?auto=format&fit=crop&w=150&h=150",
        keywords: ["butterfly", "insect", "nature", "colorful", "animal", "garden", "spring"],
        category: "animals",
        name: "Butterfly"
      },
      {
        url: "https://images.unsplash.com/photo-1424889152669-ebf06b2cadf5?auto=format&fit=crop&w=150&h=150",
        keywords: ["rainbow", "sky", "nature", "colorful", "weather", "rain"],
        category: "nature",
        name: "Rainbow"
      },
      // More food items
      {
        url: "https://images.unsplash.com/photo-1512793558523-ff302092634b?auto=format&fit=crop&w=150&h=150",
        keywords: ["ice cream", "dessert", "sweet", "food", "cold", "treat"],
        category: "food",
        name: "Ice Cream Cone"
      },
      {
        url: "https://images.unsplash.com/photo-1563897539633-7d4814680f1a?auto=format&fit=crop&w=150&h=150",
        keywords: ["cake", "birthday", "celebration", "dessert", "sweet", "food"],
        category: "food",
        name: "Birthday Cake"
      },
      // Hobbies
      {
        url: "https://images.unsplash.com/photo-1544981037-84fe64950e06?auto=format&fit=crop&w=150&h=150",
        keywords: ["books", "reading", "study", "education", "library", "hobby"],
        category: "hobbies",
        name: "Stack of Books"
      },
      {
        url: "https://images.unsplash.com/photo-1489702932289-406b7782113c?auto=format&fit=crop&w=150&h=150",
        keywords: ["music", "guitar", "instrument", "hobby", "entertainment", "sound"],
        category: "hobbies",
        name: "Guitar"
      },
      // Weather
      {
        url: "https://images.unsplash.com/photo-1561485132-59468cd0b553?auto=format&fit=crop&w=150&h=150",
        keywords: ["snow", "winter", "cold", "weather", "snowflake", "frost"],
        category: "weather",
        name: "Snowflake"
      },
      {
        url: "https://images.unsplash.com/photo-1563148117-11e743207d15?auto=format&fit=crop&w=150&h=150",
        keywords: ["sun", "sunny", "weather", "hot", "summer", "sky"],
        category: "weather",
        name: "Sun"
      },
      // More roses for demonstrating search variety
      {
        url: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=150&h=150",
        keywords: ["rose", "flower", "white", "wedding", "pure", "plant", "garden"],
        category: "nature",
        name: "White Rose"
      },
      {
        url: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=150&h=150",
        keywords: ["rose", "flower", "yellow", "bright", "cheerful", "plant", "garden"],
        category: "nature",
        name: "Yellow Rose"
      },
      {
        url: "https://images.unsplash.com/photo-1519378045141-f0ea6914bb5c?auto=format&fit=crop&w=150&h=150",
        keywords: ["rose", "flower", "purple", "lavender", "unique", "plant", "garden"],
        category: "nature",
        name: "Purple Rose"
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

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all" className="text-[10px]">All</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="animals" className="text-[10px]">Animals</TabsTrigger>
          <TabsTrigger value="food" className="text-[10px]">Food</TabsTrigger>
          <TabsTrigger value="decorative" className="text-[10px]">Decor</TabsTrigger>
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
                    <div className="w-full aspect-square flex items-center justify-center p-1">
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
