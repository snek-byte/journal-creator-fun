import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import type { Icon } from '@/types/journal';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IconSelectorProps {
  onIconSelect: (icon: Icon) => void;
}

export function IconSelector({ onIconSelect }: IconSelectorProps) {
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState<'outline' | 'color'>('outline');
  const [icons, setIcons] = useState<any[]>([]);
  const [recentIcons, setRecentIcons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');
  
  // Categories for icons
  const categories = [
    { value: 'all', label: 'All Icons' },
    { value: 'arrow', label: 'Arrows' },
    { value: 'weather', label: 'Weather' },
    { value: 'animal', label: 'Animals' },
    { value: 'food', label: 'Food' },
    { value: 'technology', label: 'Technology' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'people', label: 'People' },
    { value: 'nature', label: 'Nature' },
    { value: 'health', label: 'Health' },
  ];

  // Load recent icons by default
  useEffect(() => {
    loadRecentIcons();
    fetchIcons();
  }, [style, category]);

  const loadRecentIcons = () => {
    try {
      const savedIcons = localStorage.getItem('recentIcons');
      if (savedIcons) {
        setRecentIcons(JSON.parse(savedIcons));
      }
    } catch (error) {
      console.error('Error loading recent icons:', error);
    }
  };

  const saveRecentIcon = (icon: any) => {
    try {
      const existingIcons = JSON.parse(localStorage.getItem('recentIcons') || '[]');
      // Check if icon already exists
      const exists = existingIcons.some((s: any) => s.id === icon.id);
      if (!exists) {
        // Add new icon to the front and keep only the last 8
        const updatedIcons = [icon, ...existingIcons].slice(0, 8);
        localStorage.setItem('recentIcons', JSON.stringify(updatedIcons));
        setRecentIcons(updatedIcons);
      }
    } catch (error) {
      console.error('Error saving recent icon:', error);
    }
  };

  const fetchIcons = async () => {
    setLoading(true);
    // Use different API endpoints based on style
    const apiUrl = style === 'outline' 
      ? `https://api.iconify.design/search?query=${category !== 'all' ? category : ''}&limit=32`
      : `https://api.flaticon.com/v3/search/icons?q=${category !== 'all' ? category : 'popular'}&limit=32&color=color`;
      
    try {
      // For a real implementation, you'd need proper API keys for flaticon or use other free icon APIs
      // For this demo, we'll simulate responses with placeholder data
      
      // Simulate API response with placeholder URLs
      const simulatedResponse = Array.from({ length: 32 }, (_, i) => ({
        id: `icon-${style}-${category}-${i}`,
        name: `${style} ${category} icon ${i}`,
        url: style === 'outline'
          ? `https://api.iconify.design/mdi/${category === 'all' ? 'star' : category}-outline.svg?color=black`
          : `https://cdn-icons-png.flaticon.com/128/1/1438.png`,
      }));
      
      setTimeout(() => {
        setIcons(simulatedResponse);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching icons:', error);
      setLoading(false);
    }
  };

  const searchIcons = async () => {
    if (!search) {
      fetchIcons();
      return;
    }
    
    setLoading(true);
    try {
      // Simulate search API call
      setTimeout(() => {
        const simulatedResults = Array.from({ length: 16 }, (_, i) => ({
          id: `icon-search-${style}-${i}`,
          name: `${search} ${style} icon ${i}`,
          url: style === 'outline'
            ? `https://api.iconify.design/mdi/${search.toLowerCase().replace(/\s/g, '-')}.svg?color=black`
            : `https://cdn-icons-png.flaticon.com/128/2/2231.png`,
        }));
        
        setIcons(simulatedResults);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error searching icons:', error);
      setLoading(false);
    }
  };

  const handleIconClick = (icon: any) => {
    const selectedIcon: Icon = {
      id: icon.id,
      url: icon.url,
      position: { x: 50, y: 50 },
      style: style,
      size: 48,
      color: style === 'color' ? undefined : '#000000'
    };
    
    onIconSelect(selectedIcon);
    saveRecentIcon(icon);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose an Icon</DialogTitle>
          <DialogDescription>
            Search and select an icon to add to your journal
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Select value={style} onValueChange={(value: 'outline' | 'color') => setStyle(value)}>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="color">Color</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-2/3">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchIcons()}
              className="flex-1"
            />
            <Button onClick={searchIcons} disabled={loading} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  Loading icons...
                </div>
              ) : icons.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No icons found. Try a different search term or category.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {icons.map((icon: any) => (
                    <button
                      key={icon.id}
                      onClick={() => handleIconClick(icon)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
                    >
                      <img
                        src={icon.url}
                        alt={icon.name}
                        className="w-8 h-8 object-contain"
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
              {recentIcons.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No recent icons. Add some icons to see them here.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {recentIcons.map((icon: any) => (
                    <button
                      key={icon.id}
                      onClick={() => handleIconClick(icon)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
                    >
                      <img
                        src={icon.url}
                        alt={icon.name}
                        className="w-8 h-8 object-contain"
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
