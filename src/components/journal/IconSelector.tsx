
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
    { value: 'arrows', label: 'Arrows' },
    { value: 'weather', label: 'Weather' },
    { value: 'animals', label: 'Animals' },
    { value: 'food', label: 'Food' },
    { value: 'tech', label: 'Technology' },
    { value: 'transport', label: 'Transportation' },
    { value: 'people', label: 'People' },
    { value: 'nature', label: 'Nature' },
    { value: 'health', label: 'Health' },
    { value: 'business', label: 'Business' },
    { value: 'social', label: 'Social' },
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

  // Function to get random icons for specific categories and styles
  const fetchIcons = async () => {
    setLoading(true);
    
    try {
      // For consistent icon sets, use these predefined sets based on category and style
      const iconSets: Record<string, Record<string, string[]>> = {
        outline: {
          all: ['home', 'mail', 'settings', 'heart', 'tag', 'user', 'star', 'globe', 'phone', 'bell', 'gift', 'code', 'map-pin', 'image', 'calendar', 'message'],
          arrows: ['arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'corner-up-left', 'corner-up-right', 'corner-down-left', 'corner-down-right', 'chevron-up', 'chevron-down', 'refresh-cw', 'rotate-cw', 'rotate-ccw', 'move'],
          weather: ['cloud', 'sun', 'moon', 'cloud-rain', 'cloud-snow', 'cloud-lightning', 'cloud-drizzle', 'wind', 'umbrella', 'thermometer'],
          animals: ['bird', 'cat', 'dog', 'rabbit', 'fish', 'turtle', 'butterfly', 'bee'],
          food: ['coffee', 'pizza', 'cake', 'ice-cream', 'fruit', 'salad', 'drink', 'bottle'],
          tech: ['cpu', 'database', 'server', 'smartphone', 'tablet', 'laptop', 'monitor', 'printer', 'keyboard', 'mouse', 'battery', 'bluetooth', 'wifi'],
          transport: ['car', 'truck', 'bus', 'train', 'ship', 'plane', 'bicycle', 'navigation'],
          people: ['user', 'users', 'user-plus', 'user-minus', 'user-check', 'user-x', 'baby', 'walk', 'run', 'accessibility'],
          nature: ['leaf', 'tree', 'flower', 'sun', 'mountain', 'water', 'drop'],
          health: ['activity', 'heart', 'thermometer', 'first-aid', 'pill', 'stethoscope', 'dumbbell'],
          business: ['briefcase', 'clipboard', 'file', 'folder', 'chart', 'pie-chart', 'bar-chart', 'layers', 'trending-up', 'trending-down'],
          social: ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'github', 'mail', 'share']
        },
        color: {
          all: ['1/1', '2/2', '3/3', '4/4', '5/5', '6/6', '7/7', '8/8', '9/9', '10/10', '11/11', '12/12', '13/13', '14/14', '15/15', '16/16'],
          arrows: ['17/17', '18/18', '19/19', '20/20', '21/21', '22/22', '23/23', '24/24'],
          weather: ['25/25', '26/26', '27/27', '28/28', '29/29', '30/30', '31/31', '32/32'],
          animals: ['33/33', '34/34', '35/35', '36/36', '37/37', '38/38', '39/39', '40/40'],
          food: ['41/41', '42/42', '43/43', '44/44', '45/45', '46/46', '47/47', '48/48'],
          tech: ['49/49', '50/50', '51/51', '52/52', '53/53', '54/54', '55/55', '56/56'],
          transport: ['57/57', '58/58', '59/59', '60/60', '61/61', '62/62', '63/63', '64/64'],
          people: ['65/65', '66/66', '67/67', '68/68', '69/69', '70/70', '71/71', '72/72'],
          nature: ['73/73', '74/74', '75/75', '76/76', '77/77', '78/78', '79/79', '80/80'],
          health: ['81/81', '82/82', '83/83', '84/84', '85/85', '86/86', '87/87', '88/88'],
          business: ['89/89', '90/90', '91/91', '92/92', '93/93', '94/94', '95/95', '96/96'],
          social: ['97/97', '98/98', '99/99', '100/100', '101/101', '102/102', '103/103', '104/104']
        }
      };
      
      // Get the icon set based on style and category
      const selectedCategory = category !== 'all' ? category : 'all';
      const iconNames = iconSets[style][selectedCategory] || iconSets[style]['all'];
      
      // Generate the icon URLs based on the selected style and names
      const iconData = iconNames.map((name, index) => {
        const id = `icon-${style}-${name}-${index}`;
        let url;
        
        if (style === 'outline') {
          // Using Lucide SVG URLs for outline icons
          url = `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${name}.svg`;
        } else {
          // Using Flaticon for color icons
          url = `https://cdn-icons-png.flaticon.com/128/${name}.png`;
        }
        
        return {
          id,
          name: name.replace(/-/g, ' '),
          url,
          style
        };
      });
      
      setIcons(iconData);
    } catch (error) {
      console.error('Error fetching icons:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchIcons = async () => {
    if (!search.trim()) {
      fetchIcons();
      return;
    }
    
    setLoading(true);
    try {
      const query = search.toLowerCase().trim();
      
      // For outline icons, search through Lucide icons
      if (style === 'outline') {
        // Get all possible outline icons
        const allIcons = [
          ...categories.flatMap(cat => {
            if (cat.value === 'all') return [];
            return ['outline', cat.value];
          })
        ];
        
        // Filter icons based on search
        const filteredIcons = allIcons.filter(name => 
          name.toLowerCase().includes(query)
        ).slice(0, 16);
        
        const searchResults = filteredIcons.map((name, index) => ({
          id: `icon-search-outline-${name}-${index}`,
          name: name.replace(/-/g, ' '),
          url: `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${name}.svg`,
          style: 'outline'
        }));
        
        setIcons(searchResults.length > 0 ? searchResults : [{
          id: 'icon-search-outline-tag-0',
          name: 'tag',
          url: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/tag.svg',
          style: 'outline'
        }]);
      } else {
        // For color icons, use a set of colorful icons as search results
        const searchNumbers = Array.from({ length: 16 }, (_, i) => i + 1);
        const searchResults = searchNumbers.map(num => ({
          id: `icon-search-color-${num}`,
          name: `${search} icon ${num}`,
          url: `https://cdn-icons-png.flaticon.com/128/${num}/${num}.png`,
          style: 'color'
        }));
        
        setIcons(searchResults);
      }
    } catch (error) {
      console.error('Error searching icons:', error);
    } finally {
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
