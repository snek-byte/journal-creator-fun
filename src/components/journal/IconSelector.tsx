
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  HexColorPicker, 
  HexColorInput 
} from "react-colorful";

// Add the icon styling options
interface IconStylingOptions {
  color: string;
  size: number;
}

interface IconSelectorProps {
  onIconSelect: (icon: { url: string, style: 'outline' | 'color' }) => void;
  selectedIconId?: string | null;
  iconOptions?: IconStylingOptions;
  onIconUpdate?: (updates: Partial<IconStylingOptions>) => void;
}

export function IconSelector({ 
  onIconSelect, 
  selectedIconId, 
  iconOptions = { 
    color: '#000000', 
    size: 48 
  },
  onIconUpdate 
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [iconStyle, setIconStyle] = useState<'outline' | 'color'>('outline');
  const [isLoading, setIsLoading] = useState(false);
  const [currentIconColor, setCurrentIconColor] = useState(iconOptions.color);
  const [currentIconSize, setCurrentIconSize] = useState(iconOptions.size);

  // Icon categories with reliable CDN URLs
  const iconCategories = [
    {
      name: 'Weather',
      icons: [
        { name: 'Sun', url: 'https://cdn-icons-png.flaticon.com/512/3104/3104613.png' },
        { name: 'Cloud', url: 'https://cdn-icons-png.flaticon.com/512/414/414825.png' },
        { name: 'Rain', url: 'https://cdn-icons-png.flaticon.com/512/2675/2675876.png' },
        { name: 'Snow', url: 'https://cdn-icons-png.flaticon.com/512/2942/2942441.png' },
        { name: 'Storm', url: 'https://cdn-icons-png.flaticon.com/512/2942/2942166.png' },
        { name: 'Lightning', url: 'https://cdn-icons-png.flaticon.com/512/3104/3104635.png' },
        { name: 'Rainbow', url: 'https://cdn-icons-png.flaticon.com/512/2942/2942446.png' },
        { name: 'Umbrella', url: 'https://cdn-icons-png.flaticon.com/512/2590/2590274.png' },
      ]
    },
    {
      name: 'Animals',
      icons: [
        { name: 'Cat', url: 'https://cdn-icons-png.flaticon.com/512/3163/3163178.png' },
        { name: 'Dog', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069197.png' },
        { name: 'Bird', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069105.png' },
        { name: 'Fish', url: 'https://cdn-icons-png.flaticon.com/512/471/471342.png' },
        { name: 'Turtle', url: 'https://cdn-icons-png.flaticon.com/512/2370/2370335.png' },
        { name: 'Rabbit', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png' },
        { name: 'Fox', url: 'https://cdn-icons-png.flaticon.com/512/8835/8835701.png' },
        { name: 'Lion', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069002.png' },
      ]
    },
    {
      name: 'Travel',
      icons: [
        { name: 'Airplane', url: 'https://cdn-icons-png.flaticon.com/512/826/826437.png' },
        { name: 'Car', url: 'https://cdn-icons-png.flaticon.com/512/3393/3393250.png' },
        { name: 'Train', url: 'https://cdn-icons-png.flaticon.com/512/8613/8613571.png' },
        { name: 'Ship', url: 'https://cdn-icons-png.flaticon.com/512/1170/1170576.png' },
        { name: 'Compass', url: 'https://cdn-icons-png.flaticon.com/512/2785/2785834.png' },
        { name: 'Map', url: 'https://cdn-icons-png.flaticon.com/512/1379/1379505.png' },
        { name: 'Suitcase', url: 'https://cdn-icons-png.flaticon.com/512/149/149337.png' },
        { name: 'Passport', url: 'https://cdn-icons-png.flaticon.com/512/1147/1147125.png' },
      ]
    },
    {
      name: 'Nature',
      icons: [
        { name: 'Tree', url: 'https://cdn-icons-png.flaticon.com/512/7257/7257232.png' },
        { name: 'Flower', url: 'https://cdn-icons-png.flaticon.com/512/1647/1647683.png' },
        { name: 'Mountain', url: 'https://cdn-icons-png.flaticon.com/512/3309/3309973.png' },
        { name: 'Beach', url: 'https://cdn-icons-png.flaticon.com/512/2333/2333015.png' },
        { name: 'Forest', url: 'https://cdn-icons-png.flaticon.com/512/2534/2534050.png' },
        { name: 'Leaf', url: 'https://cdn-icons-png.flaticon.com/512/2925/2925727.png' },
        { name: 'Cactus', url: 'https://cdn-icons-png.flaticon.com/512/2278/2278028.png' },
        { name: 'Water', url: 'https://cdn-icons-png.flaticon.com/512/606/606797.png' },
      ]
    },
    {
      name: 'Food',
      icons: [
        { name: 'Pizza', url: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png' },
        { name: 'Burger', url: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
        { name: 'Coffee', url: 'https://cdn-icons-png.flaticon.com/512/3127/3127407.png' },
        { name: 'Cake', url: 'https://cdn-icons-png.flaticon.com/512/3190/3190871.png' },
        { name: 'Fruit', url: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
        { name: 'Ice Cream', url: 'https://cdn-icons-png.flaticon.com/512/3090/3090437.png' },
        { name: 'Sushi', url: 'https://cdn-icons-png.flaticon.com/512/2252/2252075.png' },
        { name: 'Taco', url: 'https://cdn-icons-png.flaticon.com/512/2515/2515183.png' },
      ]
    },
    {
      name: 'Activities',
      icons: [
        { name: 'Sport', url: 'https://cdn-icons-png.flaticon.com/512/4219/4219908.png' },
        { name: 'Music', url: 'https://cdn-icons-png.flaticon.com/512/3659/3659784.png' },
        { name: 'Art', url: 'https://cdn-icons-png.flaticon.com/512/1048/1048315.png' },
        { name: 'Reading', url: 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png' },
        { name: 'Gaming', url: 'https://cdn-icons-png.flaticon.com/512/7101/7101818.png' },
        { name: 'Hiking', url: 'https://cdn-icons-png.flaticon.com/512/7239/7239096.png' },
        { name: 'Camping', url: 'https://cdn-icons-png.flaticon.com/512/1974/1974355.png' },
        { name: 'Photography', url: 'https://cdn-icons-png.flaticon.com/512/3178/3178209.png' },
      ]
    },
    {
      name: 'Symbols',
      icons: [
        { name: 'Heart', url: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' },
        { name: 'Star', url: 'https://cdn-icons-png.flaticon.com/512/16/16294.png' },
        { name: 'Flag', url: 'https://cdn-icons-png.flaticon.com/512/25/25427.png' },
        { name: 'Trophy', url: 'https://cdn-icons-png.flaticon.com/512/548/548481.png' },
        { name: 'Medal', url: 'https://cdn-icons-png.flaticon.com/512/179/179251.png' },
        { name: 'Diamond', url: 'https://cdn-icons-png.flaticon.com/512/166/166422.png' },
        { name: 'Crown', url: 'https://cdn-icons-png.flaticon.com/512/3141/3141781.png' },
        { name: 'Ribbon', url: 'https://cdn-icons-png.flaticon.com/512/444/444605.png' },
      ]
    },
    {
      name: 'Flags',
      icons: [
        { name: 'USA', url: 'https://cdn-icons-png.flaticon.com/512/197/197484.png' },
        { name: 'UK', url: 'https://cdn-icons-png.flaticon.com/512/197/197374.png' },
        { name: 'Canada', url: 'https://cdn-icons-png.flaticon.com/512/197/197430.png' },
        { name: 'France', url: 'https://cdn-icons-png.flaticon.com/512/197/197560.png' },
        { name: 'Germany', url: 'https://cdn-icons-png.flaticon.com/512/197/197571.png' },
        { name: 'Japan', url: 'https://cdn-icons-png.flaticon.com/512/197/197604.png' },
        { name: 'China', url: 'https://cdn-icons-png.flaticon.com/512/197/197375.png' },
        { name: 'Brazil', url: 'https://cdn-icons-png.flaticon.com/512/197/197386.png' },
        { name: 'Mexico', url: 'https://cdn-icons-png.flaticon.com/512/197/197397.png' },
        { name: 'India', url: 'https://cdn-icons-png.flaticon.com/512/197/197419.png' },
        { name: 'Italy', url: 'https://cdn-icons-png.flaticon.com/512/197/197626.png' },
        { name: 'Spain', url: 'https://cdn-icons-png.flaticon.com/512/197/197593.png' },
      ]
    }
  ];

  // Function to filter icons based on search term
  const filterIcons = () => {
    if (!searchTerm.trim()) {
      return iconCategories;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return iconCategories
      .map(category => ({
        name: category.name,
        icons: category.icons.filter(icon => 
          icon.name.toLowerCase().includes(lowerSearchTerm)
        )
      }))
      .filter(category => category.icons.length > 0);
  };

  // Filtering
  const filteredCategories = filterIcons();

  // Handle color change and update parent if needed
  const handleColorChange = (color: string) => {
    setCurrentIconColor(color);
    if (selectedIconId && onIconUpdate) {
      onIconUpdate({ color });
    }
  };

  // Handle size change and update parent if needed
  const handleSizeChange = (values: number[]) => {
    const size = values[0];
    setCurrentIconSize(size);
    if (selectedIconId && onIconUpdate) {
      onIconUpdate({ size });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-tight">Icons & Flags</h3>
        
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="browse" className="text-[10px]">Browse Icons</TabsTrigger>
            <TabsTrigger value="style" className="text-[10px]">Icon Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            {/* Icon style selection */}
            <div className="flex justify-center space-x-2">
              <Button
                size="sm"
                variant={iconStyle === 'outline' ? "default" : "outline"}
                onClick={() => setIconStyle('outline')}
                className="text-xs px-2 py-1"
                type="button"
              >
                Outline
              </Button>
              <Button
                size="sm"
                variant={iconStyle === 'color' ? "default" : "outline"}
                onClick={() => setIconStyle('color')}
                className="text-xs px-2 py-1"
                type="button"
              >
                Color
              </Button>
            </div>
            
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Icon grid */}
            <ScrollArea className="h-[300px] pr-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredCategories.length > 0 ? (
                <div className="space-y-4">
                  {filteredCategories.map((category, index) => (
                    category.icons.length > 0 && (
                      <div key={index} className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground">
                          {category.name}
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          {category.icons.map((icon, iconIndex) => (
                            <button
                              key={iconIndex}
                              className="p-1 bg-white rounded border border-gray-200 hover:border-primary/50 h-12"
                              onClick={() => onIconSelect({ 
                                url: icon.url, 
                                style: iconStyle 
                              })}
                              type="button"
                            >
                              <img 
                                src={icon.url} 
                                alt={icon.name} 
                                className="w-full h-full object-contain" 
                                loading="lazy"
                                onError={(e) => {
                                  console.error(`Failed to load icon: ${icon.url}`);
                                  e.currentTarget.src = 'https://placehold.co/100x100/png?text=Icon+Error';
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  No icons found
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-4">
            {selectedIconId ? (
              <>
                <div className="space-y-3">
                  <h4 className="text-xs font-medium">Icon Color</h4>
                  <HexColorPicker 
                    color={currentIconColor} 
                    onChange={handleColorChange} 
                    className="w-full" 
                  />
                  <div className="flex gap-2 items-center">
                    <span className="text-xs">Hex:</span>
                    <HexColorInput 
                      color={currentIconColor} 
                      onChange={handleColorChange} 
                      className="flex-1 px-2 py-1 text-xs border rounded"
                      prefixed 
                    />
                    <div 
                      className="w-8 h-6 rounded border"
                      style={{ backgroundColor: currentIconColor }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xs font-medium">Icon Size</h4>
                  <Slider
                    value={[currentIconSize]}
                    min={16}
                    max={96}
                    step={4}
                    onValueChange={handleSizeChange}
                  />
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Small</span>
                    <span className="text-xs">{currentIconSize}px</span>
                    <span className="text-xs text-muted-foreground">Large</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-center">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    No icon selected
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Select an icon from the Browse tab first
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
