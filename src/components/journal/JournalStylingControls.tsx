
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fontOptions, fontSizes, fontWeights, gradients } from "./config/editorConfig";
import { textStyles } from "@/utils/unicodeTextStyles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Search, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Pre-loaded background images
const backgroundImages = [
  {
    id: '1',
    urls: {
      regular: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=1920',
      thumb: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=400'
    },
    user: { name: 'Unsplash' }
  },
  {
    id: '2',
    urls: {
      regular: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920',
      thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400'
    },
    user: { name: 'Unsplash' }
  },
  {
    id: '3',
    urls: {
      regular: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1920',
      thumb: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=400'
    },
    user: { name: 'Unsplash' }
  },
  {
    id: '4',
    urls: {
      regular: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1920',
      thumb: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=400'
    },
    user: { name: 'Unsplash' }
  },
  {
    id: '5',
    urls: {
      regular: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1920',
      thumb: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=400'
    },
    user: { name: 'Unsplash' }
  },
  {
    id: '6',
    urls: {
      regular: 'https://images.unsplash.com/photo-1486899430790-61dbf6f6d98b?q=80&w=1920',
      thumb: 'https://images.unsplash.com/photo-1486899430790-61dbf6f6d98b?q=80&w=400'
    },
    user: { name: 'Unsplash' }
  },
];

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    thumb: string;
  };
  user: {
    name: string;
  };
}

interface PexelsImage {
  id: string;
  src: {
    original: string;
    medium: string;
  };
  photographer: string;
}

interface JournalStylingControlsProps {
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  onFontChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onFontWeightChange: (value: string) => void;
  onFontColorChange: (value: string) => void;
  onGradientChange: (value: string) => void;
  onTextStyleChange: (value: string) => void;
}

export function JournalStylingControls({
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
  onFontColorChange,
  onGradientChange,
  onTextStyleChange,
}: JournalStylingControlsProps) {
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>(backgroundImages);
  const [pexelsImages, setPexelsImages] = useState<PexelsImage[]>([]);
  const [pixabayImages, setPixabayImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isCustomImage = gradient.startsWith('url(');

  // Initial load of additional background sources
  useEffect(() => {
    fetchPexelsImages();
    fetchPixabayImages();
  }, []);

  const fetchUnsplashImages = async (query?: string) => {
    setIsLoading(true);
    try {
      let url = 'https://api.unsplash.com/photos/random?count=6&orientation=landscape';
      if (query) {
        url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: 'Client-ID 3LkQBthcZKAW1D0QL4j7a6CVNW-UN-pTVJBRnIxKR6A'
        }
      });
      
      const data = await response.json();
      const images = query ? data.results : data;
      
      setUnsplashImages(images);
    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
      toast.error('Failed to load new backgrounds from Unsplash');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPexelsImages = async (query?: string) => {
    setIsLoading(true);
    try {
      let url = 'https://api.pexels.com/v1/curated?per_page=6';
      if (query) {
        url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: 'oayA3SB5wwuE3PMeJMWdlq1EEAlOcCeIIWshOvZLQEuIy41HwMFPHVlZ'
        }
      });
      
      const data = await response.json();
      setPexelsImages(data.photos || []);
    } catch (error) {
      console.error('Error fetching Pexels images:', error);
      toast.error('Failed to load backgrounds from Pexels');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPixabayImages = async (query?: string) => {
    setIsLoading(true);
    try {
      let url = 'https://pixabay.com/api/?key=40789382-dda8c2c86d5904aef47c02c8f&per_page=6&image_type=photo';
      if (query) {
        url = `https://pixabay.com/api/?key=40789382-dda8c2c86d5904aef47c02c8f&q=${encodeURIComponent(query)}&per_page=6&image_type=photo`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setPixabayImages(data.hits || []);
    } catch (error) {
      console.error('Error fetching Pixabay images:', error);
      toast.error('Failed to load backgrounds from Pixabay');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    fetchUnsplashImages(searchQuery);
    fetchPexelsImages(searchQuery);
    fetchPixabayImages(searchQuery);
  };

  const shuffleImages = () => {
    setIsLoading(true);
    
    fetchUnsplashImages();
    fetchPexelsImages();
    fetchPixabayImages();
    
    toast.success('Loaded new background options');
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
        onGradientChange(`url(${e.target.result})`);
        toast.success('Background image uploaded successfully');
      }
    };
    reader.onerror = () => {
      toast.error('Failed to load image');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onGradientChange(gradients[0].value);
    toast.success('Background image removed');
  };

  const handleImageSelect = (imageUrl: string, photographerName: string) => {
    onGradientChange(`url(${imageUrl})`);
    toast.success(`Background set to image by ${photographerName}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Text Style</label>
        <Select onValueChange={onTextStyleChange} defaultValue="normal">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {textStyles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Font Family</label>
        <Select value={font} onValueChange={onFontChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Font Size</label>
        <Select value={fontSize} onValueChange={onFontSizeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Font Weight</label>
        <Select value={fontWeight} onValueChange={onFontWeightChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontWeights.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Font Color</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => onFontColorChange(e.target.value)}
          className="w-full h-10 rounded-md cursor-pointer"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Background</Label>
        <div className="space-y-4">
          <Select value={isCustomImage ? '' : gradient} onValueChange={onGradientChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a gradient" />
            </SelectTrigger>
            <SelectContent>
              {gradients.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="unsplash" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
                <TabsTrigger value="pexels">Pexels</TabsTrigger>
                <TabsTrigger value="pixabay">Pixabay</TabsTrigger>
              </TabsList>
              
              <TabsContent value="unsplash" className="mt-2">
                {isLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-sm text-gray-500">Loading...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {unsplashImages.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => handleImageSelect(image.urls.regular, image.user.name)}
                        className="relative aspect-video overflow-hidden rounded-md hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={image.urls.thumb}
                          alt={`Background by ${image.user.name}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pexels" className="mt-2">
                {isLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-sm text-gray-500">Loading...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {pexelsImages.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => handleImageSelect(image.src.original, image.photographer)}
                        className="relative aspect-video overflow-hidden rounded-md hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={image.src.medium}
                          alt={`Background by ${image.photographer}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pixabay" className="mt-2">
                {isLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-sm text-gray-500">Loading...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {pixabayImages.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => handleImageSelect(image.largeImageURL, image.user)}
                        className="relative aspect-video overflow-hidden rounded-md hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={image.webformatURL}
                          alt={`Background by ${image.user}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-500">Or upload your own image</Label>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              {isCustomImage && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Image
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
