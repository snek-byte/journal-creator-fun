
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageFilterSelectorProps {
  onFilterSelect: (filter: string) => void;
  currentFilter: string;
}

type FilterOption = {
  id: string;
  name: string;
  preview: string;
  description: string;
};

export function ImageFilterSelector({ onFilterSelect, currentFilter }: ImageFilterSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const filterCategories = {
    basic: [
      { 
        id: 'none', 
        name: 'None', 
        preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=200&q=80', 
        description: 'No filter applied'
      },
      { 
        id: 'sepia', 
        name: 'Sepia', 
        preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=200&q=80&sepia=80', 
        description: 'Warm brown tone'
      },
      { 
        id: 'grayscale', 
        name: 'Grayscale', 
        preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=200&q=80&grayscale=1', 
        description: 'Black and white'
      },
      { 
        id: 'saturate', 
        name: 'Vibrant', 
        preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=200&q=80&saturate=2', 
        description: 'Increased color saturation'
      }
    ],
    mood: [
      { 
        id: 'warm', 
        name: 'Warm', 
        preview: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=200&q=80&saturate=1.2&brightness=1.1', 
        description: 'Warm, cozy feeling'
      },
      { 
        id: 'cool', 
        name: 'Cool', 
        preview: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&w=200&q=80&saturate=0.8&brightness=1.05', 
        description: 'Cool, calm tones'
      },
      { 
        id: 'dramatic', 
        name: 'Dramatic', 
        preview: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80&contrast=1.3&brightness=0.9', 
        description: 'High contrast, dramatic look'
      },
      { 
        id: 'vintage', 
        name: 'Vintage', 
        preview: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80&sepia=50&contrast=1.1&brightness=0.9', 
        description: 'Classic vintage style'
      }
    ],
    creative: [
      { 
        id: 'duotone', 
        name: 'Duotone', 
        preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=200&q=80&duotone=0066ff,ff0066', 
        description: 'Two-color effect'
      },
      { 
        id: 'invert', 
        name: 'Negative', 
        preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=200&q=80&invert=1', 
        description: 'Photo negative effect'
      },
      { 
        id: 'blur', 
        name: 'Soft Focus', 
        preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=200&q=80&blur=2', 
        description: 'Soft, dreamy effect'
      },
      { 
        id: 'pixelate', 
        name: 'Pixelate', 
        preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=200&q=80&pixelate=5', 
        description: 'Retro pixelated look'
      }
    ]
  };

  const handleFilterSelect = (filter: FilterOption) => {
    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      onFilterSelect(filter.id);
      setIsLoading(false);
      toast.success(`${filter.name} filter applied`);
    }, 300);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent hover:text-accent-foreground relative"
          title="Apply image filter"
        >
          <ImageIcon className="w-4 h-4" />
          {currentFilter !== 'none' && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose an Image Filter</DialogTitle>
          <DialogDescription>
            Apply a filter effect to your journal page
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="mood">Mood</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <ScrollArea className="h-[320px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {filterCategories.basic.map((filter) => (
                  <FilterOption 
                    key={filter.id}
                    filter={filter}
                    isActive={currentFilter === filter.id}
                    onSelect={() => handleFilterSelect(filter)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="mood">
            <ScrollArea className="h-[320px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {filterCategories.mood.map((filter) => (
                  <FilterOption 
                    key={filter.id}
                    filter={filter}
                    isActive={currentFilter === filter.id}
                    onSelect={() => handleFilterSelect(filter)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="creative">
            <ScrollArea className="h-[320px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {filterCategories.creative.map((filter) => (
                  <FilterOption 
                    key={filter.id}
                    filter={filter}
                    isActive={currentFilter === filter.id}
                    onSelect={() => handleFilterSelect(filter)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface FilterOptionProps {
  filter: FilterOption;
  isActive: boolean;
  onSelect: () => void;
  isLoading: boolean;
}

function FilterOption({ filter, isActive, onSelect, isLoading }: FilterOptionProps) {
  return (
    <div 
      className={`
        flex flex-col rounded-md overflow-hidden border cursor-pointer
        transition-all hover:border-primary
        ${isActive ? 'ring-2 ring-primary border-primary' : ''}
      `}
      onClick={onSelect}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
        <img
          src={filter.preview}
          alt={filter.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-sm font-medium">{filter.name}</h3>
        <p className="text-xs text-muted-foreground">{filter.description}</p>
      </div>
    </div>
  );
}
