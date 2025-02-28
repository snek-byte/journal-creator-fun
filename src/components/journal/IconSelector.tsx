
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IconColorPicker } from './IconColorPicker';

interface IconSelectorProps {
  onIconSelect: (iconData: { url: string, style: 'outline' | 'color' }) => void;
  selectedIconId: string | null;
  onIconColorChange?: (color: string) => void;
  currentIconColor?: string;
}

export function IconSelector({ 
  onIconSelect, 
  selectedIconId,
  onIconColorChange,
  currentIconColor = '#000000'
}: IconSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [iconStyle, setIconStyle] = useState<'outline' | 'color'>('outline');
  const [iconColor, setIconColor] = useState(currentIconColor);

  // Icons data: URLs of SVG icons
  const icons = [
    // Basic icons
    { url: 'https://api.iconify.design/lucide/heart.svg', category: 'basic', name: 'Heart' },
    { url: 'https://api.iconify.design/lucide/star.svg', category: 'basic', name: 'Star' },
    { url: 'https://api.iconify.design/lucide/thumbs-up.svg', category: 'basic', name: 'Thumbs Up' },
    { url: 'https://api.iconify.design/lucide/smile.svg', category: 'basic', name: 'Smile' },
    { url: 'https://api.iconify.design/lucide/frown.svg', category: 'basic', name: 'Frown' },
    { url: 'https://api.iconify.design/lucide/badge-check.svg', category: 'basic', name: 'Check' },
    { url: 'https://api.iconify.design/lucide/award.svg', category: 'basic', name: 'Award' },
    { url: 'https://api.iconify.design/lucide/crown.svg', category: 'basic', name: 'Crown' },
    
    // Weather icons
    { url: 'https://api.iconify.design/lucide/sun.svg', category: 'weather', name: 'Sun' },
    { url: 'https://api.iconify.design/lucide/cloud.svg', category: 'weather', name: 'Cloud' },
    { url: 'https://api.iconify.design/lucide/cloud-rain.svg', category: 'weather', name: 'Rain' },
    { url: 'https://api.iconify.design/lucide/cloud-snow.svg', category: 'weather', name: 'Snow' },
    { url: 'https://api.iconify.design/lucide/wind.svg', category: 'weather', name: 'Wind' },
    { url: 'https://api.iconify.design/lucide/cloud-lightning.svg', category: 'weather', name: 'Lightning' },
    
    // Nature icons
    { url: 'https://api.iconify.design/lucide/flower.svg', category: 'nature', name: 'Flower' },
    { url: 'https://api.iconify.design/lucide/palm-tree.svg', category: 'nature', name: 'Palm Tree' },
    { url: 'https://api.iconify.design/lucide/leaf.svg', category: 'nature', name: 'Leaf' },
    { url: 'https://api.iconify.design/lucide/mountain.svg', category: 'nature', name: 'Mountain' },
    
    // Animal icons
    { url: 'https://api.iconify.design/lucide/paw-print.svg', category: 'animal', name: 'Paw Print' },
    { url: 'https://api.iconify.design/lucide/fish.svg', category: 'animal', name: 'Fish' },
    { url: 'https://api.iconify.design/lucide/butterfly.svg', category: 'animal', name: 'Butterfly' },
    
    // Food icons
    { url: 'https://api.iconify.design/lucide/coffee.svg', category: 'food', name: 'Coffee' },
    { url: 'https://api.iconify.design/lucide/dessert.svg', category: 'food', name: 'Dessert' },
    { url: 'https://api.iconify.design/lucide/pizza.svg', category: 'food', name: 'Pizza' },
    { url: 'https://api.iconify.design/lucide/sandwich.svg', category: 'food', name: 'Sandwich' },
    { url: 'https://api.iconify.design/lucide/ice-cream.svg', category: 'food', name: 'Ice Cream' },
    
    // Travel icons
    { url: 'https://api.iconify.design/lucide/plane.svg', category: 'travel', name: 'Airplane' },
    { url: 'https://api.iconify.design/lucide/ship.svg', category: 'travel', name: 'Ship' },
    { url: 'https://api.iconify.design/lucide/train.svg', category: 'travel', name: 'Train' },
    { url: 'https://api.iconify.design/lucide/car.svg', category: 'travel', name: 'Car' },
    { url: 'https://api.iconify.design/lucide/bicycle.svg', category: 'travel', name: 'Bicycle' },
    { url: 'https://api.iconify.design/lucide/map.svg', category: 'travel', name: 'Map' },
    { url: 'https://api.iconify.design/lucide/compass.svg', category: 'travel', name: 'Compass' },
    
    // Tech icons
    { url: 'https://api.iconify.design/lucide/smartphone.svg', category: 'tech', name: 'Smartphone' },
    { url: 'https://api.iconify.design/lucide/laptop.svg', category: 'tech', name: 'Laptop' },
    { url: 'https://api.iconify.design/lucide/headphones.svg', category: 'tech', name: 'Headphones' },
    { url: 'https://api.iconify.design/lucide/camera.svg', category: 'tech', name: 'Camera' },
    { url: 'https://api.iconify.design/lucide/gamepad.svg', category: 'tech', name: 'Gamepad' },
    { url: 'https://api.iconify.design/lucide/tv.svg', category: 'tech', name: 'TV' },
    { url: 'https://api.iconify.design/lucide/radio.svg', category: 'tech', name: 'Radio' },
    
    // Social & communication
    { url: 'https://api.iconify.design/lucide/message-circle.svg', category: 'social', name: 'Message' },
    { url: 'https://api.iconify.design/lucide/mail.svg', category: 'social', name: 'Mail' },
    { url: 'https://api.iconify.design/lucide/phone.svg', category: 'social', name: 'Phone' },
    { url: 'https://api.iconify.design/lucide/send.svg', category: 'social', name: 'Send' },
    { url: 'https://api.iconify.design/lucide/bell.svg', category: 'social', name: 'Notification' },
    { url: 'https://api.iconify.design/lucide/share.svg', category: 'social', name: 'Share' },
    
    // Misc
    { url: 'https://api.iconify.design/lucide/gift.svg', category: 'misc', name: 'Gift' },
    { url: 'https://api.iconify.design/lucide/music.svg', category: 'misc', name: 'Music' },
    { url: 'https://api.iconify.design/lucide/book.svg', category: 'misc', name: 'Book' },
    { url: 'https://api.iconify.design/lucide/globe.svg', category: 'misc', name: 'Globe' },
    { url: 'https://api.iconify.design/lucide/flag.svg', category: 'misc', name: 'Flag' },
    { url: 'https://api.iconify.design/lucide/tag.svg', category: 'misc', name: 'Tag' },
    { url: 'https://api.iconify.design/lucide/calendar.svg', category: 'misc', name: 'Calendar' },
    { url: 'https://api.iconify.design/lucide/clock.svg', category: 'misc', name: 'Clock' },
  ];
  
  // Filter icons based on search and category
  const filteredIcons = icons.filter(icon => {
    if (selectedCategory !== 'all' && icon.category !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      return icon.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const handleIconSelect = (iconUrl: string) => {
    onIconSelect({ url: iconUrl, style: iconStyle });
  };
  
  const handleColorChange = (color: string) => {
    setIconColor(color);
    if (onIconColorChange && selectedIconId) {
      onIconColorChange(color);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search icons..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Icon Style Selection */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium">Icon Style:</span>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={iconStyle === 'outline' ? "default" : "outline"} 
            onClick={() => setIconStyle('outline')}
            className="text-xs h-8"
          >
            Outline
          </Button>
          <Button 
            size="sm" 
            variant={iconStyle === 'color' ? "default" : "outline"} 
            onClick={() => setIconStyle('color')}
            className="text-xs h-8"
          >
            Color
          </Button>
        </div>
      </div>
      
      {/* Icon Color Picker */}
      <IconColorPicker 
        selectedColor={iconColor}
        onChange={handleColorChange}
        disabled={!selectedIconId}
      />

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="all" className="text-[10px]">All</TabsTrigger>
          <TabsTrigger value="basic" className="text-[10px]">Basic</TabsTrigger>
          <TabsTrigger value="weather" className="text-[10px]">Weather</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
        </TabsList>
        
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="animal" className="text-[10px]">Animals</TabsTrigger>
          <TabsTrigger value="food" className="text-[10px]">Food</TabsTrigger>
          <TabsTrigger value="tech" className="text-[10px]">Tech</TabsTrigger>
          <TabsTrigger value="misc" className="text-[10px]">Misc</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[270px] mt-2">
          <div className="grid grid-cols-4 gap-2">
            {filteredIcons.map((icon, index) => (
              <Button
                key={index}
                variant="outline"
                className="p-2 h-16 flex flex-col gap-1 items-center justify-center"
                onClick={() => handleIconSelect(icon.url)}
                title={icon.name}
              >
                <img 
                  src={icon.url} 
                  alt={icon.name} 
                  className="w-6 h-6"
                  style={iconStyle === 'color' ? {
                    filter: 'brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(200%) hue-rotate(330deg)'
                  } : {}}
                />
                <span className="text-[9px] truncate w-full text-center">{icon.name}</span>
              </Button>
            ))}
          </div>
          
          {filteredIcons.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p className="text-sm">No icons found</p>
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
