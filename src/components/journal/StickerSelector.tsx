
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
  
  // Flat stickers
  const flatStickers = [
    "https://cdn-icons-png.flaticon.com/512/6119/6119688.png", // Thumbs Up
    "https://cdn-icons-png.flaticon.com/512/1029/1029131.png", // Star
    "https://cdn-icons-png.flaticon.com/512/1933/1933691.png", // Heart
    "https://cdn-icons-png.flaticon.com/512/3209/3209265.png", // Calendar 
    "https://cdn-icons-png.flaticon.com/512/4392/4392398.png", // Coffee
    "https://cdn-icons-png.flaticon.com/512/7094/7094076.png", // Trophy
    "https://cdn-icons-png.flaticon.com/512/3331/3331906.png", // Earth
    "https://cdn-icons-png.flaticon.com/512/4436/4436481.png", // Palm tree
    "https://cdn-icons-png.flaticon.com/512/5229/5229335.png", // Plant
    "https://cdn-icons-png.flaticon.com/512/3208/3208700.png", // Music
    "https://cdn-icons-png.flaticon.com/512/4420/4420377.png", // Camera
    "https://cdn-icons-png.flaticon.com/512/3311/3311579.png"  // Book
  ];
  
  // Artistic stickers
  const artStickers = [
    "https://img.freepik.com/free-vector/watercolor-rainbow-isolated_1035-7943.jpg",
    "https://img.freepik.com/free-vector/hand-drawn-sun-collection_23-2148723449.jpg",
    "https://img.freepik.com/free-vector/watercolor-cloud-collection_23-2149247048.jpg",
    "https://img.freepik.com/free-vector/watercolor-heart-collection_23-2149281981.jpg",
    "https://img.freepik.com/free-vector/watercolor-leaf-collection_23-2149281973.jpg",
    "https://img.freepik.com/free-vector/cute-watercolor-fruit-collection_23-2148519698.jpg",
    "https://img.freepik.com/free-vector/watercolor-butterfly-collection_23-2149279939.jpg",
    "https://img.freepik.com/free-vector/watercolor-flower-collection_23-2148929755.jpg",
    "https://img.freepik.com/free-vector/watercolor-bird-collection_23-2148724231.jpg",
    "https://img.freepik.com/free-vector/watercolor-mountain-collection_23-2149284806.jpg",
    "https://img.freepik.com/free-vector/watercolor-animal-collection_23-2148967394.jpg",
    "https://img.freepik.com/free-vector/watercolor-hand-drawn-star-collection_23-2149313022.jpg"
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
    const totalStickers = localStickers.length + flatStickers.length + artStickers.length;
    console.log("StickerSelector: Total stickers available:", totalStickers);
  }, [localStickers, flatStickers, artStickers]);
  
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
              {flatStickers.map((sticker, index) => (
                <button
                  key={index}
                  className="bg-white rounded-md p-2 hover:bg-gray-50 border border-gray-200"
                  onClick={() => onStickerSelect(sticker)}
                  type="button"
                >
                  <img 
                    src={sticker} 
                    alt="Flat Sticker" 
                    className="w-full h-10 object-contain"
                    onError={(e) => {
                      console.error(`Failed to load sticker: ${sticker}`);
                      e.currentTarget.src = '/stickers/star.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="artistic" className="mt-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {artStickers.map((sticker, index) => (
                <button
                  key={index}
                  className="bg-white rounded-md p-2 hover:bg-gray-50 border border-gray-200"
                  onClick={() => onStickerSelect(sticker)}
                  type="button"
                >
                  <img 
                    src={sticker}
                    alt="Art Sticker" 
                    className="w-full h-10 object-contain"
                    onError={(e) => {
                      console.error(`Failed to load sticker: ${sticker}`);
                      e.currentTarget.src = '/stickers/star.svg';
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
