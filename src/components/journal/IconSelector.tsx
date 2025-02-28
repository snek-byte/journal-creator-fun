
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Compass, Lightbulb, Heart, Star, Sun, Moon, Cloud, Flag, Bookmark, Award, Gift, Music, Camera, 
         ShoppingCart, Coffee, Cpu, Globe, Home, Map, Smile, Mail, Phone, Settings, User, Users, FileText, 
         Calendar, Clock, Bell, Book, Briefcase, Building, Link, Tag, Truck, Zap, Target, Umbrella, 
         Diamond, Palette, Scissors, Headphones, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IconSelectorProps {
  onIconSelect: (icon: { url: string, style: 'outline' | 'color' }) => void;
}

export function IconSelector({ onIconSelect }: IconSelectorProps) {
  const [iconStyle, setIconStyle] = useState<'outline' | 'color'>('outline');
  const [category, setCategory] = useState('general');
  
  // All available Lucide icons organized by category
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
      { component: Zap, name: 'Zap' },
      { component: Target, name: 'Target' },
      { component: Diamond, name: 'Diamond' },
      { component: Palette, name: 'Palette' },
    ],
    nature: [
      { component: Sun, name: 'Sun' },
      { component: Moon, name: 'Moon' },
      { component: Cloud, name: 'Cloud' },
      { component: Globe, name: 'Globe' },
      { component: Map, name: 'Map' },
      { component: Flag, name: 'Flag' },
      { component: Umbrella, name: 'Umbrella' },
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
      { component: Scissors, name: 'Scissors' },
      { component: Headphones, name: 'Headphones' },
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
      { component: MessageSquare, name: 'Message' },
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
        <TabsList className="w-full grid grid-cols-2 mb-2">
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
      
      <Tabs defaultValue="general" value={category} onValueChange={setCategory}>
        <TabsList className="w-full grid grid-cols-5 mb-2">
          <TabsTrigger value="general" className="text-[9px]">General</TabsTrigger>
          <TabsTrigger value="nature" className="text-[9px]">Nature</TabsTrigger>
          <TabsTrigger value="objects" className="text-[9px]">Objects</TabsTrigger>
          <TabsTrigger value="activities" className="text-[9px]">Activities</TabsTrigger>
          <TabsTrigger value="communication" className="text-[9px]">Comm.</TabsTrigger>
        </TabsList>
        
        {Object.entries(iconSets).map(([cat, icons]) => (
          <TabsContent key={cat} value={cat}>
            <ScrollArea className="h-[200px]">
              <div className="grid grid-cols-4 gap-2">
                {icons.map(({ component: IconComponent, name }) => (
                  <button
                    key={name}
                    className="p-1 rounded hover:bg-accent transition-colors flex flex-col items-center justify-center h-16"
                    onClick={() => handleIconSelect(IconComponent, name)}
                    title={name}
                  >
                    <IconComponent className="h-8 w-8 mb-1" />
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">{name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
