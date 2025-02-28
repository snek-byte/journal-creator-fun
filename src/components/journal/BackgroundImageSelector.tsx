
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
    { name: "White Paper", url: "https://placehold.co/800x1000/FFFFFF/FFFFFF" },
    { name: "Kraft Paper", url: "https://placehold.co/800x1000/D2B48C/D2B48C" },
    { name: "Textured Paper", url: "https://placehold.co/800x1000/F5F5F5/F5F5F5" },
    { name: "Lined Paper", url: "https://placehold.co/800x1000/FFFFFF/FFFFFF" },
    { name: "Grid Paper", url: "https://placehold.co/800x1000/FFFFFF/FFFFFF" },
    { name: "Vintage Paper", url: "https://placehold.co/800x1000/F8F0E3/F8F0E3" }
  ];
  
  // Nature background images
  const natureBackgrounds = [
    { name: "Mountains", url: "https://placehold.co/800x1000/2E8BC0/2E8BC0" },
    { name: "Beach", url: "https://placehold.co/800x1000/87CEEB/87CEEB" },
    { name: "Forest", url: "https://placehold.co/800x1000/228B22/228B22" },
    { name: "Sunset", url: "https://placehold.co/800x1000/FFA500/FFA500" }
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
    { name: "Abstract", url: "https://placehold.co/800x1000/E0E0E0/E0E0E0" },
    { name: "Geometric", url: "https://placehold.co/800x1000/D0D0D0/D0D0D0" },
    { name: "Marble", url: "https://placehold.co/800x1000/F0F0F0/F0F0F0" },
    { name: "Wood", url: "https://placehold.co/800x1000/CD853F/CD853F" }
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
                  <div 
                    className="w-full h-full"
                    style={{ 
                      backgroundColor: bg.url.includes('placehold.co') ? bg.url.split('/')[3] : 'white',
                      border: '1px solid #e0e0e0'
                    }}
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
                      backgroundColor: bg.url.includes('placehold.co') ? bg.url.split('/')[3] : 'lightblue',
                      border: '1px solid #e0e0e0'
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
                  <div 
                    className="w-full h-full"
                    style={{ 
                      backgroundColor: bg.url.includes('placehold.co') ? bg.url.split('/')[3] : 'gray',
                      border: '1px solid #e0e0e0'
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
