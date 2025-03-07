import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from './image-uploader/ImageUploader';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface BackgroundImageSelectorProps {
  onBackgroundSelect: (imageUrl: string) => void;
}

export function BackgroundImageSelector({ onBackgroundSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState("papers");
  
  const paperBackgrounds = [
    { name: "Vintage Parchment", url: "https://www.transparenttextures.com/patterns/old-map.png", bgColor: '#e8dcb5' },
    { name: "Concrete Wall", url: "https://www.transparenttextures.com/patterns/concrete-wall.png", bgColor: '#d3d3d3' },
    { name: "Dark Leather", url: "https://www.transparenttextures.com/patterns/leather.png", bgColor: '#584235' },
    { name: "Blue Fabric", url: "https://www.transparenttextures.com/patterns/textured-stripes.png", bgColor: '#bacbdf' },
    { name: "Cork Board", url: "https://www.transparenttextures.com/patterns/cork-board.png", bgColor: '#d8bc8a' },
    { name: "Denim", url: "https://www.transparenttextures.com/patterns/denim.png", bgColor: '#4a6a8f' },
    { name: "Washed Silk", url: "https://www.transparenttextures.com/patterns/clean-gray-paper.png", bgColor: '#f1eee9' },
    { name: "Groovy Paper", url: "https://www.transparenttextures.com/patterns/groovepaper.png", bgColor: '#fffcf5' },
    
    { name: "Brushed Alu", url: "https://www.transparenttextures.com/patterns/brushed-alum.png", bgColor: '#b8b8b8' },
    { name: "Cross Stripes", url: "https://www.transparenttextures.com/patterns/cross-stripes.png", bgColor: '#e8e8e8' },
    { name: "Wave Pattern", url: "https://www.transparenttextures.com/patterns/wave-grid.png", bgColor: '#eaf7f7' },
    { name: "Noise Pattern", url: "https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png", bgColor: '#f5f5f5' },
    { name: "Carbon Fiber", url: "https://www.transparenttextures.com/patterns/carbon-fibre-v2.png", bgColor: '#282828' },
    { name: "Shattered Dark", url: "https://www.transparenttextures.com/patterns/shattered-dark.png", bgColor: '#3a3a3a' },
    { name: "Flower Pattern", url: "https://www.transparenttextures.com/patterns/flowers.png", bgColor: '#f8f3e9' },
    { name: "Gray Washed Wall", url: "https://www.transparenttextures.com/patterns/gray-sand.png", bgColor: '#d9d9d9' },
    
    { name: "Real Carbon", url: "https://www.transparenttextures.com/patterns/real-carbon-fibre.png", bgColor: '#2d2d2d' },
    { name: "Green Fibers", url: "https://www.transparenttextures.com/patterns/green-fibers.png", bgColor: '#e9f0e0' },
    { name: "Linen Dark", url: "https://www.transparenttextures.com/patterns/dark-linen.png", bgColor: '#2d2c2c' },
    { name: "Checkered Light", url: "https://www.transparenttextures.com/patterns/light-paper-fibers.png", bgColor: '#f0f0f0' },
    { name: "Pinstriped Suit", url: "https://www.transparenttextures.com/patterns/pinstriped-suit.png", bgColor: '#2b303b' },
    { name: "Cream Pixels", url: "https://www.transparenttextures.com/patterns/cream-pixels.png", bgColor: '#fffbea' },
    { name: "Silver Scales", url: "https://www.transparenttextures.com/patterns/silver-scales.png", bgColor: '#e0e0e0' },
    { name: "Fabric Plaid", url: "https://www.transparenttextures.com/patterns/fabric-plaid.png", bgColor: '#c3dbd4' },
    { name: "Batthern", url: "https://www.transparenttextures.com/patterns/batthern.png", bgColor: '#e1ddda' },
    { name: "Escheresque", url: "https://www.transparenttextures.com/patterns/escheresque.png", bgColor: '#d6d6d6' },
    { name: "Embossed Paper", url: "https://www.transparenttextures.com/patterns/45-degree-fabric-light.png", bgColor: '#f7f7f7' },
    { name: "Binding Dark", url: "https://www.transparenttextures.com/patterns/binding-dark.png", bgColor: '#2c2c2c' },
  ];
  
  const natureBackgrounds = [
    { name: "Mountains", url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Sunset", url: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Waterfall", url: "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Desert", url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&h=1000&q=80" }
  ];
  
  const gradientBackgrounds = [
    { name: "Sunset", url: "linear-gradient(to right, #f83600 0%, #f9d423 100%)" },
    { name: "Blue-Purple", url: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)" },
    { name: "Pink-Orange", url: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)" },
    { name: "Green-Blue", url: "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)" },
    { name: "Purple-Pink", url: "linear-gradient(to right, #8e2de2 0%, #4a00e0 100%)" },
    { name: "Yellow-Orange", url: "linear-gradient(to right, #f6d365 0%, #fda085 100%)" },
    { name: "Teal-Turquoise", url: "linear-gradient(to right, #0093E9 0%, #80D0C7 100%)" },
    { name: "Blue-Pink", url: "linear-gradient(to right, #2980B9 0%, #6DD5FA 50%, #FFFFFF 100%)" },
    { name: "Pink-Purple", url: "linear-gradient(to right, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)" },
    { name: "Orange-Red", url: "linear-gradient(to right, #ff512f 0%, #f09819 100%)" },
    { name: "Green-Yellow", url: "linear-gradient(to right, #C6FFDD 0%, #FBD786 50%, #f7797d 100%)" },
    { name: "Light Blue", url: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" }
  ];

  const patternBackgrounds = [
    { name: "Subtle Dots", url: "https://www.transparenttextures.com/patterns/subtle-dots.png", bgColor: '#e6e6e6' },
    { name: "Grid", url: "https://www.transparenttextures.com/patterns/grid.png", bgColor: '#e0e0e0' },
    { name: "Checkered", url: "https://www.transparenttextures.com/patterns/checkered-pattern.png", bgColor: '#e8e8e8' },
    { name: "Brick Wall", url: "https://www.transparenttextures.com/patterns/brick-wall.png", bgColor: '#d9d0c1' },
    { name: "Stripes", url: "https://www.transparenttextures.com/patterns/stripes.png", bgColor: '#e0e0e0' },
    { name: "Hexagons", url: "https://www.transparenttextures.com/patterns/hexellence.png", bgColor: '#e6e6e6' },
    { name: "Diagonal Lines", url: "https://www.transparenttextures.com/patterns/diagonal-lines.png", bgColor: '#e0e0e0' },
    { name: "Carbon Fiber", url: "https://www.transparenttextures.com/patterns/carbon-fibre.png", bgColor: '#282828' },
    { name: "Cubes", url: "https://www.transparenttextures.com/patterns/3px-tile.png", bgColor: '#e0e0e0' },
    { name: "Waves", url: "https://www.transparenttextures.com/patterns/asfalt.png", bgColor: '#d6d6d6' },
    { name: "Diamonds", url: "https://www.transparenttextures.com/patterns/diamond-upholstery.png", bgColor: '#e0e0e0' },
    { name: "Wood", url: "https://www.transparenttextures.com/patterns/wood-pattern.png", bgColor: '#d2bc9b' }
  ];
  
  const handleBackgroundSelect = (url: string, bgColor?: string) => {
    console.log("Selected background:", url);
    if (bgColor) {
      const combinedBackground = `url(${url}), ${bgColor}`;
      onBackgroundSelect(combinedBackground);
    } else {
      onBackgroundSelect(url);
    }
    toast.info(`Background ${url ? 'applied' : 'cleared'}`);
  };

  const getPatternBackgroundStyle = (url: string, bgColor: string = '#faf9f6') => {
    return {
      backgroundImage: `url(${url})`,
      backgroundSize: 'auto',
      backgroundRepeat: 'repeat',
      backgroundColor: bgColor,
      backgroundBlendMode: 'overlay',
    };
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold tracking-tight">Background Images & Patterns</h3>
      
      <Tabs defaultValue="papers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-2">
          <TabsTrigger value="papers" className="text-[10px]">Papers</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="patterns" className="text-[10px]">Patterns</TabsTrigger>
          <TabsTrigger value="gradients" className="text-[10px]">Gradients</TabsTrigger>
          <TabsTrigger value="upload" className="text-[10px]">Upload</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[220px]">
          <TabsContent value="papers" className="mt-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {paperBackgrounds.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url, bg.bgColor)}
                  type="button"
                  title={bg.name}
                >
                  <div 
                    className="w-full h-full"
                    style={getPatternBackgroundStyle(bg.url, bg.bgColor)}
                  />
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="nature" className="mt-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {natureBackgrounds.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url)}
                  type="button"
                  title={bg.name}
                >
                  <div 
                    className="w-full h-full"
                    style={{ 
                      backgroundImage: `url(${bg.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="patterns" className="mt-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {patternBackgrounds.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url, bg.bgColor)}
                  type="button"
                  title={bg.name}
                >
                  <div 
                    className="w-full h-full"
                    style={getPatternBackgroundStyle(bg.url, bg.bgColor)}
                  />
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="gradients" className="mt-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {gradientBackgrounds.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url)}
                  type="button"
                  title={bg.name}
                >
                  <div 
                    className="w-full h-full rounded" 
                    style={{ background: bg.url }}
                  />
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-0 space-y-4">
            <ImageUploader 
              onImageSelect={handleBackgroundSelect} 
            />
          </TabsContent>
        </ScrollArea>
        
        <Separator className="my-2" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBackgroundSelect("")}
          className="w-full mt-2 text-xs"
        >
          Clear Background
        </Button>
      </Tabs>
    </div>
  );
}
