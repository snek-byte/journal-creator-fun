
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from './ImageUploader';
import { ScrollArea } from "@/components/ui/scroll-area";

interface BackgroundImageSelectorProps {
  onBackgroundSelect: (imageUrl: string) => void;
}

export function BackgroundImageSelector({ onBackgroundSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState("papers");
  
  // Sample paper background images
  const paperBackgrounds = [
    { name: "White", url: "https://i.imgur.com/RmSH8r0.jpg" },
    { name: "Light Texture", url: "https://i.imgur.com/0X1KZsB.jpg" },
    { name: "Parchment", url: "https://i.imgur.com/5ZKxlGI.jpg" },
    { name: "Lined Paper", url: "https://i.imgur.com/nY4y1I8.jpg" },
    { name: "Grid Paper", url: "https://i.imgur.com/gJ5mWgP.jpg" },
    { name: "Dotted Paper", url: "https://i.imgur.com/vL2t7OL.jpg" },
    { name: "Vintage Paper", url: "https://i.imgur.com/b7mwuAZ.jpg" },
    { name: "Craft Paper", url: "https://i.imgur.com/XrPQCaK.jpg" },
    { name: "Blue Paper", url: "https://i.imgur.com/ZzO8Urn.jpg" },
    { name: "Pink Paper", url: "https://i.imgur.com/fITZsWa.jpg" },
    { name: "Yellow Paper", url: "https://i.imgur.com/QiRmJnA.jpg" },
    { name: "Green Paper", url: "https://i.imgur.com/KFMGVWZ.jpg" },
  ];
  
  // Nature background images
  const natureBackgrounds = [
    { name: "Mountains", url: "https://i.imgur.com/RdXdbXB.jpg" },
    { name: "Beach", url: "https://i.imgur.com/JfQ9wjy.jpg" },
    { name: "Forest", url: "https://i.imgur.com/9uXw53C.jpg" },
    { name: "Sunset", url: "https://i.imgur.com/5PgkUWK.jpg" },
    { name: "Waterfall", url: "https://i.imgur.com/sRKKhwd.jpg" },
    { name: "Desert", url: "https://i.imgur.com/R8nmRj5.jpg" },
  ];
  
  // Patterns and textures
  const patternBackgrounds = [
    { name: "Abstract 1", url: "https://i.imgur.com/tBqvnAB.jpg" },
    { name: "Geometric", url: "https://i.imgur.com/DQZYRsT.jpg" },
    { name: "Marble", url: "https://i.imgur.com/YHXbG5C.jpg" },
    { name: "Wood", url: "https://i.imgur.com/0yf1xJr.jpg" },
    { name: "Bokeh", url: "https://i.imgur.com/VGaIMu0.jpg" },
    { name: "Watercolor", url: "https://i.imgur.com/m1eBjLe.jpg" },
  ];
  
  const handleBackgroundSelect = (url: string) => {
    console.log("Selected background:", url);
    onBackgroundSelect(url);
  };
  
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold tracking-tight">Background Images</h3>
      
      <Tabs defaultValue="papers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="papers" className="text-[10px]">Papers</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="patterns" className="text-[10px]">Patterns</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[150px]">
          <TabsContent value="papers" className="mt-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {paperBackgrounds.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url)}
                >
                  <img 
                    src={bg.url} 
                    alt={bg.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
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
                >
                  <img 
                    src={bg.url} 
                    alt={bg.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
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
                >
                  <img 
                    src={bg.url} 
                    alt={bg.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-0 space-y-4">
            <ImageUploader 
              onImageUploaded={handleBackgroundSelect} 
              label="Upload Background" 
            />
          </TabsContent>
        </ScrollArea>
        
        {/* Clear background button */}
        <div className="mt-2">
          <button
            className="w-full py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded"
            onClick={() => handleBackgroundSelect("")}
          >
            Clear Background
          </button>
        </div>
      </Tabs>
    </div>
  );
}
