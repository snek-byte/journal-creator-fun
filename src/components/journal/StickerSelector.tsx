
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { StickerSource } from '@/types/journal';

interface StickerSelectorProps {
  onStickerSelect: (sticker: string) => void;
  onStickerResize?: (size: number) => void;
  currentStickerSize?: number;
  selectedStickerId?: string | null;
}

export function StickerSelector({ 
  onStickerSelect, 
  onStickerResize, 
  currentStickerSize = 100, 
  selectedStickerId 
}: StickerSelectorProps) {
  const [activeTab, setActiveTab] = useState<StickerSource>("local");
  const [size, setSize] = useState(currentStickerSize);
  
  // Local stickers (available in the public folder)
  const localStickers = [
    "/stickers/cake.svg",
    "/stickers/camera.svg",
    "/stickers/gift.svg",
    "/stickers/happy.svg",
    "/stickers/heart.svg",
    "/stickers/sad.svg",
    "/stickers/star.svg",
    "/stickers/thumbsup.svg",
  ];
  
  // Ensure sticker size updates when parent size changes
  useEffect(() => {
    console.log("StickerSelector: currentStickerSize prop changed to", currentStickerSize);
    setSize(currentStickerSize);
  }, [currentStickerSize]);
  
  console.log("StickerSelector: Current sticker size:", size);
  console.log("StickerSelector: Selected sticker ID:", selectedStickerId);
  
  // Total stickers available - useful for debugging
  useEffect(() => {
    const totalStickers = localStickers.length;
    console.log("StickerSelector: Total stickers available:", totalStickers);
  }, [localStickers]);
  
  // Handle sticker size change
  const handleSizeChange = (value: number[]) => {
    const newSize = value[0];
    setSize(newSize);
    
    if (onStickerResize) {
      onStickerResize(newSize);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-semibold tracking-tight">Stickers</h3>
        
        {/* Sticker Resize Slider */}
        <div className="flex items-center space-x-2 w-32">
          <Label htmlFor="sticker-size" className="text-xs">
            Size
          </Label>
          <Slider
            id="sticker-size"
            min={20}
            max={200}
            step={10}
            defaultValue={[size]}
            value={[size]}
            onValueChange={handleSizeChange}
            className={selectedStickerId ? "" : "opacity-50"}
            disabled={!selectedStickerId}
          />
          <span className="text-xs w-8">{size}px</span>
        </div>
      </div>
      
      <Tabs defaultValue="local" value={activeTab} onValueChange={(value) => setActiveTab(value as StickerSource)}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="local" className="text-[10px]">Basic</TabsTrigger>
          <TabsTrigger value="flaticon" className="text-[10px]">Flat</TabsTrigger>
          <TabsTrigger value="artistic" className="text-[10px]">Art</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[150px]">
          <TabsContent value="local" className="mt-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {localStickers.map((sticker, index) => (
                <button
                  key={index}
                  className="bg-white rounded-md p-2 hover:bg-gray-50 border border-gray-200"
                  onClick={() => onStickerSelect(sticker)}
                  type="button"
                >
                  <img src={sticker} alt="Sticker" className="w-full h-10 object-contain" />
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="flaticon" className="mt-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="h-14 bg-gray-100/50 rounded-md flex items-center justify-center"
                >
                  <span className="text-xs text-gray-400">Coming soon</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="artistic" className="mt-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="h-14 bg-gray-100/50 rounded-md flex items-center justify-center"
                >
                  <span className="text-xs text-gray-400">Coming soon</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
