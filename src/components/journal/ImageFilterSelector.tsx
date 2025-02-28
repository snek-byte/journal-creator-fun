
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface ImageFilterSelectorProps {
  onFilterChange: (filter: string) => void;
}

export function ImageFilterSelector({ onFilterChange }: ImageFilterSelectorProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  const filterPresets = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(70%)' },
    { name: 'Vintage', value: 'sepia(50%) contrast(90%) brightness(90%)' },
    { name: 'Warm', value: 'brightness(110%) saturate(120%) hue-rotate(10deg)' },
    { name: 'Cool', value: 'brightness(90%) saturate(80%) hue-rotate(-10deg)' },
    { name: 'Soft Light', value: 'brightness(105%) contrast(90%) saturate(110%)' },
    { name: 'Dramatic', value: 'contrast(120%) saturate(110%)' },
    { name: 'Dark Vignette', value: 'brightness(90%) contrast(110%) saturate(100%)' },
    { name: 'Faded', value: 'brightness(110%) contrast(85%) saturate(75%)' },
    { name: 'Matte', value: 'contrast(90%) saturate(90%) brightness(105%)' },
    { name: 'Pastel', value: 'brightness(115%) contrast(80%) saturate(80%)' },
  ];
  
  const handleFilterSelect = (filter: string) => {
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
                className="h-16 w-full rounded overflow-hidden mb-1 bg-gradient-to-br from-primary/20 to-primary/60"
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
