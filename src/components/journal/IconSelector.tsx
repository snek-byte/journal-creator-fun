
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Compass, Lightbulb, Heart, Star, Sun, Moon, Cloud, Flag, Bookmark, Award, Gift, Music, Camera, ShoppingCart, Coffee, Cpu, Globe, Home, Map, Smile, Mail, Phone, Settings, User, Users, FileText, Calendar, Clock, Bell, Book, Briefcase, Building, Link, Tag, Truck } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IconSelectorProps {
  onIconSelect: (icon: { url: string, style: 'outline' | 'color' }) => void;
}

export function IconSelector({ onIconSelect }: IconSelectorProps) {
  const [category, setCategory] = useState('general');
  const [iconStyle, setIconStyle] = useState<'outline' | 'color'>('outline');
  
  // All available Lucide icons for selection (just a subset for the demo)
  const iconSets = {
    general: [
      { component: Search, name: 'Search' },
      { component: Compass, name: 'Compass' },
      { component: Lightbulb, name: 'Lightbulb' },
      { component: Heart, name: 'Heart' },
      { component: Star, name: 'Star' },
      { component: Settings, name: 'Settings' },
      { component: User, name: 'User' },
      { component: FileText, name: 'Document' },
    ],
    nature: [
      { component: Sun, name: 'Sun' },
      { component: Moon, name: 'Moon' },
      { component: Cloud, name: 'Cloud' },
      { component: Globe, name: 'Globe' },
      { component: Map, name: 'Map' },
      { component: Flag, name: 'Flag' },
    ],
    objects: [
      { component: Bookmark, name: 'Bookmark' },
      { component: Award, name: 'Award' },
      { component: Gift, name: 'Gift' },
      { component: Music, name: 'Music' },
      { component: Camera, name: 'Camera' },
      { component: Book, name: 'Book' },
      { component: Briefcase, name: 'Briefcase' },
      { component: Building, name: 'Building' },
    ],
    activities: [
      { component: ShoppingCart, name: 'Shopping' },
      { component: Coffee, name: 'Coffee' },
      { component: Cpu, name: 'Technology' },
      { component: Home, name: 'Home' },
      { component: Calendar, name: 'Calendar' },
      { component: Clock, name: 'Clock' },
      { component: Bell, name: 'Notification' },
    ],
    communication: [
      { component: Smile, name: 'Smile' },
      { component: Mail, name: 'Email' },
      { component: Phone, name: 'Phone' },
      { component: Link, name: 'Link' },
      { component: Tag, name: 'Tag' },
      { component: Truck, name: 'Shipping' },
      { component: Users, name: 'Users' },
    ],
  };

  type CategoryKey = keyof typeof iconSets;

  const convertToSVG = (IconComponent: React.FC<any>) => {
    // Create an SVG string from the Lucide icon component
    // Render the icon to get its SVG content
    const element = IconComponent({});
    
    // Access the rendered SVG content safely, handling different React node types
    let svgContent = '';
    if (element && typeof element === 'object' && 'props' in element) {
      svgContent = element.props?.children || '';
    }
    
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgContent}</svg>`;
    
    // Convert to a data URL
    const encodedSvg = encodeURIComponent(svgString);
    return `data:image/svg+xml;utf8,${encodedSvg}`;
  };

  const handleIconSelect = (IconComponent: React.FC<any>, name: string) => {
    const svgUrl = convertToSVG(IconComponent);
    onIconSelect({ url: svgUrl, style: iconStyle });
    toast.success(`${name} icon added! Click and drag to position it.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Icons</h3>
      </div>

      <Tabs defaultValue="outline" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger 
            value="outline" 
            onClick={() => setIconStyle('outline')}
            className="text-xs"
          >
            Outline
          </TabsTrigger>
          <TabsTrigger 
            value="color" 
            onClick={() => setIconStyle('color')}
            className="text-xs"
          >
            Color
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
        {Object.keys(iconSets).map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7"
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[200px]">
        <div className="grid grid-cols-4 gap-2">
          {iconSets[category as CategoryKey].map(({ component: IconComponent, name }) => (
            <button
              key={name}
              className="p-1 rounded hover:bg-accent transition-colors flex flex-col items-center justify-center h-16"
              onClick={() => handleIconSelect(IconComponent, name)}
              title={name}
            >
              <IconComponent className="h-8 w-8 mb-1" />
              <span className="text-[10px] text-muted-foreground">{name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
