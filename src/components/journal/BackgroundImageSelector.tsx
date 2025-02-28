
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
  
  // Paper backgrounds with reliable URLs
  const paperBackgrounds = [
    { name: "White Paper", url: "https://i.imgur.com/RmSH8r0.jpg" },
    { name: "Kraft Paper", url: "https://i.imgur.com/0X1KZsB.jpg" },
    { name: "Textured Paper", url: "https://i.imgur.com/5ZKxlGI.jpg" },
    { name: "Lined Paper", url: "https://i.imgur.com/nY4y1I8.jpg" },
    { name: "Grid Paper", url: "https://i.imgur.com/gJ5mWgP.jpg" },
    { name: "Vintage Paper", url: "https://i.imgur.com/b7mwuAZ.jpg" },
    { name: "Craft Paper", url: "https://i.imgur.com/XrPQCaK.jpg" },
    { name: "Blue Paper", url: "https://i.imgur.com/ZzO8Urn.jpg" },
    { name: "Pink Paper", url: "https://i.imgur.com/fITZsWa.jpg" },
    { name: "Yellow Paper", url: "https://i.imgur.com/QiRmJnA.jpg" },
    { name: "Green Paper", url: "https://i.imgur.com/KFMGVWZ.jpg" },
    { name: "Old Parchment", url: "https://i.imgur.com/5ZKxlGI.jpg" },
  ];
  
  // Nature background images
  const natureBackgrounds = [
    { name: "Mountains", url: "https://i.imgur.com/RdXdbXB.jpg" },
    { name: "Beach", url: "https://i.imgur.com/JfQ9wjy.jpg" },
    { name: "Forest", url: "https://i.imgur.com/9uXw53C.jpg" },
    { name: "Sunset", url: "https://i.imgur.com/5PgkUWK.jpg" },
    { name: "Waterfall", url: "https://i.imgur.com/sRKKhwd.jpg" },
    { name: "Desert", url: "https://i.imgur.com/R8nmRj5.jpg" },
    { name: "Lake", url: "https://i.imgur.com/d3nT4ML.jpg" },
    { name: "Ocean", url: "https://i.imgur.com/GOGfX0k.jpg" },
    { name: "Meadow", url: "https://i.imgur.com/uAfL4ya.jpg" },
    { name: "Autumn", url: "https://i.imgur.com/RkRSdVl.jpg" },
    { name: "Winter", url: "https://i.imgur.com/DnHRjVs.jpg" },
    { name: "Spring", url: "https://i.imgur.com/KpwmpzB.jpg" },
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
    { name: "Light Blue", url: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" },
  ];

  // Patterns and textures with reliable URLs
  const patternBackgrounds = [
    { name: "Abstract", url: "https://i.imgur.com/tBqvnAB.jpg" },
    { name: "Geometric", url: "https://i.imgur.com/DQZYRsT.jpg" },
    { name: "Marble", url: "https://i.imgur.com/YHXbG5C.jpg" },
    { name: "Wood", url: "https://i.imgur.com/0yf1xJr.jpg" },
    { name: "Bokeh", url: "https://i.imgur.com/VGaIMu0.jpg" },
    { name: "Watercolor", url: "https://i.imgur.com/m1eBjLe.jpg" },
    { name: "Floral", url: "https://i.imgur.com/qJFr4Xe.jpg" },
    { name: "Stripes", url: "https://i.imgur.com/TkwUx8E.jpg" },
    { name: "Polka Dots", url: "https://i.imgur.com/MuVRpp3.jpg" },
    { name: "Canvas", url: "https://i.imgur.com/uBgmMxQ.jpg" },
    { name: "Checkerboard", url: "https://i.imgur.com/OaSnUPP.jpg" },
    { name: "Concrete", url: "https://i.imgur.com/gX2v8In.jpg" },
  ];
  
  const handleBackgroundSelect = (url: string) => {
    console.log("Selected background:", url);
    onBackgroundSelect(url);
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
                  type="button"
                >
                  <img 
                    src={bg.url} 
                    alt={bg.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image: ${bg.url}`);
                      e.currentTarget.src = 'https://placehold.co/600x400/png?text=Image+Error';
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
                  onClick={() => handleBackgroundSelect(bg.url)}
                  type="button"
                >
                  <img 
                    src={bg.url} 
                    alt={bg.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image: ${bg.url}`);
                      e.currentTarget.src = 'https://placehold.co/600x400/png?text=Image+Error';
                    }}
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
