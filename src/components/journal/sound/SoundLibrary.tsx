
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Plus } from 'lucide-react';
import { SoundPreview } from './SoundPreview';
import { publicDomainSounds, soundCategories } from '@/data/publicDomainSounds';
import type { AudioTrack } from '@/types/journal';

interface SoundLibraryProps {
  onSoundSelect: (sound: AudioTrack) => void;
}

export function SoundLibrary({ onSoundSelect }: SoundLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ambient");
  const [previewLoadError, setPreviewLoadError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {previewLoadError && (
        <div className="text-xs text-red-500 mt-1 p-2 bg-red-50 rounded-md">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          {previewLoadError}
        </div>
      )}
      
      <Tabs defaultValue="ambient" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-2 mb-2">
          {soundCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
          ))}
        </TabsList>
        
        <ScrollArea className="h-36 border rounded-md p-1">
          {publicDomainSounds
            .filter(sound => sound.category === selectedCategory)
            .map(sound => (
              <SoundPreview 
                key={sound.id} 
                sound={sound} 
                onSelect={onSoundSelect} 
              />
            ))}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
