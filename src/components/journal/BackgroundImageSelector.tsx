
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from './ImageUploader';
import { ScrollArea } from "@/components/ui/scroll-area";

interface BackgroundImageSelectorProps {
  onBackgroundSelect: (imageUrl: string) => void;
}

export function BackgroundImageSelector({ onBackgroundSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState("papers");
  
  // Paper backgrounds with reliable URLs
  const paperBackgrounds = [
    { name: "White Paper", url: "https://images.unsplash.com/photo-1517816428104-797678c7cf0c?q=80&w=1000&auto=format&fit=crop" },
    { name: "Kraft Paper", url: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=1000&auto=format&fit=crop" },
    { name: "Textured Paper", url: "https://images.unsplash.com/photo-1587653263995-422546a7a569?q=80&w=1000&auto=format&fit=crop" },
    { name: "Lined Paper", url: "https://images.unsplash.com/photo-1544960728-4feba2e334e4?q=80&w=1000&auto=format&fit=crop" },
    { name: "Old Paper", url: "https://images.unsplash.com/photo-1518281361980-b26bfd556770?q=80&w=1000&auto=format&fit=crop" },
    { name: "Crumpled Paper", url: "https://images.unsplash.com/photo-1582130739907-724b6e2f1d2a?q=80&w=1000&auto=format&fit=crop" },
    { name: "Grid Paper", url: "https://images.unsplash.com/photo-1545457060-ee836c7c0102?q=80&w=1000&auto=format&fit=crop" },
    { name: "Papyrus", url: "https://images.unsplash.com/photo-1595062272143-4a3e756069a5?q=80&w=1000&auto=format&fit=crop" },
    { name: "Vintage Paper", url: "https://images.unsplash.com/photo-1604618355917-9d6deb7754ec?q=80&w=1000&auto=format&fit=crop" },
    { name: "Blueprint Paper", url: "https://images.unsplash.com/photo-1574285013029-29296a71930e?q=80&w=1000&auto=format&fit=crop" },
    { name: "Yellow Paper", url: "https://images.unsplash.com/photo-1607688719755-7a2d77c465af?q=80&w=1000&auto=format&fit=crop" },
    { name: "Handmade Paper", url: "https://images.unsplash.com/photo-1578070181910-f1e514afdd08?q=80&w=1000&auto=format&fit=crop" },
  ];
  
  // Nature backgrounds with reliable URLs
  const natureBackgrounds = [
    { name: "Mountains", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop" },
    { name: "Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop" },
    { name: "Forest", url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop" },
    { name: "Sunset", url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=1000&auto=format&fit=crop" },
    { name: "Waterfall", url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop" },
    { name: "Desert", url: "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=1000&auto=format&fit=crop" },
    { name: "Meadow", url: "https://images.unsplash.com/photo-1471036798618-4e71704d9e5d?q=80&w=1000&auto=format&fit=crop" },
    { name: "Lake", url: "https://images.unsplash.com/photo-1619545208928-69f07bb7fc12?q=80&w=1000&auto=format&fit=crop" },
    { name: "Snow", url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1000&auto=format&fit=crop" },
    { name: "Spring", url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1000&auto=format&fit=crop" },
    { name: "Autumn", url: "https://images.unsplash.com/photo-1507371341162-763b5e419408?q=80&w=1000&auto=format&fit=crop" },
    { name: "Aurora", url: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=1000&auto=format&fit=crop" },
  ];
  
  // Patterns and textures with reliable URLs
  const patternBackgrounds = [
    { name: "Abstract", url: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=1000&auto=format&fit=crop" },
    { name: "Geometric", url: "https://images.unsplash.com/photo-1557683304-673a23048d34?q=80&w=1000&auto=format&fit=crop" },
    { name: "Marble", url: "https://images.unsplash.com/photo-1563543733855-2062a3e7f9bd?q=80&w=1000&auto=format&fit=crop" },
    { name: "Wood", url: "https://images.unsplash.com/photo-1538307602205-80b5c2ff26ec?q=80&w=1000&auto=format&fit=crop" },
    { name: "Bokeh", url: "https://images.unsplash.com/photo-1626544827763-d516dce702e4?q=80&w=1000&auto=format&fit=crop" },
    { name: "Watercolor", url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1000&auto=format&fit=crop" },
    { name: "Floral", url: "https://images.unsplash.com/photo-1553949345-eb786bb3f7ba?q=80&w=1000&auto=format&fit=crop" },
    { name: "Denim", url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop" },
    { name: "Concrete", url: "https://images.unsplash.com/photo-1550305080-4e029753abcf?q=80&w=1000&auto=format&fit=crop" },
    { name: "Brick", url: "https://images.unsplash.com/photo-1568059151110-454920fe5a42?q=80&w=1000&auto=format&fit=crop" },
    { name: "Gradient", url: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=1000&auto=format&fit=crop" },
    { name: "Leather", url: "https://images.unsplash.com/photo-1606820854416-439b3305ff39?q=80&w=1000&auto=format&fit=crop" },
  ];
  
  const handleBackgroundSelect = (url: string) => {
    console.log("Selected background:", url);
    onBackgroundSelect(url);
  };
  
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold tracking-tight">Background Images</h3>
      
      <Tabs defaultValue="papers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="papers" className="text-[10px]">Papers</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="patterns" className="text-[10px]">Patterns</TabsTrigger>
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
              onImageSelect={handleBackgroundSelect} 
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
