
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
  
  // Flat stickers - updated to use actual sticker images
  const flatStickers = [
    "https://www.svgrepo.com/download/397916/party-popper.svg", // Party
    "https://www.svgrepo.com/download/397744/star.svg", // Star
    "https://www.svgrepo.com/download/397713/red-heart.svg", // Heart
    "https://www.svgrepo.com/download/397911/calendar.svg", // Calendar
    "https://www.svgrepo.com/download/397797/hot-beverage.svg", // Coffee
    "https://www.svgrepo.com/download/397914/trophy.svg", // Trophy
    "https://www.svgrepo.com/download/397772/earth-globe-americas.svg", // Earth
    "https://www.svgrepo.com/download/397870/palm-tree.svg", // Palm tree
    "https://www.svgrepo.com/download/397882/potted-plant.svg", // Plant
    "https://www.svgrepo.com/download/397860/musical-note.svg", // Music
    "https://www.svgrepo.com/download/397730/camera.svg", // Camera
    "https://www.svgrepo.com/download/397720/closed-book.svg", // Book
    "https://www.svgrepo.com/download/397857/money-bag.svg", // Money bag
    "https://www.svgrepo.com/download/397768/dog-face.svg", // Dog
    "https://www.svgrepo.com/download/397766/cat-face.svg", // Cat
    "https://www.svgrepo.com/download/397807/birthday-cake.svg", // Birthday cake
    "https://www.svgrepo.com/download/397788/gift.svg", // Gift
    "https://www.svgrepo.com/download/397863/wrapped-present.svg", // Present
    "https://www.svgrepo.com/download/397745/crown.svg", // Crown
    "https://www.svgrepo.com/download/397883/rainbow.svg", // Rainbow
    "https://www.svgrepo.com/download/397874/peace-symbol.svg", // Peace
    "https://www.svgrepo.com/download/397841/gem-stone.svg", // Gemstone
    "https://www.svgrepo.com/download/397884/rocket.svg", // Rocket
    "https://www.svgrepo.com/download/397790/graduation-cap.svg" // Graduation cap
  ];
  
  // Artistic stickers - updated to use actual sticker-like images
  const artStickers = [
    "https://www.svgrepo.com/download/530461/rainbow.svg", // Rainbow
    "https://www.svgrepo.com/download/530436/sun.svg", // Sun
    "https://www.svgrepo.com/download/530312/cloud.svg", // Cloud
    "https://www.svgrepo.com/download/530345/heart.svg", // Heart
    "https://www.svgrepo.com/download/530358/leaf.svg", // Leaf
    "https://www.svgrepo.com/download/530339/fruit.svg", // Fruit
    "https://www.svgrepo.com/download/530272/butterfly.svg", // Butterfly
    "https://www.svgrepo.com/download/530337/flower.svg", // Flower
    "https://www.svgrepo.com/download/530265/bird.svg", // Bird
    "https://www.svgrepo.com/download/530377/mountains.svg", // Mountains
    "https://www.svgrepo.com/download/530243/bear.svg", // Bear
    "https://www.svgrepo.com/download/530431/star.svg", // Star
    "https://www.svgrepo.com/download/530387/music.svg", // Music note
    "https://www.svgrepo.com/download/530271/books.svg", // Books
    "https://www.svgrepo.com/download/530289/camera.svg", // Camera
    "https://www.svgrepo.com/download/530417/planet.svg", // Planet
    "https://www.svgrepo.com/download/530404/pencil.svg", // Pencil
    "https://www.svgrepo.com/download/530450/trophy.svg", // Trophy
    "https://www.svgrepo.com/download/530384/moon.svg", // Moon
    "https://www.svgrepo.com/download/530448/tree.svg", // Tree
    "https://www.svgrepo.com/download/530365/lock.svg", // Lock
    "https://www.svgrepo.com/download/530324/crown.svg", // Crown
    "https://www.svgrepo.com/download/530260/balloon.svg", // Balloon
    "https://www.svgrepo.com/download/530309/clock.svg" // Clock
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
          <TabsTrigger value="flaticon" className="text-[10px]">Emoji</TabsTrigger>
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
                    alt="Emoji Sticker" 
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
