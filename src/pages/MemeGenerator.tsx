
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Download, Image, RotateCw, RotateCcw, ZoomIn, ZoomOut, Trash, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import FrameTemplateSelector from "@/components/meme/FrameTemplateSelector";
import { applyFrameWithClaidApi } from "@/utils/claidApi";
import { 
  createOpenFrameArtwork, 
  pushToOpenFrame, 
  prepareImageForOpenFrame,
  isAnimatedImage 
} from "@/utils/openFrameUtils";

export default function MemeGenerator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [artworkTitle, setArtworkTitle] = useState('My Framed Image');
  const [artworkAuthor, setArtworkAuthor] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setSelectedImage(e.target.result);
        setRotation(0);
        setScale(1);
        toast.success('Image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleFrameSelect = (framePath: string) => {
    setSelectedFrame(framePath);
    toast.success('Frame selected');
  };
  
  const handleDownload = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }
    
    if (!selectedFrame) {
      toast.error('Please select a frame');
      return;
    }
    
    try {
      setIsGenerating(true);
      toast.info('Applying frame to image...', { duration: 2000 });
      
      console.log('Calling applyFrameWithClaidApi...');
      const compositeImage = await applyFrameWithClaidApi(selectedImage, selectedFrame);
      
      const link = document.createElement('a');
      link.href = compositeImage;
      link.download = `framed-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Image downloaded successfully!');
      setGeneratedImage(compositeImage);
    } catch (error) {
      console.error('Error generating composite image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleExportToOpenFrame = async () => {
    if (!generatedImage) {
      toast.error('Please generate an image first');
      return;
    }
    
    try {
      setIsExporting(true);
      toast.info('Preparing for OpenFrame export...', { duration: 2000 });
      
      // Check if the image is animated
      const animated = isAnimatedImage(generatedImage);
      
      // Prepare the image for OpenFrame by wrapping it in a responsive container
      const openFrameUrl = prepareImageForOpenFrame(generatedImage, animated);
      
      // Create the artwork object using the prepared URL
      const artwork = createOpenFrameArtwork(
        openFrameUrl,
        artworkTitle,
        artworkAuthor || 'Anonymous',
        animated
      );
      
      await pushToOpenFrame(artwork);
      
      toast.success('Successfully exported to OpenFrame!');
    } catch (error) {
      console.error('Error exporting to OpenFrame:', error);
      toast.error('Failed to export to OpenFrame. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };
  
  const handleClearImage = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setRotation(0);
    setScale(1);
    toast.success('Image cleared');
  };
  
  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90);
  };
  
  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };
  
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };
  
  useEffect(() => {
    const previewFrameOnImage = async () => {
      if (selectedImage && selectedFrame) {
        try {
          const previewImageContainer = document.querySelector('.preview-image-container');
          if (previewImageContainer) {
            const existingFramePreview = previewImageContainer.querySelector('.frame-preview');
            if (existingFramePreview) {
              existingFramePreview.remove();
            }
            
            const frameImg = document.createElement('img');
            frameImg.src = selectedFrame;
            frameImg.className = 'frame-preview absolute inset-0 w-full h-full object-contain pointer-events-none';
            previewImageContainer.appendChild(frameImg);
          }
        } catch (error) {
          console.error('Error previewing frame:', error);
        }
      }
    };
    
    previewFrameOnImage();
  }, [selectedFrame, selectedImage]);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Frame Your Photos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 col-span-1 md:col-span-2 bg-white shadow-md">
          <div 
            className="bg-gray-100 h-[500px] flex items-center justify-center rounded-md overflow-hidden"
            ref={containerRef}
          >
            {selectedImage ? (
              <div 
                ref={previewRef} 
                className="relative max-w-full max-h-full flex items-center justify-center"
              >
                <div className="preview-image-container relative w-auto h-auto">
                  <div className="relative inline-block">
                    {selectedImage && (
                      <img 
                        ref={imageRef}
                        src={selectedImage}
                        alt="Selected"
                        className="block max-w-full max-h-[460px]"
                        style={{
                          transform: `rotate(${rotation}deg) scale(${scale})`,
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Upload an image to get started</p>
                <Button onClick={handleUploadClick}>
                  <Upload className="mr-2 h-4 w-4" /> Select Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            )}
          </div>
          
          {selectedImage && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" onClick={handleRotateLeft}>
                <RotateCcw className="h-4 w-4 mr-2" /> Rotate Left
              </Button>
              <Button variant="outline" onClick={handleRotateRight}>
                <RotateCw className="h-4 w-4 mr-2" /> Rotate Right
              </Button>
              <Button variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4 mr-2" /> Zoom In
              </Button>
              <Button variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4 mr-2" /> Zoom Out
              </Button>
              <Button variant="outline" onClick={handleUploadClick}>
                <Upload className="h-4 w-4 mr-2" /> Change Image
              </Button>
              <Button variant="destructive" onClick={handleClearImage}>
                <Trash className="h-4 w-4 mr-2" /> Clear Image
              </Button>
              <Button onClick={handleDownload} disabled={isGenerating || !selectedFrame}>
                <Download className="h-4 w-4 mr-2" /> 
                {isGenerating ? 'Generating...' : 'Download'}
              </Button>
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <Tabs defaultValue="frames">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="frames" className="flex-1">Frames</TabsTrigger>
              <TabsTrigger value="export" className="flex-1">Export</TabsTrigger>
            </TabsList>
            <TabsContent value="frames" className="mt-0">
              <Label htmlFor="frame" className="text-sm font-medium mb-2 block">
                Select a Frame
              </Label>
              <ScrollArea className="h-[400px] pr-4">
                <FrameTemplateSelector onSelect={handleFrameSelect} selectedFrame={selectedFrame} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="export" className="mt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                    Artwork Title
                  </Label>
                  <Input
                    id="title"
                    value={artworkTitle}
                    onChange={(e) => setArtworkTitle(e.target.value)}
                    placeholder="My Framed Image"
                  />
                </div>
                <div>
                  <Label htmlFor="author" className="text-sm font-medium mb-2 block">
                    Artist Name
                  </Label>
                  <Input
                    id="author"
                    value={artworkAuthor}
                    onChange={(e) => setArtworkAuthor(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={handleExportToOpenFrame} 
                    disabled={isExporting || !generatedImage}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" /> 
                    {isExporting ? 'Exporting...' : 'Export to OpenFrame'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Export your framed image to OpenFrame for digital display. 
                    Generate an image first by selecting a frame and clicking Download.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
