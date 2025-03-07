
import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Palette, ChevronDown, ChevronUp, X } from "lucide-react";

interface ImageFilterSelectorProps {
  onFilterChange: (filter: string) => void;
  currentFilter?: string;
}

export function ImageFilterSelector({ onFilterChange, currentFilter = 'none' }: ImageFilterSelectorProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(currentFilter);
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  
  // Update local state when the prop changes
  useEffect(() => {
    setSelectedFilter(currentFilter);
  }, [currentFilter]);
  
  // Basic filter presets
  const basicFilterPresets = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(80%)' },
    { name: 'Vintage', value: 'sepia(60%) contrast(110%) brightness(90%)' },
    { name: 'Warm', value: 'brightness(115%) saturate(130%) hue-rotate(10deg)' },
    { name: 'Cool', value: 'brightness(95%) saturate(90%) hue-rotate(-15deg)' },
    { name: 'Soft Light', value: 'brightness(110%) contrast(95%) saturate(120%)' },
    { name: 'Dramatic', value: 'contrast(130%) saturate(120%)' },
    { 
      name: 'Dark Vignette', 
      value: 'vignette',
      cssClass: 'vignette-preview'
    },
    { name: 'Faded', value: 'brightness(115%) contrast(90%) saturate(85%)' },
    { name: 'Matte', value: 'contrast(95%) saturate(95%) brightness(110%)' },
    { name: 'Pastel', value: 'brightness(120%) contrast(85%) saturate(85%)' },
  ];
  
  // Advanced filter presets (30 more unique filters)
  const advancedFilterPresets = [
    // Creative Color Filters
    { name: 'Sunset', value: 'saturate(150%) hue-rotate(20deg) brightness(110%)' },
    { name: 'Twilight', value: 'saturate(120%) hue-rotate(-20deg) brightness(90%)' },
    { name: 'Golden Hour', value: 'contrast(105%) brightness(110%) sepia(30%)' },
    { name: 'Emerald', value: 'hue-rotate(80deg) saturate(140%) brightness(105%)' },
    { name: 'Amethyst', value: 'hue-rotate(-60deg) saturate(130%) brightness(100%)' },
    { name: 'Coffee', value: 'sepia(50%) saturate(120%) contrast(105%)' },
    { name: 'Forest', value: 'hue-rotate(60deg) saturate(110%) brightness(95%)' },
    { name: 'Desert', value: 'sepia(40%) saturate(140%) contrast(100%) hue-rotate(10deg)' },
    { name: 'Ocean', value: 'hue-rotate(-30deg) saturate(120%) brightness(100%)' },
    { name: 'Arctic', value: 'brightness(120%) contrast(90%) saturate(80%) hue-rotate(-10deg)' },
    
    // Vintage and Film Styles
    { name: 'Polaroid', value: 'sepia(20%) brightness(105%) contrast(90%) saturate(110%)' },
    { name: 'Old Film', value: 'grayscale(40%) sepia(30%) contrast(115%)' },
    { name: 'Technicolor', value: 'saturate(170%) contrast(110%) brightness(105%)' },
    { name: 'Kodachrome', value: 'contrast(115%) saturate(130%) brightness(105%)' },
    { name: 'Faded Film', value: 'contrast(90%) brightness(110%) saturate(85%) sepia(10%)' },
    { name: 'Retro', value: 'sepia(40%) saturate(120%) contrast(105%) hue-rotate(-10deg)' },
    { name: 'Classic Cinema', value: 'grayscale(30%) contrast(120%) brightness(95%)' },
    { name: 'Daguerreotype', value: 'grayscale(100%) contrast(140%) brightness(90%) sepia(30%)' },
    { name: 'Monochrome Blue', value: 'grayscale(100%) brightness(110%) hue-rotate(200deg) saturate(200%)' },
    { name: 'Monochrome Red', value: 'grayscale(100%) brightness(100%) hue-rotate(-30deg) saturate(200%)' },
    
    // Special Effects
    { name: 'High Contrast', value: 'contrast(180%) brightness(90%)' },
    { name: 'Cyberpunk', value: 'hue-rotate(-25deg) saturate(170%) contrast(140%) brightness(110%)' },
    { name: 'Dream', value: 'brightness(110%) contrast(90%) saturate(90%) blur(0.5px)' },
    { name: 'Nightfall', value: 'brightness(80%) contrast(125%) saturate(110%) hue-rotate(-20deg)' },
    { name: 'Infrared', value: 'hue-rotate(180deg) saturate(130%) contrast(130%) brightness(120%)' },
    { name: 'X-Ray', value: 'grayscale(100%) contrast(150%) brightness(120%) invert(85%)' },
    { name: 'Negative', value: 'invert(100%)' },
    { name: 'Duotone', value: 'grayscale(100%) sepia(100%) hue-rotate(200deg) saturate(150%)' },
    { name: 'Vaporwave', value: 'hue-rotate(250deg) saturate(160%) contrast(120%) brightness(105%)' },
    { name: 'Glitch', value: 'hue-rotate(360deg) saturate(150%) contrast(155%) brightness(95%)' },
  ];
  
  const handleFilterSelect = (filter: string) => {
    console.log("Applying filter:", filter);
    setSelectedFilter(filter);
    onFilterChange(filter);
  };
  
  const toggleMoreFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };
  
  return (
    <div className="space-y-2">
      <style jsx>{`
        .vignette-preview {
          position: relative;
        }
        .vignette-preview::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 3px;
          box-shadow: inset 0 0 20px 8px rgba(0, 0, 0, 0.7);
          pointer-events: none;
        }
      `}</style>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold tracking-tight">Filters</h3>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent hover:text-accent-foreground h-8 w-8"
            onClick={toggleMoreFilters}
          >
            {showMoreFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent hover:text-accent-foreground h-8 w-8"
            onClick={() => handleFilterSelect('none')}
            disabled={selectedFilter === 'none' || selectedFilter === null}
          >
            <Palette className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className={showMoreFilters ? "h-[280px] w-full" : "h-[100px] w-full"}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {basicFilterPresets.map((filter) => (
              <button
                key={filter.name}
                onClick={() => handleFilterSelect(filter.value)}
                className={`rounded p-1 text-xs ${
                  selectedFilter === filter.value 
                    ? 'ring-2 ring-primary ring-inset' 
                    : 'ring-1 ring-border hover:ring-primary/30'
                }`}
              >
                <div 
                  className={`h-16 w-full rounded overflow-hidden mb-1 bg-gradient-to-br from-primary/30 to-primary/70 ${filter.cssClass || ''}`}
                  style={{ filter: filter.value !== 'none' && filter.value !== 'vignette' ? filter.value : undefined }}
                />
                <span>{filter.name}</span>
              </button>
            ))}
          </div>
          
          {showMoreFilters && (
            <>
              <div className="flex justify-between items-center py-2 border-t border-b">
                <span className="text-xs font-medium">More Filters</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleMoreFilters}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {advancedFilterPresets.map((filter) => (
                  <button
                    key={filter.name}
                    onClick={() => handleFilterSelect(filter.value)}
                    className={`rounded p-1 text-xs ${
                      selectedFilter === filter.value 
                        ? 'ring-2 ring-primary ring-inset' 
                        : 'ring-1 ring-border hover:ring-primary/30'
                    }`}
                  >
                    <div 
                      className="h-16 w-full rounded overflow-hidden mb-1 bg-gradient-to-br from-primary/30 to-primary/70"
                      style={{ filter: filter.value }}
                    />
                    <span>{filter.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
