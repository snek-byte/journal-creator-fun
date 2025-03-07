
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { HexColorPicker } from "react-colorful";
import { 
  Bold, 
  Italic, 
  Underline, 
  Type, 
  PaintBucket,
  ChevronDown, 
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { textStyles } from '@/utils/unicodeTextStyles';

interface JournalStylingControlsProps {
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  selectedIconId?: string | null;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onFontWeightChange: (weight: string) => void;
  onFontColorChange: (color: string) => void;
  onGradientChange: (gradient: string) => void;
  onTextStyleChange: (style: string) => void;
}

export function JournalStylingControls({
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  selectedIconId,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
  onFontColorChange,
  onGradientChange,
  onTextStyleChange
}: JournalStylingControlsProps) {
  const [activeTab, setActiveTab] = useState('style');
  
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
  
  // Text Gradients
  const textGradients = [
    { name: 'None', value: '' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'},
    { name: 'Blue Sky', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'},
    { name: 'Green-Blue', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'},
    { name: 'Pink-Red', value: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)'},
    { name: 'Cosmic', value: 'linear-gradient(to right, #00dbde 0%, #fc00ff 100%)'},
    { name: 'Deep Blue', value: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)'},
    { name: 'Ocean', value: 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)'},
    { name: 'Sunny', value: 'linear-gradient(to right, #f83600 0%, #f9d423 100%)'},
    { name: 'Rainbow', value: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'},
    { name: 'Candy', value: 'linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)'},
    { name: 'Purple Love', value: 'linear-gradient(to right, #cc2b5e 0%, #753a88 100%)'},
  ].map(gradient => ({
    ...gradient,
    // Convert standard gradients to text gradients
    value: gradient.value ? `${gradient.value.replace('to right', '45deg')} text` : ''
  }));
  
  // Extract the numeric value from fontSize (remove 'px')
  const currentFontSize = parseInt(fontSize) || 16;
  
  // Color picker state
  const [pickerColor, setPickerColor] = useState(fontColor);
  
  const handleColorChange = (color: string) => {
    setPickerColor(color);
    onFontColorChange(color);
  };
  
  const handleFontChange = (newFont: string) => {
    onFontChange(newFont);
  };

  // Custom font size slider handler
  const handleFontSizeSliderChange = (value: number[]) => {
    const newSize = `${value[0]}px`;
    onFontSizeChange(newSize);
  };

  const handleFontWeightChange = (newWeight: string) => {
    onFontWeightChange(newWeight);
  };

  const handleGradientChange = (newGradient: string) => {
    onGradientChange(newGradient);
  };

  const handleTextStyleChange = (newStyle: string) => {
    onTextStyleChange(newStyle);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold tracking-tight">Text Styling</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="style" className="text-[10px]">Style</TabsTrigger>
          <TabsTrigger value="color" className="text-[10px]">Color</TabsTrigger>
          <TabsTrigger value="effects" className="text-[10px]">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="mt-0 space-y-4">
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
                        onClick={() => handleFontChange(f.value)}
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
                      onClick={() => handleFontWeightChange(w.value)}
                    >
                      {w.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mt-4 space-y-2">
              <span className="text-xs">Text Style</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!standardTextStyles.some(s => s.value !== 'normal' && s.value.includes('italic')) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTextStyleChange('normal')}
                  className="flex-1 h-8 px-2"
                  type="button"
                >
                  <Type className="h-3 w-3 mr-1" />
                  Normal
                </Button>
                <Button
                  variant={standardTextStyles.some(s => s.value !== 'normal' && s.value.includes('italic')) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTextStyleChange('italic')}
                  className="flex-1 h-8 px-2"
                  type="button"
                >
                  <Italic className="h-3 w-3 mr-1" />
                  Italic
                </Button>
                <Button
                  variant={standardTextStyles.some(s => s.value !== 'normal' && s.value.includes('underline')) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTextStyleChange('underline')}
                  className="flex-1 h-8 px-2"
                  type="button"
                >
                  <Underline className="h-3 w-3 mr-1" />
                  Underline
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="color" className="mt-0 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Text Color</span>
                <div className="flex items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-8 h-8 p-0 overflow-hidden"
                      >
                        <div 
                          className="w-full h-full" 
                          style={{ backgroundColor: fontColor }}
                        ></div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="end">
                      <HexColorPicker 
                        color={pickerColor} 
                        onChange={handleColorChange} 
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs flex items-center">
                  <PaintBucket className="h-3 w-3 mr-1" />
                  Text Gradient
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGradientChange('')}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {textGradients.slice(0, 9).map((g, index) => (
                  <button
                    key={index}
                    className={`h-10 rounded ${gradient === g.value ? 'ring-2 ring-primary' : 'ring-1 ring-border'}`}
                    style={g.value ? { 
                      background: g.value.replace(' text', '')
                    } : { 
                      background: '#fff',
                      border: '1px dashed #ccc'
                    }}
                    onClick={() => handleGradientChange(g.value)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="effects" className="mt-0 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Unicode Text Styles
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTextStyleChange('normal')}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
            <ScrollArea className="h-44 border rounded-md p-2">
              <div className="grid grid-cols-2 gap-2">
                {textStyles.map((style) => (
                  <Button
                    key={style.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTextStyleChange(style.value)}
                    className="h-8 px-2 text-xs justify-start overflow-hidden"
                    type="button"
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
