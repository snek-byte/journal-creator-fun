
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

  const handleIconSelect = (name: string) => {
    // Create a data URL for the icon
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${iconStyle === 'color' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15 6 21 7 17 11 18 17 12 14 6 17 7 11 3 7 9 6 12 2z"/></svg>`;
    
    // Different SVG strings based on icon name
    let iconSvg = '';
    switch (name) {
      case 'Star':
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${iconStyle === 'color' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        break;
      case 'Heart':
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${iconStyle === 'color' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        break;
      case 'Smile':
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${iconStyle === 'color' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`;
        break;
      case 'Sun': 
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${iconStyle === 'color' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        break;
      case 'Moon':
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${iconStyle === 'color' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        break;
      default:
        iconSvg = svgString;
    }
    
    // Convert to a data URL
    const encodedSvg = encodeURIComponent(iconSvg);
    const dataUrl = `data:image/svg+xml;utf8,${encodedSvg}`;
    
    onIconSelect({ url: dataUrl, style: iconStyle });
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
                    onClick={() => handleIconSelect(name)}
                    title={name}
                  >
                    <div className="h-8 w-8 mb-1 flex items-center justify-center">
                      <IconComponent className="h-6 w-6" />
                    </div>
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
