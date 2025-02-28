
import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/types/journal';
import { v4 as uuidv4 } from 'uuid';
import { Layers, Heart, Star, Sun, Moon, Cloud, Zap, Music, Smile, Award, Coffee, Gift } from 'lucide-react';

interface IconSelectorProps {
  onIconSelect: (icon: Icon) => void;
}

const iconOptions = [
  { component: Layers, alt: 'Layers' },
  { component: Heart, alt: 'Heart' },
  { component: Star, alt: 'Star' },
  { component: Sun, alt: 'Sun' },
  { component: Moon, alt: 'Moon' },
  { component: Cloud, alt: 'Cloud' },
  { component: Zap, alt: 'Zap' },
  { component: Music, alt: 'Music' },
  { component: Smile, alt: 'Smile' },
  { component: Award, alt: 'Award' },
  { component: Coffee, alt: 'Coffee' },
  { component: Gift, alt: 'Gift' },
];

export function IconSelector({ onIconSelect }: IconSelectorProps) {
  // Convert a lucide icon to a data URL for storage
  const iconToUrl = (IconComponent: React.ElementType, color = 'currentColor'): string => {
    // Create a temporary React element with the icon component
    const element = React.createElement(IconComponent);
    
    // Extract the SVG content from the component's props
    // Lucide icons have their SVG paths in the children prop
    const svgContent = element.props?.children || '';
    
    // Create the full SVG
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgContent}</svg>`;
    
    // Convert to data URL
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const handleSelectIcon = (IconComponent: React.ElementType, alt: string) => {
    const icon: Icon = {
      id: uuidv4(),
      url: iconToUrl(IconComponent),
      position: { x: 50, y: 50 },
      size: 48,
      style: 'outline'
    };
    onIconSelect(icon);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {iconOptions.map((icon, index) => (
        <Button
          key={index}
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => handleSelectIcon(icon.component, icon.alt)}
        >
          <icon.component className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
}
