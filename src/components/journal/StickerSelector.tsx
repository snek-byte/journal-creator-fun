
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
  const [activeTab, setActiveTab] = useState<StickerSource>("decorative");
  const [size, setSize] = useState(currentStickerSize);
  
  // Decorative stickers - actual sticker designs
  const decorativeStickers = [
    "https://cdn-icons-png.flaticon.com/512/5449/5449904.png", // Star sparkle
    "https://cdn-icons-png.flaticon.com/512/5449/5449970.png", // Cute heart
    "https://cdn-icons-png.flaticon.com/512/5449/5449955.png", // Heart ribbon
    "https://cdn-icons-png.flaticon.com/512/5449/5449995.png", // Love sticker
    "https://cdn-icons-png.flaticon.com/512/5449/5449927.png", // Cloud text bubble
    "https://cdn-icons-png.flaticon.com/512/5449/5449899.png", // Star flash
    "https://cdn-icons-png.flaticon.com/512/5449/5449922.png", // Lips kiss
    "https://cdn-icons-png.flaticon.com/512/5449/5449984.png", // 100% sticker
    "https://cdn-icons-png.flaticon.com/512/5449/5449938.png", // Fire flame
    "https://cdn-icons-png.flaticon.com/512/5449/5449932.png", // Boom explosion
    "https://cdn-icons-png.flaticon.com/512/5449/5449939.png", // Diamond gem
    "https://cdn-icons-png.flaticon.com/512/5449/5449913.png", // Crown royal
  ];
  
  // Nature stickers
  const natureStickers = [
    "https://cdn-icons-png.flaticon.com/512/6485/6485127.png", // Sun
    "https://cdn-icons-png.flaticon.com/512/6485/6485130.png", // Cloud
    "https://cdn-icons-png.flaticon.com/512/6485/6485135.png", // Moon
    "https://cdn-icons-png.flaticon.com/512/6485/6485136.png", // Rainbow
    "https://cdn-icons-png.flaticon.com/512/6485/6485149.png", // Flower
    "https://cdn-icons-png.flaticon.com/512/6485/6485178.png", // Cactus
    "https://cdn-icons-png.flaticon.com/512/6485/6485165.png", // Plant
    "https://cdn-icons-png.flaticon.com/512/6485/6485172.png", // Tree
    "https://cdn-icons-png.flaticon.com/512/6485/6485153.png", // Mountain
    "https://cdn-icons-png.flaticon.com/512/6485/6485158.png", // Wave
    "https://cdn-icons-png.flaticon.com/512/6485/6485168.png", // Planet
    "https://cdn-icons-png.flaticon.com/512/6485/6485189.png", // Leaf
  ];
  
  // Food stickers
  const foodStickers = [
    "https://cdn-icons-png.flaticon.com/512/6268/6268389.png", // Pizza
    "https://cdn-icons-png.flaticon.com/512/6268/6268478.png", // Burger
    "https://cdn-icons-png.flaticon.com/512/6268/6268419.png", // Donut
    "https://cdn-icons-png.flaticon.com/512/6268/6268385.png", // Ice cream
    "https://cdn-icons-png.flaticon.com/512/6268/6268401.png", // Cake
    "https://cdn-icons-png.flaticon.com/512/6268/6268370.png", // Coffee
    "https://cdn-icons-png.flaticon.com/512/6268/6268426.png", // Drink
    "https://cdn-icons-png.flaticon.com/512/6268/6268395.png", // Sushi
    "https://cdn-icons-png.flaticon.com/512/6268/6268404.png", // Taco
    "https://cdn-icons-png.flaticon.com/512/6268/6268330.png", // Salad
    "https://cdn-icons-png.flaticon.com/512/6268/6268495.png", // Pasta
    "https://cdn-icons-png.flaticon.com/512/6268/6268486.png", // Strawberry
  ];
  
  // Ensure sticker size updates when parent size changes
  useEffect(() => {
    console.log("StickerSelector: currentStickerSize prop changed to", currentStickerSize);
    setSize(currentStickerSize);
  }, [currentStickerSize]);
  
  console.log("StickerSelector: Current sticker size:", size);
  console.log("StickerSelector: Selected sticker ID:", selectedStickerId);
  
  // Handle sticker size change
  const handleSizeChange = (value: number[]) => {
    console.log("Slider changed to:", value[0]);
    const newSize = value[0];
    setSize(newSize);
    
    if (onStickerResize) {
      console.log("Calling onStickerResize with size:", newSize);
      onStickerResize(newSize);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-semibold tracking-tight">Stickers</h3>
        
        {/* Sticker Resize Slider - Always enabled */}
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
          />
          <span className="text-xs w-8">{size}px</span>
        </div>
      </div>
      
      <Tabs defaultValue="decorative" value={activeTab} onValueChange={(value) => setActiveTab(value as StickerSource)}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="decorative" className="text-[10px]">Decorative</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="food" className="text-[10px]">Food</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[150px]">
          <TabsContent value="decorative" className="mt-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {decorativeStickers.map((sticker, index) => (
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
          
          <TabsContent value="nature" className="mt-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {natureStickers.map((sticker, index) => (
                <button
                  key={index}
                  className="bg-white rounded-md p-2 hover:bg-gray-50 border border-gray-200"
                  onClick={() => onStickerSelect(sticker)}
                  type="button"
                >
                  <img 
                    src={sticker} 
                    alt="Nature Sticker" 
                    className="w-full h-10 object-contain"
                    onError={(e) => {
                      console.error(`Failed to load sticker: ${sticker}`);
                      e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/5449/5449904.png';
                    }}
                  />
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="food" className="mt-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {foodStickers.map((sticker, index) => (
                <button
                  key={index}
                  className="bg-white rounded-md p-2 hover:bg-gray-50 border border-gray-200"
                  onClick={() => onStickerSelect(sticker)}
                  type="button"
                >
                  <img 
                    src={sticker}
                    alt="Food Sticker" 
                    className="w-full h-10 object-contain"
                    onError={(e) => {
                      console.error(`Failed to load sticker: ${sticker}`);
                      e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/5449/5449904.png';
                    }}
                  />
                </button>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
