
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from './ImageUploader';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BackgroundImageSelectorProps {
  onBackgroundSelect: (imageUrl: string) => void;
}

export function BackgroundImageSelector({ onBackgroundSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState("papers");
  
  // Paper backgrounds with reliable URLs
  const paperBackgrounds = [
    { name: "White Paper", url: "https://images.unsplash.com/photo-1587614298172-7d8d053ac252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Kraft Paper", url: "https://images.unsplash.com/photo-1541512348353-d5b975501d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Textured Paper", url: "https://images.unsplash.com/photo-1553773077-91673524aafa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Lined Paper", url: "https://images.unsplash.com/photo-1550985543-f1ea83b216fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Grid Paper", url: "https://images.unsplash.com/photo-1604335398333-51317b5e079f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Vintage Paper", url: "https://images.unsplash.com/photo-1595079356063-3f4bb547de47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" }
  ];
  
  // Nature background images
  const natureBackgrounds = [
    { name: "Mountains", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Sunset", url: "https://images.unsplash.com/photo-1600073955016-50ddf9f14f3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" }
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
    { name: "Abstract", url: "https://images.unsplash.com/photo-1618759287629-ca51c8da5856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Geometric", url: "https://images.unsplash.com/photo-1557683311-eac922347aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Marble", url: "https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" },
    { name: "Wood", url: "https://images.unsplash.com/photo-1566312262854-06079e1a1e6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" }
  ];
  
  const handleBackgroundSelect = (url: string) => {
    console.log("Selected background:", url);
    
    // Add a random parameter to force re-render of images
    if (url && !url.includes('linear-gradient')) {
      const randomParam = `?random=${Math.random()}`;
      url = url + randomParam;
    }
    
    onBackgroundSelect(url);
    
    // Show a toast notification for confirmation
    if (url) {
      toast.success("Background applied successfully!");
    } else {
      toast.info("Background removed");
    }
  };
  
  // Function to check image URLs are accessible
  const checkImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };
  
  // Pre-load images to check availability
  useState(() => {
    const allImageUrls = [
      ...paperBackgrounds,
      ...natureBackgrounds,
      ...patternBackgrounds
    ].map(bg => bg.url);
    
    allImageUrls.forEach(async (url) => {
      const isValid = await checkImageUrl(url);
      if (!isValid) {
        console.warn(`Image might be inaccessible: ${url}`);
      }
    });
  });
  
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
