
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  PenTool, 
  Eraser, 
  Highlighter, 
  Paintbrush, 
  Droplets,
  Trash2,
  PaintBucket,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HexColorPicker } from "react-colorful";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DrawingToolsProps {
  onToolSelect: (tool: string) => void;
  currentTool: string;
  onColorChange: (color: string) => void;
  currentColor: string;
  onClear: () => void;
  onBrushSizeChange: (size: number) => void;
  currentBrushSize: number;
  isDrawingMode: boolean;
  onDrawingModeToggle: (enabled: boolean) => void;
}

export function DrawingTools({
  onToolSelect,
  currentTool,
  onColorChange,
  currentColor,
  onClear,
  onBrushSizeChange,
  currentBrushSize,
  isDrawingMode,
  onDrawingModeToggle
}: DrawingToolsProps) {
  const [selectedType, setSelectedType] = useState<'brush' | 'fill'>('brush');
  
  const tools = [
    { 
      id: 'pen', 
      name: 'Pen', 
      icon: PenTool, 
      description: 'Fine-tipped pen for precise drawing'
    },
    { 
      id: 'marker', 
      name: 'Marker', 
      icon: Paintbrush, 
      description: 'Broad marker with semi-transparent effect'
    },
    { 
      id: 'highlighter', 
      name: 'Highlighter', 
      icon: Highlighter, 
      description: 'Transparent highlighting effect'
    },
    { 
      id: 'eraser', 
      name: 'Eraser', 
      icon: Eraser, 
      description: 'Erase parts of your drawing'
    },
    { 
      id: 'spray', 
      name: 'Spray', 
      icon: Droplets, 
      description: 'Spray paint effect with particle spread'
    },
    { 
      id: 'fill', 
      name: 'Fill', 
      icon: PaintBucket, 
      description: 'Fill enclosed areas with color'
    },
  ];

  const handleToolClick = (toolId: string) => {
    console.log("Tool selected:", toolId);
    onToolSelect(toolId);
    
    // If a tool is selected but drawing mode is not enabled, enable it
    if (!isDrawingMode) {
      onDrawingModeToggle(true);
    }
  };
  
  const handleDrawingModeToggle = (checked: boolean) => {
    onDrawingModeToggle(checked);
  };
  
  // Define common color presets
  const colorPresets = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#A52A2A", // Brown
    "#808080", // Gray
  ];
  
  return (
    <div className="space-y-4">
      {/* Drawing Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-tight">Drawing Tools</h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="drawing-mode" className="text-xs text-muted-foreground">
            {isDrawingMode ? "Drawing Mode" : "Editing Mode"}
          </Label>
          <Switch 
            id="drawing-mode" 
            checked={isDrawingMode} 
            onCheckedChange={handleDrawingModeToggle}
          />
        </div>
      </div>
      
      {/* Tool Type Selection */}
      <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as 'brush' | 'fill')}>
        <TabsList className="grid grid-cols-2 h-8">
          <TabsTrigger value="brush" className="text-xs">Drawing Tools</TabsTrigger>
          <TabsTrigger value="fill" className="text-xs">Fill Tools</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Tool Selection */}
      {selectedType === 'brush' ? (
        <div className="grid grid-cols-3 gap-2">
          {tools.slice(0, 5).map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? "default" : "outline"}
                size="sm"
                className="flex-col h-auto py-2 px-0"
                onClick={() => handleToolClick(tool.id)}
                title={tool.description}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-[10px]">{tool.name}</span>
              </Button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {tools.slice(5).map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? "default" : "outline"}
                size="sm"
                className="flex-col h-auto py-2"
                onClick={() => handleToolClick(tool.id)}
                title={tool.description}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="text-xs">{tool.name}</span>
                </div>
              </Button>
            );
          })}
        </div>
      )}
      
      <Separator className="my-2" />
      
      {/* Brush Size Control */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="brush-size-slider" className="text-xs">Brush Size</Label>
          <span className="text-xs font-medium">{currentBrushSize}px</span>
        </div>
        <Slider 
          id="brush-size-slider"
          min={1}
          max={20}
          step={1}
          value={[currentBrushSize]}
          onValueChange={(value) => onBrushSizeChange(value[0])}
        />
      </div>
      
      <Separator className="my-2" />
      
      {/* Color Picker Section - Using Popover for better positioning */}
      <div className="space-y-2">
        <Label className="text-xs">Color</Label>
        
        <div className="flex items-center gap-2">
          {/* Color Display */}
          <div className="flex items-center gap-2 flex-1">
            <div 
              className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" 
              style={{ backgroundColor: currentColor }}
            />
            <div className="text-xs font-mono">{currentColor}</div>
          </div>
          
          {/* Color Picker Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                Pick Color
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="end">
              <div className="space-y-3">
                <HexColorPicker 
                  color={currentColor} 
                  onChange={onColorChange}
                  style={{ width: '200px', height: '200px' }}
                />
                
                <div className="grid grid-cols-6 gap-1 mt-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => onColorChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Separator className="my-2" />
      
      {/* Clear Drawing Button */}
      <Button
        variant="destructive"
        size="sm"
        onClick={onClear}
        className="w-full"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Clear Drawing
      </Button>
      
      {/* Tool Information */}
      {isDrawingMode && (
        <div className="mt-4 text-xs text-muted-foreground bg-muted p-3 rounded-md">
          <p className="font-semibold mb-1">Current Tool: {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)}</p>
          <p>{tools.find(t => t.id === currentTool)?.description}</p>
        </div>
      )}
    </div>
  );
}
