
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Search, RotateCw, Upload } from "lucide-react";
import { useJournalStore } from '@/store/journalStore';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { gradients } from './config/editorConfig';

interface BackgroundImageSelectorProps {
  onImageSelect: (url: string) => void;
}

export function BackgroundImageSelector({ onImageSelect }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState('gradient');
  const { setBackgroundImage, setGradient } = useJournalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Default image categories to randomly select from
  const imageCategories = [
    'nature', 'landscape', 'abstract', 'pattern', 'texture', 
    'minimal', 'sky', 'mountains', 'ocean', 'forest'
  ];
  
  // Generate a set of Unsplash image URLs with unique tracking parameters
  const generateImageSet = (query = '') => {
    const timestamp = Date.now();
    const selectedCategory = query || imageCategories[Math.floor(Math.random() * imageCategories.length)];
    
    return Array.from({ length: 8 }, (_, i) => ({
      name: `${selectedCategory} ${i + 1}`,
      url: `https://source.unsplash.com/random/800x600?${selectedCategory},${i}&t=${timestamp}`
    }));
  };
  
  // Initialize with a set of default images
  const [backgroundImages, setBackgroundImages] = useState(generateImageSet());

  // Handle gradient selection
  const handleGradientSelect = (gradient: string) => {
    setGradient(gradient);
    setBackgroundImage(''); // Clear any existing background image
    onImageSelect('');
    toast.success('Gradient background applied');
  };

  // Handle background image selection
  const handleBackgroundSelect = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    onImageSelect(imageUrl);
    toast.success('Image background applied');
  };

  // Handle search submit
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate new images for the search query
      const newImages = generateImageSet(searchQuery.trim());
      setBackgroundImages(newImages);
      
      // Brief delay to allow the browser to start loading the new images
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(`Found new images for "${searchQuery}"`);
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate new images');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch random new images
  const shuffleImages = async () => {
    setIsLoading(true);
    
    try {
      // Generate completely new random images
      const randomCategory = imageCategories[Math.floor(Math.random() * imageCategories.length)];
      const newImages = generateImageSet(randomCategory);
      
      setBackgroundImages(newImages);
      
      // Brief delay to allow the browser to start loading the new images
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(`Found new ${randomCategory} images`);
    } catch (error) {
      console.error('Error generating random images:', error);
      toast.error('Failed to generate new images');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload
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
                    aria-label={gradient.label}
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
                  placeholder="Search for backgrounds..." 
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
                  title="Get random images"
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
                        key={`${image.url}-${index}`}
                        onClick={() => handleBackgroundSelect(image.url)}
                        className="h-24 rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition-all bg-cover bg-center"
                        style={{ backgroundImage: `url(${image.url})` }}
                        aria-label={image.name}
                      >
                        {/* Add a fallback for empty images */}
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                          {image.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <div className="flex items-center gap-2">
                <label htmlFor="upload-bg" className="flex-1">
                  <div className="flex items-center justify-center h-10 px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    <span>Upload image</span>
                  </div>
                  <input
                    id="upload-bg"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
