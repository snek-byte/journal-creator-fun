
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fontOptions, fontSizes, fontWeights, gradients } from "./config/editorConfig";
import { textStyles } from "@/utils/unicodeTextStyles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const UNSPLASH_ACCESS_KEY = 'VwPTQrE4BR88kJ54_KDFJgEKeVAIMnABEpRX1qLqcUA';

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
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isCustomImage = gradient.startsWith('url(');

  useEffect(() => {
    fetchUnsplashImages();
  }, []);

  const fetchUnsplashImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?count=9&query=journal%20background%20minimalist&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch images');
      
      const data = await response.json();
      setUnsplashImages(data);
    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
      toast.error('Failed to load background images');
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

  const handleUnsplashImageSelect = (imageUrl: string, photographerName: string) => {
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
            <div className="grid grid-cols-3 gap-2">
              {unsplashImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleUnsplashImageSelect(image.urls.regular, image.user.name)}
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
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUnsplashImages}
              className="w-full"
              disabled={isLoading}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {isLoading ? 'Loading...' : 'Load New Images'}
            </Button>
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
