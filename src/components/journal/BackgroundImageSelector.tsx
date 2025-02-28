
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePlus, Upload, RefreshCw } from "lucide-react";
import { ImageUploader } from './ImageUploader';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { gradients } from './config/editorConfig';

interface BackgroundImageSelectorProps {
  onBackgroundSelect: (imageUrl: string) => void;
}

export function BackgroundImageSelector({ onBackgroundSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState('unsplash');
  const [refreshKey, setRefreshKey] = useState(0);

  // Helper function to preview gradient
  const getGradientStyle = (gradientValue: string) => {
    return {
      backgroundImage: gradientValue,
      width: '100%',
      height: '80px',
      borderRadius: '4px',
    };
  };

  // Function to refresh Unsplash images
  const refreshUnsplashImages = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Unsplash images refreshed');
  };

  // Unsplash background images with timestamp to force refresh
  const unsplashImages = [
    {
      id: 'nature1',
      url: `https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Foggy mountains',
    },
    {
      id: 'nature2',
      url: `https://images.unsplash.com/photo-1547471080-91f798e60c3e?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Northern lights',
    },
    {
      id: 'nature3',
      url: `https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Mountain peak',
    },
    {
      id: 'nature4',
      url: `https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Valley view',
    },
    {
      id: 'abstract1',
      url: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Abstract gradient',
    },
    {
      id: 'abstract2',
      url: `https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Colorful waves',
    },
    {
      id: 'abstract3',
      url: `https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Abstract colors',
    },
    {
      id: 'abstract4',
      url: `https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Geometric pattern',
    },
    {
      id: 'minimal1',
      url: `https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Minimal white',
    },
    {
      id: 'minimal2',
      url: `https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Minimal texture',
    },
    {
      id: 'minimal3',
      url: `https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Minimal paper',
    },
    {
      id: 'minimal4',
      url: `https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Minimal marble',
    },
    // Alternative images in case of issues with the ones above
    {
      id: 'alt1',
      url: `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Woman with laptop',
    },
    {
      id: 'alt2',
      url: `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Laptop computer',
    },
    {
      id: 'alt3',
      url: `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80&t=${refreshKey}`,
      alt: 'Circuit board',
    },
  ];

  // Solid colors backgrounds
  const solidColors = [
    { id: 'white', color: '#ffffff', name: 'White' },
    { id: 'light', color: '#f8f9fa', name: 'Light' },
    { id: 'cream', color: '#f5f5dc', name: 'Cream' },
    { id: 'gray', color: '#e9ecef', name: 'Gray' },
    { id: 'blue', color: '#e6f4ff', name: 'Blue' },
    { id: 'green', color: '#e6ffea', name: 'Green' },
    { id: 'yellow', color: '#fffde6', name: 'Yellow' },
    { id: 'pink', color: '#ffe6f2', name: 'Pink' },
    { id: 'lavender', color: '#f2e6ff', name: 'Lavender' },
    { id: 'mint', color: '#e6fff4', name: 'Mint' },
    { id: 'peach', color: '#ffe6e6', name: 'Peach' },
    { id: 'darkmode', color: '#1c1c1c', name: 'Dark Mode' },
  ];

  // Handle image selection from the ImageUploader
  const handleImageSelect = (url: string) => {
    onBackgroundSelect(url);
    toast.success('Background image uploaded!');
  };

  // Set solid color background
  const handleColorSelect = (color: string) => {
    onBackgroundSelect(`linear-gradient(to bottom, ${color}, ${color})`);
  };

  // Apply gradient directly when selected
  const handleGradientSelect = (gradient: string) => {
    console.log("Applying gradient:", gradient);
    onBackgroundSelect(gradient);
    toast.success('Gradient applied!');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold tracking-tight">Background</h3>
      
      <Tabs defaultValue="unsplash" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="unsplash" className="text-xs">Unsplash</TabsTrigger>
          <TabsTrigger value="gradients" className="text-xs">Gradients</TabsTrigger>
          <TabsTrigger value="upload" className="text-xs">Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unsplash" className="mt-0">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-muted-foreground">Random Images</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshUnsplashImages} 
              className="h-8 px-2"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
          </div>
          
          <ScrollArea className="h-[250px]">
            <div className="grid grid-cols-2 gap-2">
              {unsplashImages.map((image) => (
                <button
                  key={image.id}
                  className="relative overflow-hidden rounded-md border border-input hover:border-primary transition-colors"
                  onClick={() => onBackgroundSelect(image.url)}
                  title={image.alt}
                >
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="aspect-[4/3] object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="gradients" className="mt-0 space-y-4">
          <ScrollArea className="h-[250px]">
            <div className="grid grid-cols-2 gap-2">
              {gradients.map((gradient) => (
                <button
                  key={gradient.label}
                  className="overflow-hidden rounded-md border border-input hover:border-primary transition-colors"
                  onClick={() => handleGradientSelect(gradient.value)}
                  title={gradient.label}
                >
                  <div style={getGradientStyle(gradient.value)} />
                </button>
              ))}
              
              <h4 className="col-span-2 mt-4 mb-2 text-xs font-medium text-muted-foreground">Solid Colors</h4>
              
              {solidColors.map((color) => (
                <button
                  key={color.id}
                  className="overflow-hidden rounded-md border border-input hover:border-primary transition-colors"
                  onClick={() => handleColorSelect(color.color)}
                  title={color.name}
                >
                  <div 
                    style={{ 
                      backgroundColor: color.color,
                      width: '100%',
                      height: '40px',
                      borderRadius: '4px',
                    }} 
                  />
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="upload" className="mt-0">
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <ImageUploader onImageSelect={handleImageSelect} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
