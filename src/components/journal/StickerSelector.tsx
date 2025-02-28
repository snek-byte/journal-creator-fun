
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
  
  // Flat stickers - proper sticker designs
  const flatStickers = [
    "https://www.svgrepo.com/download/402818/birthday-cake.svg", // Birthday cake
    "https://www.svgrepo.com/download/402800/balloon.svg", // Balloon
    "https://www.svgrepo.com/download/508839/crown.svg", // Crown
    "https://www.svgrepo.com/download/477974/medal-color.svg", // Medal
    "https://www.svgrepo.com/download/533312/trophy.svg", // Trophy
    "https://www.svgrepo.com/download/532994/diamond.svg", // Diamond
    "https://www.svgrepo.com/download/535669/gift.svg", // Gift
    "https://www.svgrepo.com/download/376306/envelope-heart.svg", // Love letter
    "https://www.svgrepo.com/download/376771/heart-2.svg", // Heart
    "https://www.svgrepo.com/download/483325/firework.svg", // Firework
    "https://www.svgrepo.com/download/320637/confetti.svg", // Confetti
    "https://www.svgrepo.com/download/326611/skateboard.svg", // Skateboard
    "https://www.svgrepo.com/download/510187/camera.svg", // Camera
    "https://www.svgrepo.com/download/453629/music-note.svg", // Music note
    "https://www.svgrepo.com/download/522009/soccer-ball.svg", // Soccer ball
    "https://www.svgrepo.com/download/453634/palette.svg", // Art palette
    "https://www.svgrepo.com/download/376318/flowers.svg", // Flowers
    "https://www.svgrepo.com/download/513350/sun.svg", // Sun
    "https://www.svgrepo.com/download/511141/moon.svg", // Moon
    "https://www.svgrepo.com/download/376309/bug.svg", // Bug
    "https://www.svgrepo.com/download/511126/dinosaur.svg", // Dinosaur
    "https://www.svgrepo.com/download/511123/airplane.svg", // Airplane
    "https://www.svgrepo.com/download/521827/rocket.svg", // Rocket
    "https://www.svgrepo.com/download/511142/car.svg", // Car
  ];
  
  // Artistic stickers - decorative and artsy
  const artStickers = [
    "https://www.svgrepo.com/download/459921/flower-1.svg", // Flower
    "https://www.svgrepo.com/download/459928/flower-8.svg", // Flower variant
    "https://www.svgrepo.com/download/459901/butterfly-1.svg", // Butterfly
    "https://www.svgrepo.com/download/459903/butterfly-3.svg", // Butterfly variant
    "https://www.svgrepo.com/download/459885/bird-2.svg", // Bird
    "https://www.svgrepo.com/download/459887/bird-4.svg", // Bird variant
    "https://www.svgrepo.com/download/459953/leaf-3.svg", // Leaf
    "https://www.svgrepo.com/download/459955/leaf-5.svg", // Leaf variant
    "https://www.svgrepo.com/download/459944/insect-2.svg", // Insect
    "https://www.svgrepo.com/download/459937/heart-1.svg", // Heart art
    "https://www.svgrepo.com/download/460015/star-3.svg", // Star art
    "https://www.svgrepo.com/download/460027/tree-6.svg", // Tree
    "https://www.svgrepo.com/download/460026/tree-5.svg", // Tree variant
    "https://www.svgrepo.com/download/459967/mountain-3.svg", // Mountain
    "https://www.svgrepo.com/download/459961/moon-3.svg", // Moon
    "https://www.svgrepo.com/download/460022/sun-4.svg", // Sun
    "https://www.svgrepo.com/download/459957/leaf-7.svg", // Leaf ornament
    "https://www.svgrepo.com/download/459985/plant-3.svg", // Plant
    "https://www.svgrepo.com/download/459894/branch-5.svg", // Branch
    "https://www.svgrepo.com/download/459990/rainbow-1.svg", // Rainbow
    "https://www.svgrepo.com/download/459992/rainbow-3.svg", // Rainbow variant
    "https://www.svgrepo.com/download/459999/snowflake-5.svg", // Snowflake
    "https://www.svgrepo.com/download/459911/cloud-5.svg", // Cloud
    "https://www.svgrepo.com/download/459994/raindrop-4.svg" // Raindrop
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
      
      <Tabs defaultValue="local" value={activeTab} onValueChange={(value) => setActiveTab(value as StickerSource)}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="local" className="text-[10px]">Basic</TabsTrigger>
          <TabsTrigger value="flaticon" className="text-[10px]">Colorful</TabsTrigger>
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
                    alt="Colorful Sticker" 
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
