
import { useState, useEffect } from 'react';
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
  const [backgroundImages, setBackgroundImages] = useState([
    { name: 'Paper Texture', url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Marble', url: 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Wooden', url: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Nature', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Ocean', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Clouds', url: 'https://images.unsplash.com/photo-1536514072410-5019a3c69182?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Night Sky', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop' }
  ]);

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

  // Fetch new images using a reliable public image API
  const fetchImages = async (query: string = '') => {
    setIsLoading(true);
    
    try {
      // Using raw Unsplash URLs since API has issues
      const categories = [
        'nature', 'landscape', 'architecture', 'food', 'travel', 
        'animals', 'abstract', 'textures', 'patterns', 'sky'
      ];
      
      let searchTerm = query || categories[Math.floor(Math.random() * categories.length)];
      
      // For demonstration, we're creating a set of predictable but different image URLs
      // In a real app, this would use a working API
      const hash = Date.now().toString();
      const newImages = [];
      
      for (let i = 0; i < 8; i++) {
        // Generate a unique URL for each image based on search term and current time
        const imageUrl = `https://source.unsplash.com/featured/?${searchTerm},${i}&${hash}`;
        newImages.push({
          name: `${searchTerm} ${i+1}`,
          url: imageUrl
        });
      }
      
      setBackgroundImages(newImages);
      toast.success(`Found new ${query ? 'images for ' + query : 'random images'}`);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to fetch images. Using default images instead.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search submit
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    fetchImages(searchQuery);
  };

  // Fetch random new images
  const shuffleImages = () => {
    fetchImages();
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
                        key={index}
                        onClick={() => handleBackgroundSelect(image.url)}
                        className="h-24 rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition-all bg-cover bg-center"
                        style={{ backgroundImage: `url(${image.url})` }}
                        aria-label={image.name}
                      />
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
