
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Upload, Download, Image, RotateCw, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import FrameTemplateSelector from "@/components/meme/FrameTemplateSelector";
import { applyFrameToImage } from "@/utils/frameUtils";

export default function MemeGenerator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
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
        // Reset transformations when new image is loaded
        setRotation(0);
        setScale(1);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleFrameSelect = (framePath: string) => {
    setSelectedFrame(framePath);
    toast.success('Frame selected');
  };
  
  const handleDownload = async () => {
    if (!selectedImage || !selectedFrame) {
      toast.error('Please select both an image and a frame');
      return;
    }
    
    try {
      const compositeImage = await applyFrameToImage(selectedImage, selectedFrame, scale, rotation);
      
      // Create a temporary link to download the image
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
      toast.error('Failed to generate image');
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Frame Your Photos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 col-span-1 md:col-span-2 bg-white shadow-md">
          <div className="bg-gray-100 h-[500px] flex items-center justify-center rounded-md overflow-hidden">
            {selectedImage ? (
              <div 
                ref={previewRef} 
                className="relative max-w-full max-h-full flex items-center justify-center"
              >
                {selectedImage && selectedFrame && (
                  <div 
                    className="w-full h-full relative"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
                  >
                    <img 
                      src={selectedImage}
                      alt="Selected"
                      className="object-contain"
                      style={{
                        transform: `rotate(${rotation}deg) scale(${scale})`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        transition: 'transform 0.3s ease',
                        position: 'relative',
                        zIndex: 10,
                      }}
                    />
                    <img 
                      src={selectedFrame}
                      alt="Frame"
                      className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                      style={{
                        zIndex: 20,
                      }}
                    />
                  </div>
                )}
                
                {selectedImage && !selectedFrame && (
                  <img 
                    src={selectedImage}
                    alt="Selected"
                    className="max-w-full max-h-full object-contain"
                    style={{
                      transform: `rotate(${rotation}deg) scale(${scale})`,
                      transition: 'transform 0.3s ease'
                    }}
                  />
                )}
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
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <Tabs defaultValue="frames">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="frames" className="flex-1">Frames</TabsTrigger>
            </TabsList>
            <TabsContent value="frames" className="mt-0">
              <Label htmlFor="frame" className="text-sm font-medium mb-2 block">
                Select a Frame
              </Label>
              <ScrollArea className="h-[400px] pr-4">
                <FrameTemplateSelector onSelect={handleFrameSelect} selectedFrame={selectedFrame} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
