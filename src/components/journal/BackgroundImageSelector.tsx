
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePlus, Upload } from "lucide-react";
import { ImageUploader } from './ImageUploader';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { gradients } from './config/editorConfig';

interface BackgroundImageSelectorProps {
  onBackgroundSelect: (imageUrl: string) => void;
}

export function BackgroundImageSelector({ onBackgroundSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState('unsplash');

  // Helper function to preview gradient
  const getGradientStyle = (gradientValue: string) => {
    return {
      backgroundImage: gradientValue,
      width: '100%',
      height: '80px',
      borderRadius: '4px',
    };
  };

  // Unsplash background images
  const unsplashImages = [
    {
      id: 'nature1',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      alt: 'Foggy mountains',
    },
    {
      id: 'nature2',
      url: 'https://images.unsplash.com/photo-1547471080-91f798e60c3e?auto=format&fit=crop&w=800&q=80',
      alt: 'Northern lights',
    },
    {
      id: 'nature3',
      url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=800&q=80',
      alt: 'Mountain peak',
    },
    {
      id: 'nature4',
      url: 'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=800&q=80',
      alt: 'Valley view',
    },
    {
      id: 'abstract1',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
      alt: 'Abstract gradient',
    },
    {
      id: 'abstract2',
      url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=800&q=80',
      alt: 'Colorful waves',
    },
    {
      id: 'abstract3',
      url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=800&q=80',
      alt: 'Abstract colors',
    },
    {
      id: 'abstract4',
      url: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=800&q=80',
      alt: 'Geometric pattern',
    },
    {
      id: 'minimal1',
      url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80',
      alt: 'Minimal white',
    },
    {
      id: 'minimal2',
      url: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&w=800&q=80',
      alt: 'Minimal texture',
    },
    {
      id: 'minimal3',
      url: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=800&q=80',
      alt: 'Minimal paper',
    },
    {
      id: 'minimal4',
      url: 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?auto=format&fit=crop&w=800&q=80',
      alt: 'Minimal marble',
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

  // Handle image upload completion
  const handleUploadComplete = (imageUrl: string) => {
    onBackgroundSelect(imageUrl);
    toast.success('Background image uploaded!');
  };

  // Set solid color background
  const handleColorSelect = (color: string) => {
    onBackgroundSelect(`linear-gradient(to bottom, ${color}, ${color})`);
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
                  onClick={() => onBackgroundSelect(gradient.value)}
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
              <ImageUploader onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
