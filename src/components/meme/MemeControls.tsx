
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Download, ChevronDown } from 'lucide-react';

type MemeControlsProps = {
  topText: string;
  bottomText: string;
  setTopText: (text: string) => void;
  setBottomText: (text: string) => void;
  font: string;
  setFont: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontColor: string;
  setFontColor: (color: string) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  onDownload: () => void;
  fontWeight: string;
  setFontWeight: (weight: string) => void;
  textStyle: string;
  setTextStyle: (style: string) => void;
  gradient: string;
  setGradient: (gradient: string) => void;
};

export function MemeControls({
  topText,
  bottomText,
  setTopText,
  setBottomText,
  font,
  setFont,
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  strokeColor,
  setStrokeColor,
  onDownload,
  fontWeight,
  setFontWeight,
  textStyle,
  setTextStyle,
  gradient,
  setGradient
}: MemeControlsProps) {
  const [activeTab, setActiveTab] = useState('text');

  // Available fonts
  const fonts = [
    { name: 'Impact', value: 'Impact' },
    { name: 'Arial', value: 'Arial' },
    { name: 'Helvetica', value: 'Helvetica' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Oswald', value: 'Oswald' },
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
  const textStyles = [
    { name: 'Normal', value: 'normal' },
    { name: 'Italic', value: 'italic' },
    { name: 'Underline', value: 'underline' },
    { name: 'Italic + Underline', value: 'italic underline' },
  ];

  // Text Gradients
  const textGradients = [
    { name: 'None', value: '' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%) text'},
    { name: 'Blue Sky', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) text'},
    { name: 'Green-Blue', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) text'},
    { name: 'Pink-Red', value: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%) text'},
    { name: 'Cosmic', value: 'linear-gradient(to right, #00dbde 0%, #fc00ff 100%) text'},
    { name: 'Deep Blue', value: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%) text'},
  ];

  const handleDownload = () => {
    onDownload();
    toast.success("Meme downloaded!");
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="top-text">Top Text</Label>
              <Input
                id="top-text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Top text"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bottom-text">Bottom Text</Label>
              <Input
                id="bottom-text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Bottom text"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="font">Font</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-2 h-8 text-xs justify-between w-40"
                    >
                      {fonts.find(f => f.value === font)?.name || 'Impact'}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    <ScrollArea className="h-60">
                      {fonts.map(f => (
                        <DropdownMenuItem 
                          key={f.value} 
                          onClick={() => setFont(f.value)}
                        >
                          {f.name}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="font-weight">Font Weight</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-2 h-8 text-xs justify-between w-40"
                    >
                      {fontWeights.find(w => w.value === fontWeight)?.name || 'Bold'}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    {fontWeights.map(w => (
                      <DropdownMenuItem 
                        key={w.value}
                        onClick={() => setFontWeight(w.value)}
                      >
                        {w.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="text-style">Text Style</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-2 h-8 text-xs justify-between w-40"
                    >
                      {textStyles.find(s => s.value === textStyle)?.name || 'Normal'}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    {textStyles.map(s => (
                      <DropdownMenuItem 
                        key={s.value}
                        onClick={() => setTextStyle(s.value)}
                      >
                        {s.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="gradient">Text Gradient</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-2 h-8 text-xs justify-between w-40"
                    >
                      {textGradients.find(g => g.value === gradient)?.name || 'None'}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    {textGradients.map(g => (
                      <DropdownMenuItem 
                        key={g.value}
                        onClick={() => setGradient(g.value)}
                      >
                        {g.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                <Slider
                  id="font-size"
                  min={20}
                  max={80}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="w-40"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="font-color">Text Color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="font-color"
                      variant="outline"
                      className="w-full h-8 p-0 overflow-hidden"
                      style={{ backgroundColor: fontColor }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <HexColorPicker color={fontColor} onChange={setFontColor} />
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
                      className="w-full h-8 p-0 overflow-hidden"
                      style={{ backgroundColor: strokeColor }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <HexColorPicker color={strokeColor} onChange={setStrokeColor} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          className="w-full mt-4" 
          size="lg" 
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" /> Download Meme
        </Button>
      </CardContent>
    </Card>
  );
}
