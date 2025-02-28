
import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface ImageFilterSelectorProps {
  onFilterChange: (filter: string) => void;
  currentFilter?: string;
}

export function ImageFilterSelector({ onFilterChange, currentFilter = 'none' }: ImageFilterSelectorProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(currentFilter);
  
  // Update local state when the prop changes
  useEffect(() => {
    setSelectedFilter(currentFilter);
  }, [currentFilter]);
  
  // Enhanced filter presets with stronger effects for better visibility
  const filterPresets = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(80%)' },
    { name: 'Vintage', value: 'sepia(60%) contrast(110%) brightness(90%)' },
    { name: 'Warm', value: 'brightness(115%) saturate(130%) hue-rotate(10deg)' },
    { name: 'Cool', value: 'brightness(95%) saturate(90%) hue-rotate(-15deg)' },
    { name: 'Soft Light', value: 'brightness(110%) contrast(95%) saturate(120%)' },
    { name: 'Dramatic', value: 'contrast(130%) saturate(120%)' },
    { name: 'Dark Vignette', value: 'brightness(90%) contrast(120%) saturate(110%)' },
    { name: 'Faded', value: 'brightness(115%) contrast(90%) saturate(85%)' },
    { name: 'Matte', value: 'contrast(95%) saturate(95%) brightness(110%)' },
    { name: 'Pastel', value: 'brightness(120%) contrast(85%) saturate(85%)' },
  ];
  
  const handleFilterSelect = (filter: string) => {
    console.log("Applying filter:", filter);
    setSelectedFilter(filter);
    onFilterChange(filter);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold tracking-tight">Filters</h3>
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
      
      <ScrollArea className="h-[100px] w-full">
        <div className="grid grid-cols-3 gap-2">
          {filterPresets.map((filter) => (
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
                style={{ filter: filter.value !== 'none' ? filter.value : undefined }}
              />
              <span>{filter.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
