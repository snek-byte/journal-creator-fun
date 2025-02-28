
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Search, RotateCw, Upload, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { gradients } from './config/editorConfig';

interface BackgroundImageSelectorProps {
  onImageSelect: (url: string) => void;
}

export function BackgroundImageSelector({ onImageSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState('gradient');
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const imageSets = {
    nature: [
      { name: 'Mountain Lake', url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80' },
      { name: 'Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80' },
      { name: 'Ocean', url: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=800&q=80' },
      { name: 'Desert', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80' }
    ],
    abstract: [
      { name: 'Paint', url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=800&q=80' },
      { name: 'Waves', url: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?auto=format&fit=crop&w=800&q=80' },
      { name: 'Texture', url: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&w=800&q=80' },
      { name: 'Pattern', url: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&w=800&q=80' }
    ],
    minimal: [
      { name: 'White Wall', url: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&w=800&q=80' },
      { name: 'Paper', url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=800&q=80' },
      { name: 'Marble', url: 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?auto=format&fit=crop&w=800&q=80' },
      { name: 'Concrete', url: 'https://images.unsplash.com/photo-1514483127413-f72f273478c3?auto=format&fit=crop&w=800&q=80' }
    ],
    paper: [
      { name: 'Classic Paper', url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=800&q=80' },
      { name: 'Vintage Paper', url: 'https://images.unsplash.com/photo-1587614298871-5c1c03aef307?auto=format&fit=crop&w=800&q=80' },
      { name: 'Textured Paper', url: 'https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?auto=format&fit=crop&w=800&q=80' },
      { name: 'Kraft Paper', url: 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?auto=format&fit=crop&w=800&q=80' },
      { name: 'Handmade Paper', url: 'https://images.unsplash.com/photo-1582902281043-dcea5e78c682?auto=format&fit=crop&w=800&q=80' }
    ],
    illustrated: [
      { name: 'Stylized Tech', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80' },
      { name: 'Modern Robot', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80' },
      { name: 'Digital Art', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80' },
      { name: 'Code Art', url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80' }
    ]
  };

  const [currentCategory, setCurrentCategory] = useState('nature');
  const [backgroundImages, setBackgroundImages] = useState(imageSets.nature);

  const handleGradientSelect = (gradient: string) => {
    // Pass empty string as image URL to clear any background image
    onImageSelect('');
    // Pass the gradient as a class or style value that will be applied
    toast.success('Gradient background applied');
  };

  const handleBackgroundSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    toast.success('Image background applied');
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const query = searchQuery.toLowerCase().trim();
      let newImages;
      let category;
      
      if (query.includes('paper') || query.includes('texture')) {
        newImages = imageSets.paper;
        category = 'paper';
      } else if (query.includes('art') || query.includes('illustration') || query.includes('digital')) {
        newImages = imageSets.illustrated;
        category = 'illustrated';
      } else if (query.includes('nature') || query.includes('landscape')) {
        newImages = imageSets.nature;
        category = 'nature';
      } else if (query.includes('abstract') || query.includes('pattern')) {
        newImages = imageSets.abstract;
        category = 'abstract';
      } else if (query.includes('minimal') || query.includes('simple')) {
        newImages = imageSets.minimal;
        category = 'minimal';
      } else {
        newImages = imageSets.paper;
        category = 'paper';
      }
      
      setCurrentCategory(category);
      setBackgroundImages(newImages);
      toast.success(`Showing ${category} backgrounds`);
    } catch (error) {
      console.error('Error changing category:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const shuffleImages = () => {
    setIsLoading(true);
    try {
      const categories = ['nature', 'abstract', 'minimal', 'paper', 'illustrated'] as const;
      const currentIndex = categories.indexOf(currentCategory as any);
      const nextCategory = categories[(currentIndex + 1) % categories.length];
      setCurrentCategory(nextCategory);
      setBackgroundImages(imageSets[nextCategory as keyof typeof imageSets]);
      toast.success(`Showing ${nextCategory} backgrounds`);
    } catch (error) {
      console.error('Error rotating categories:', error);
      toast.error('Failed to load new images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        handleBackgroundSelect(e.target.result);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to load image');
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <ImagePlus className="w-4 h-4" />
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gradient">Gradients</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
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
                    aria-label={gradient.label}
                    type="button"
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="image">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input 
                  type="text" 
                  placeholder="Try: nature, abstract, or minimal" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleSearch} 
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={shuffleImages}
                  disabled={isLoading}
                  title="Browse different styles"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
              
              <ScrollArea className="h-[250px] w-full rounded-md border p-4">
                {isLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-sm text-gray-500">Loading...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {backgroundImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleBackgroundSelect(image.url)}
                        className="relative h-24 rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition-all"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{image.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-8">
              <Upload className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <Button variant="outline" asChild>
                <label htmlFor="image-upload" className="cursor-pointer">
                  Choose image
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
              </Button>
              <p className="text-xs text-muted-foreground/70 mt-4">
                Supports JPG, PNG, WebP, and GIF formats
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
