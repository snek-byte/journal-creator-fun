
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from './ImageUploader';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface BackgroundImageSelectorProps {
  onBackgroundSelect: (imageUrl: string) => void;
}

export function BackgroundImageSelector({ onBackgroundSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState("papers");
  
  // Paper backgrounds with actual paper textures
  const paperBackgrounds = [
    { name: "Plain White Paper", url: "https://www.transparenttextures.com/patterns/white-paper.png" },
    { name: "Lined Paper", url: "https://www.transparenttextures.com/patterns/lined-paper.png" },
    { name: "Handmade Paper", url: "https://www.transparenttextures.com/patterns/handmade-paper.png" },
    { name: "Old Paper", url: "https://www.transparenttextures.com/patterns/old-paper.png" },
    { name: "Textured Paper", url: "https://www.transparenttextures.com/patterns/textured-paper.png" },
    { name: "Notebook Paper", url: "https://www.transparenttextures.com/patterns/notebook.png" },
    { name: "Rice Paper", url: "https://www.transparenttextures.com/patterns/rice-paper.png" },
    { name: "Cardboard", url: "https://www.transparenttextures.com/patterns/cardboard.png" },
    { name: "Sandpaper", url: "https://www.transparenttextures.com/patterns/sandpaper.png" }
  ];
  
  // Nature background images
  const natureBackgrounds = [
    { name: "Mountains", url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Sunset", url: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Waterfall", url: "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Desert", url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&h=1000&q=80" }
  ];
  
  // Background gradients (not for text)
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

  // Actual repeating patterns (not photos)
  const patternBackgrounds = [
    { name: "Subtle Dots", url: "https://www.transparenttextures.com/patterns/subtle-dots.png" },
    { name: "Grid", url: "https://www.transparenttextures.com/patterns/grid.png" },
    { name: "Checkered", url: "https://www.transparenttextures.com/patterns/checkered-pattern.png" },
    { name: "Brick Wall", url: "https://www.transparenttextures.com/patterns/brick-wall.png" },
    { name: "Stripes", url: "https://www.transparenttextures.com/patterns/stripes.png" },
    { name: "Hexagons", url: "https://www.transparenttextures.com/patterns/hexellence.png" },
    { name: "Diagonal Lines", url: "https://www.transparenttextures.com/patterns/diagonal-lines.png" },
    { name: "Carbon Fiber", url: "https://www.transparenttextures.com/patterns/carbon-fibre.png" },
    { name: "Cubes", url: "https://www.transparenttextures.com/patterns/3px-tile.png" },
    { name: "Waves", url: "https://www.transparenttextures.com/patterns/asfalt.png" },
    { name: "Diamonds", url: "https://www.transparenttextures.com/patterns/diamond-upholstery.png" },
    { name: "Wood", url: "https://www.transparenttextures.com/patterns/wood-pattern.png" }
  ];
  
  const handleBackgroundSelect = (url: string) => {
    console.log("Selected background:", url);
    onBackgroundSelect(url);
  };

  // Helper function to generate a full CSS background for papers and patterns
  const getPatternBackgroundStyle = (url: string) => {
    // For paper textures and patterns, we want to tile them as patterns
    return {
      backgroundImage: `url(${url})`,
      backgroundSize: 'auto',
      backgroundRepeat: 'repeat',
      backgroundColor: '#faf9f6', // Slight off-white for paper
    };
  };
  
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold tracking-tight">Background Images & Gradients</h3>
      
      <Tabs defaultValue="papers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-2">
          <TabsTrigger value="papers" className="text-[10px]">Papers</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="patterns" className="text-[10px]">Patterns</TabsTrigger>
          <TabsTrigger value="gradients" className="text-[10px]">Gradients</TabsTrigger>
          <TabsTrigger value="upload" className="text-[10px]">Upload</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[150px]">
          <TabsContent value="papers" className="mt-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {paperBackgrounds.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url)}
                  type="button"
                >
                  <div 
                    className="w-full h-full"
                    style={getPatternBackgroundStyle(bg.url)}
                    title={bg.name}
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
                >
                  <div 
                    className="w-full h-full"
                    style={{ 
                      backgroundImage: `url(${bg.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    title={bg.name}
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
                  onClick={() => handleBackgroundSelect(bg.url)}
                  type="button"
                >
                  <div 
                    className="w-full h-full"
                    style={getPatternBackgroundStyle(bg.url)}
                    title={bg.name}
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
                >
                  <div 
                    className="w-full h-full rounded" 
                    style={{ background: bg.url }}
                    title={bg.name}
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
        
        {/* Clear background button */}
        <div className="mt-2">
          <button
            className="w-full py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded"
            onClick={() => handleBackgroundSelect("")}
            type="button"
          >
            Clear Background
          </button>
        </div>
      </Tabs>
    </div>
  );
}
