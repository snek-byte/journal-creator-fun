
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
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

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
  const [showColorPicker, setShowColorPicker] = useState(true);
  
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
    toast.info(`${toolId.charAt(0).toUpperCase() + toolId.slice(1)} tool selected`);
    
    // If a tool is selected but drawing mode is not enabled, enable it
    if (!isDrawingMode) {
      onDrawingModeToggle(true);
      toast.info("Drawing mode enabled");
    }
  };
  
  const handleDrawingModeToggle = (checked: boolean) => {
    onDrawingModeToggle(checked);
    if (checked) {
      toast.info("Drawing mode enabled. Other interactions are disabled while drawing.");
    } else {
      toast.info("Drawing mode disabled. You can now interact with text and stickers.");
    }
  };
  
  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };
  
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
      
      {/* Color Picker Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs">Color</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={toggleColorPicker}
          >
            {showColorPicker ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
        </div>
        
        {/* Color Preview */}
        <div className="flex gap-2 items-center">
          <div 
            className="w-8 h-8 rounded-full border border-gray-200" 
            style={{ backgroundColor: currentColor }}
          />
          <div className="text-xs font-mono">{currentColor}</div>
        </div>
        
        {/* Expandable Color Picker */}
        {showColorPicker && (
          <HexColorPicker 
            color={currentColor} 
            onChange={onColorChange} 
            className="w-full"
          />
        )}
      </div>
      
      <Separator className="my-2" />
      
      {/* Clear Drawing Button */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          onClear();
          toast.info("Drawing cleared");
        }}
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
