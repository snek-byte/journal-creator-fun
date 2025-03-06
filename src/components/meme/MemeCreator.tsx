import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HexColorPicker } from 'react-colorful';
import { Slider } from "@/components/ui/slider";
import { TemplateSelector } from './TemplateSelector';
import { MemeCanvas } from './MemeCanvas';
import { useGenerateMemeCaption } from '@/hooks/useGenerateMemeCaption';
import { toast } from "sonner";
import type { Frame } from '@/types/meme';

export function MemeCreator() {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(36);
  const [frames, setFrames] = useState<Frame[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isCaptionGenerating, setIsCaptionGenerating] = useState(false);
  const { generateCaption, isGenerating } = useGenerateMemeCaption();

  useEffect(() => {
    const fetchFrames = async () => {
      setIsImageLoading(true);
      try {
        const response = await fetch('/frames.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFrames(data);
        if (data.length > 0) {
          setSelectedFrame(data[0]);
        }
      } catch (error) {
        console.error("Could not fetch the meme templates:", error);
        toast.error("Failed to load meme templates.");
      } finally {
        setIsImageLoading(false);
      }
    };

    fetchFrames();
  }, []);

  const handleFrameSelect = (frame: Frame) => {
    setSelectedFrame(frame);
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handleGenerateCaption = async () => {
    if (!selectedFrame) {
      toast.error('Please select a meme template first.');
      return;
    }

    setIsCaptionGenerating(true);
    try {
      const caption = await generateCaption(selectedFrame.name);
      if (caption) {
        setTopText(caption.topText);
        setBottomText(caption.bottomText);
        toast.success('Caption generated successfully!');
      } else {
        toast.error('Failed to generate caption.');
      }
    } finally {
      setIsCaptionGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) {
      toast.error('Canvas is not initialized.');
      return;
    }

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'meme.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Meme downloaded successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meme Creator</h1>

      {isImageLoading ? (
        <div className="text-center">Loading meme templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Template Selector */}
          <div>
            <Label htmlFor="templates">Select a Template</Label>
            <TemplateSelector
              frames={frames}
              selectedFrame={selectedFrame}
              onFrameSelect={handleFrameSelect}
            />
          </div>

          {/* Meme Preview and Controls */}
          <div className="space-y-4">
            {selectedFrame ? (
              <div className="relative">
                <MemeCanvas
                  frame={selectedFrame}
                  topText={topText}
                  bottomText={bottomText}
                  textColor={textColor}
                  fontSize={fontSize}
                  canvasRef={canvasRef}
                />
              </div>
            ) : (
              <div className="text-center">Please select a template to start.</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="topText">Top Text</Label>
              <Input
                type="text"
                id="topText"
                placeholder="Enter top text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bottomText">Bottom Text</Label>
              <Input
                type="text"
                id="bottomText"
                placeholder="Enter bottom text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Text Color</Label>
              <HexColorPicker color={textColor} onChange={handleTextColorChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <Slider
                id="fontSize"
                defaultValue={[fontSize]}
                max={100}
                min={12}
                step={1}
                onValueChange={(value) => handleFontSizeChange(value[0])}
              />
              <div className="text-sm text-muted-foreground">Selected font size: {fontSize}px</div>
            </div>

            <div className="flex justify-between">
              <Button onClick={handleGenerateCaption} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Caption'}
              </Button>
              <Button variant="primary" onClick={handleDownload}>Download Meme</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
