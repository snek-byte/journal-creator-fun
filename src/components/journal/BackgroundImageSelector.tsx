
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush } from "lucide-react";
import { useJournalStore } from '@/store/journalStore';

interface BackgroundImageSelectorProps {
  onImageSelect: (url: string) => void;
}

export function BackgroundImageSelector({ onImageSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState('gradient');
  const { setBackgroundImage, setGradient } = useJournalStore();

  // Predefined gradients
  const gradients = [
    { name: 'Sunset', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    { name: 'Ocean', value: 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)' },
    { name: 'Lavender', value: 'linear-gradient(102.3deg, rgba(147,39,143,1) 5.9%, rgba(234,172,232,1) 64%, rgba(246,219,245,1) 89%)' },
    { name: 'Lemon', value: 'linear-gradient(184.1deg, rgba(249,255,182,1) 44.7%, rgba(226,255,172,1) 67.2%)' },
    { name: 'Watermelon', value: 'linear-gradient(180deg, rgb(254,100,121) 0%, rgb(251,221,186) 100%)' },
    { name: 'Autumn', value: 'linear-gradient(111.4deg, rgba(238,113,113,1) 1%, rgba(246,215,148,1) 58%)' },
    { name: 'Cool Blue', value: 'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)' },
    { name: 'Vintage', value: 'linear-gradient(to right, #d7d2cc 0%, #304352 100%)' },
    { name: 'Warm Rose', value: 'linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)' },
    { name: 'Mint Sky', value: 'linear-gradient(60deg, #abecd6 0%, #fbed96 100%)' },
    { name: 'Soft Peach', value: 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)' },
    { name: 'Clean', value: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)' }
  ];

  // Predefined background images
  const backgroundImages = [
    { name: 'Paper Texture', url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Marble', url: 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Wooden', url: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Nature', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Ocean', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Clouds', url: 'https://images.unsplash.com/photo-1536514072410-5019a3c69182?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Night Sky', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop' }
  ];

  // Handle gradient selection
  const handleGradientSelect = (gradient: string) => {
    setGradient(gradient);
    setBackgroundImage(''); // Clear any existing background image
    onImageSelect('');
  };

  // Handle background image selection
  const handleBackgroundSelect = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    onImageSelect(imageUrl);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <Paintbrush className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose a Background</DialogTitle>
          <DialogDescription>
            Select a gradient or image background for your journal
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="gradient" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gradient">Gradients</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gradient">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {gradients.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => handleGradientSelect(gradient.value)}
                    className="h-24 rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition-all"
                    style={{ background: gradient.value }}
                    aria-label={gradient.name}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="image">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {backgroundImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleBackgroundSelect(image.url)}
                    className="h-24 rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition-all bg-cover bg-center"
                    style={{ backgroundImage: `url(${image.url})` }}
                    aria-label={image.name}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
