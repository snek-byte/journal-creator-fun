
import { useState, useRef } from 'react';
import { MemeCanvas, downloadMeme } from '@/components/meme/MemeCanvas';
import { MemeControls } from '@/components/meme/MemeControls';
import { FrameSelector } from '@/components/meme/FrameSelector';
import { TextStyleControls } from '@/components/meme/TextStyleControls';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function MemeGenerator() {
  // Meme text states
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  
  // Meme style states
  const [font, setFont] = useState('Impact');
  const [fontSize, setFontSize] = useState(40);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fontWeight, setFontWeight] = useState('bold');
  const [textStyle, setTextStyle] = useState('normal');
  const [gradient, setGradient] = useState('');
  
  // Frame states
  const [selectedFrame, setSelectedFrame] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('#ffffff');
  const [template, setTemplate] = useState('');
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle frame selection
  const handleFrameSelect = (frame: string) => {
    console.log("Frame selected:", frame);
    setSelectedFrame(frame);
  };
  
  // Handle background color change
  const handleBackgroundChange = (color: string) => {
    setSelectedBackground(color);
  };

  // Handle template click to trigger file upload
  const handleTemplateClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTemplate(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Creative Studio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <MemeCanvas 
            template={template}
            topText={topText}
            bottomText={bottomText}
            font={font}
            fontSize={fontSize}
            fontColor={fontColor}
            strokeColor={strokeColor}
            fontWeight={fontWeight}
            textStyle={textStyle}
            gradient={gradient}
            frame={selectedFrame}
            backgroundColor={selectedBackground}
            onTemplateClick={handleTemplateClick}
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
        
        <div>
          <Card className="p-4">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="frames">Frames</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[70vh]">
                <TabsContent value="text" className="mt-0">
                  <MemeControls 
                    topText={topText}
                    bottomText={bottomText}
                    setTopText={setTopText}
                    setBottomText={setBottomText}
                    font={font}
                    setFont={setFont}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    fontColor={fontColor}
                    setFontColor={setFontColor}
                    strokeColor={strokeColor}
                    setStrokeColor={setStrokeColor}
                    onDownload={downloadMeme}
                    fontWeight={fontWeight}
                    setFontWeight={setFontWeight}
                    textStyle={textStyle}
                    setTextStyle={setTextStyle}
                    gradient={gradient}
                    setGradient={setGradient}
                  />
                </TabsContent>
                
                <TabsContent value="style" className="mt-0">
                  <TextStyleControls 
                    font={font}
                    setFont={setFont}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    fontColor={fontColor}
                    setFontColor={setFontColor}
                    strokeColor={strokeColor}
                    setStrokeColor={setStrokeColor}
                    fontWeight={fontWeight}
                    setFontWeight={setFontWeight}
                    textStyle={textStyle}
                    setTextStyle={setTextStyle}
                    gradient={gradient}
                    setGradient={setGradient}
                    backgroundColor={selectedBackground}
                    setBackgroundColor={handleBackgroundChange}
                  />
                </TabsContent>
                
                <TabsContent value="frames" className="mt-0">
                  <FrameSelector 
                    selectedFrame={selectedFrame}
                    onSelectFrame={handleFrameSelect}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
