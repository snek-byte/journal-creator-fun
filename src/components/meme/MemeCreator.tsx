
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChromePicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MemeCanvas } from "./MemeCanvas";
import { MemeTemplateSelector } from "./TemplateSelector";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useGenerateMemeCaption } from "@/hooks/useGenerateMemeCaption";
import { Download, Wand2, Image, FileImage, X, RefreshCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import html2canvas from 'html2canvas';

const FONT_FAMILIES = [
  { value: 'Impact', label: 'Impact' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Comic Sans MS', label: 'Comic Sans' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Courier New', label: 'Courier' },
  { value: 'Times New Roman', label: 'Times New Roman' },
];

const TONE_OPTIONS = [
  { value: 'funny', label: 'Funny' },
  { value: 'sarcastic', label: 'Sarcastic' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'dark humor', label: 'Dark Humor' },
  { value: 'nerdy', label: 'Nerdy' },
  { value: 'dramatic', label: 'Dramatic' },
];

export const MemeCreator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
  const [fontFamily, setFontFamily] = useState('Impact');
  const [fontSize, setFontSize] = useState(36);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [imageDescription, setImageDescription] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('funny');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { generateCaption } = useGenerateMemeCaption();

  const handleTemplateSelect = (templateUrl: string) => {
    setSelectedTemplate(templateUrl);
    setUploadedImage(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setUploadedImage(e.target.result);
          setSelectedTemplate(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCaption = async () => {
    if (!imageDescription && !selectedTemplate && !uploadedImage) {
      toast.error('Please select a template, upload an image, or provide an image description first.');
      return;
    }

    setIsGenerating(true);
    try {
      const context = imageDescription || 
        (selectedTemplate ? `A meme template: ${selectedTemplate.split('/').pop()?.split('.')[0]}` : 'An uploaded image');
      
      const result = await generateCaption(context, selectedTone);
      if (result) {
        setTopText(result.topText || '');
        setBottomText(result.bottomText || '');
        toast.success('Caption generated!');
      }
    } catch (error) {
      console.error('Error generating caption:', error);
      toast.error('Failed to generate caption');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    try {
      toast.info('Preparing download...');
      const canvas = await html2canvas(canvasRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Meme downloaded!');
    } catch (error) {
      console.error('Error downloading meme:', error);
      toast.error('Failed to download meme');
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setSelectedTemplate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentImage = uploadedImage || selectedTemplate;

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 h-full">
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meme Creator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="template">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="template">Templates</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="template" className="space-y-4">
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  <MemeTemplateSelector onSelect={handleTemplateSelect} selectedTemplate={selectedTemplate} />
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4">
                <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-6 space-y-2">
                  <FileImage className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Upload your own image</p>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            {currentImage && (
              <div className="relative">
                <img 
                  src={currentImage} 
                  alt="Selected template" 
                  className="w-full h-auto rounded-md border" 
                />
                <Button 
                  variant="destructive" 
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Caption Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-description">Image Description</Label>
              <Textarea 
                id="image-description"
                placeholder="Describe the image or meme context..."
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full"
              onClick={handleGenerateCaption}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Caption'}
              <Wand2 className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-6 min-h-[400px]">
            {currentImage ? (
              <div ref={canvasRef}>
                <MemeCanvas
                  image={currentImage}
                  topText={topText}
                  bottomText={bottomText}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  strokeWidth={strokeWidth}
                  textColor={textColor}
                  strokeColor={strokeColor}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 space-y-2">
                <FileImage className="w-16 h-16" />
                <p>Select a template or upload an image</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleDownload} disabled={!currentImage}>
              <Download className="mr-2 h-4 w-4" />
              Download Meme
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="top-text">Top Text</Label>
              <div className="flex gap-2">
                <Input 
                  id="top-text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Top text"
                />
                <Button variant="outline" size="icon" onClick={() => setTopText('')}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bottom-text">Bottom Text</Label>
              <div className="flex gap-2">
                <Input 
                  id="bottom-text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Bottom text"
                />
                <Button variant="outline" size="icon" onClick={() => setBottomText('')}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="font-family">Font</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem 
                        key={font.value} 
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                <Slider 
                  id="font-size"
                  min={16} 
                  max={72} 
                  step={1}
                  value={[fontSize]}
                  onValueChange={(values) => setFontSize(values[0])}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="text-color"
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: textColor }}
                      />
                      {textColor}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ChromePicker 
                      color={textColor} 
                      onChange={(color) => setTextColor(color.hex)} 
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stroke-color">Stroke Color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="stroke-color"
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: strokeColor }}
                      />
                      {strokeColor}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ChromePicker 
                      color={strokeColor} 
                      onChange={(color) => setStrokeColor(color.hex)} 
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stroke-width">Stroke Width: {strokeWidth}px</Label>
              <Slider 
                id="stroke-width"
                min={0} 
                max={10} 
                step={0.5}
                value={[strokeWidth]}
                onValueChange={(values) => setStrokeWidth(values[0])}
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setTopText('TOP TEXT');
                setBottomText('BOTTOM TEXT');
                setFontFamily('Impact');
                setFontSize(36);
                setStrokeWidth(3);
                setTextColor('#FFFFFF');
                setStrokeColor('#000000');
              }}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset Text Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
