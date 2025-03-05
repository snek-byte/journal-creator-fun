
import React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Meme } from "@/types/meme";
import { Card, CardContent } from "@/components/ui/card";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface MemeControlsProps {
  meme: Meme;
  onMemeChange: (meme: Meme) => void;
  onDownload: () => void;
  onReset: () => void;
}

export function MemeControls({ meme, onMemeChange, onDownload, onReset }: MemeControlsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onMemeChange({ ...meme, [name]: value });
  };
  
  const handleSliderChange = (name: string, value: number[]) => {
    onMemeChange({ ...meme, [name]: value[0] });
  };

  const fontFamilies = ["Impact", "Arial", "Comic Sans MS", "Tahoma", "Verdana"];
  
  const handleDownloadClick = () => {
    try {
      onDownload();
    } catch (error) {
      console.error("Error downloading meme:", error);
      toast.error("Failed to download. Please try again.");
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="topText">Top Text</Label>
          <Input 
            id="topText"
            name="topText"
            value={meme.topText}
            onChange={handleChange}
            placeholder="Top text"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bottomText">Bottom Text</Label>
          <Input 
            id="bottomText"
            name="bottomText"
            value={meme.bottomText}
            onChange={handleChange}
            placeholder="Bottom text"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font</Label>
          <select
            id="fontFamily"
            name="fontFamily"
            value={meme.fontFamily}
            onChange={handleChange as any}
            className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            {fontFamilies.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size: {meme.fontSize}px</Label>
          <Slider
            id="fontSize"
            min={12}
            max={60}
            step={1}
            value={[meme.fontSize]}
            onValueChange={(value) => handleSliderChange("fontSize", value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontColor">Text Color</Label>
          <div className="flex items-center gap-3">
            <Input 
              id="fontColor"
              name="fontColor"
              type="color"
              value={meme.fontColor}
              onChange={handleChange}
              className="w-12 h-10 p-1"
            />
            <Input 
              type="text"
              name="fontColor"
              value={meme.fontColor}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="strokeColor">Stroke Color</Label>
          <div className="flex items-center gap-3">
            <Input 
              id="strokeColor"
              name="strokeColor"
              type="color"
              value={meme.strokeColor}
              onChange={handleChange}
              className="w-12 h-10 p-1"
            />
            <Input 
              type="text"
              name="strokeColor"
              value={meme.strokeColor}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="strokeWidth">Stroke Width: {meme.strokeWidth}px</Label>
          <Slider
            id="strokeWidth"
            min={0}
            max={10}
            step={0.5}
            value={[meme.strokeWidth]}
            onValueChange={(value) => handleSliderChange("strokeWidth", value)}
          />
        </div>
        
        <div className="flex justify-between gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={onReset}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            variant="default"
            onClick={handleDownloadClick}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
