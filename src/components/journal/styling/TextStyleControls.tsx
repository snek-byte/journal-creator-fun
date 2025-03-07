
import React from 'react';
import { Type, Italic, Underline } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ChevronDown } from 'lucide-react';

interface TextStyleControlsProps {
  font: string;
  fontSize: string;
  fontWeight: string;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onFontWeightChange: (weight: string) => void;
  onTextStyleChange: (style: string) => void;
}

export function TextStyleControls({
  font,
  fontSize,
  fontWeight,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
  onTextStyleChange
}: TextStyleControlsProps) {
  // Available fonts
  const fonts = [
    { name: 'Inter', value: 'inter' },
    { name: 'Roboto', value: 'roboto' },
    { name: 'Open Sans', value: 'open-sans' },
    { name: 'Lato', value: 'lato' },
    { name: 'Montserrat', value: 'montserrat' },
    { name: 'Playfair Display', value: 'playfair-display' },
    { name: 'Merriweather', value: 'merriweather' },
    { name: 'Oswald', value: 'oswald' },
    { name: 'Raleway', value: 'raleway' },
    { name: 'Nunito', value: 'nunito' },
    { name: 'Courier New', value: 'courier-new' },
    { name: 'Times New Roman', value: 'times-new-roman' },
  ];
  
  // Font weights
  const fontWeights = [
    { name: 'Light', value: '300' },
    { name: 'Regular', value: 'normal' },
    { name: 'Medium', value: '500' },
    { name: 'Semi-Bold', value: '600' },
    { name: 'Bold', value: 'bold' },
  ];
  
  // Text styles
  const standardTextStyles = [
    { name: 'Normal', value: 'normal' },
    { name: 'Italic', value: 'italic' },
    { name: 'Underline', value: 'underline' },
    { name: 'Italic + Underline', value: 'italic underline' },
  ];
  
  // Extract the numeric value from fontSize (remove 'px')
  const currentFontSize = parseInt(fontSize) || 16;
  
  // Custom font size slider handler
  const handleFontSizeSliderChange = (value: number[]) => {
    const newSize = `${value[0]}px`;
    onFontSizeChange(newSize);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs">Font</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-2 h-8 text-xs justify-between w-32"
            >
              <span className={`font-${font}`}>
                {fonts.find(f => f.value === font)?.name || 'Inter'}
              </span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32" align="end">
            <ScrollArea className="h-60">
              {fonts.map(f => (
                <DropdownMenuItem 
                  key={f.value} 
                  className={`text-sm font-${f.value}`}
                  onClick={() => onFontChange(f.value)}
                >
                  {f.name}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Font size slider */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="font-size-slider" className="text-xs">Font Size</Label>
          <span className="text-xs font-medium">{currentFontSize}px</span>
        </div>
        <Slider 
          id="font-size-slider"
          min={10}
          max={200}
          step={1}
          value={[currentFontSize]}
          onValueChange={handleFontSizeSliderChange}
          className="my-2"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs">Font Weight</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-2 h-8 text-xs justify-between w-32"
            >
              {fontWeights.find(w => w.value === fontWeight)?.name || 'Regular'}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32" align="end">
            {fontWeights.map(w => (
              <DropdownMenuItem 
                key={w.value}
                onClick={() => onFontWeightChange(w.value)}
              >
                {w.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mt-4 space-y-2">
        <span className="text-xs">Text Format</span>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!standardTextStyles.some(s => s.value !== 'normal' && s.value.includes('italic')) ? "default" : "outline"}
            size="sm"
            onClick={() => onTextStyleChange('normal')}
            className="flex-1 h-8 px-2"
            type="button"
          >
            <Type className="h-3 w-3 mr-1" />
            Normal
          </Button>
          <Button
            variant={standardTextStyles.some(s => s.value !== 'normal' && s.value.includes('italic')) ? "default" : "outline"}
            size="sm"
            onClick={() => onTextStyleChange('italic')}
            className="flex-1 h-8 px-2"
            type="button"
          >
            <Italic className="h-3 w-3 mr-1" />
            Italic
          </Button>
          <Button
            variant={standardTextStyles.some(s => s.value !== 'normal' && s.value.includes('underline')) ? "default" : "outline"}
            size="sm"
            onClick={() => onTextStyleChange('underline')}
            className="flex-1 h-8 px-2"
            type="button"
          >
            <Underline className="h-3 w-3 mr-1" />
            Underline
          </Button>
        </div>
      </div>
    </div>
  );
}
