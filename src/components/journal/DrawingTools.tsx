
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Eraser, 
  Highlighter, 
  Paintbrush, 
  Spray, 
  Trash2,
  PaintBucket
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HexColorPicker } from "react-colorful";

interface DrawingToolsProps {
  onToolSelect: (tool: string) => void;
  currentTool: string;
  onColorChange: (color: string) => void;
  currentColor: string;
  onClear: () => void;
  onBrushSizeChange: (size: number) => void;
  currentBrushSize: number;
}

export function DrawingTools({
  onToolSelect,
  currentTool,
  onColorChange,
  currentColor,
  onClear,
  onBrushSizeChange,
  currentBrushSize
}: DrawingToolsProps) {
  const [selectedType, setSelectedType] = useState<'brush' | 'fill'>('brush');
  
  const tools = [
    { id: 'pen', name: 'Pen', icon: Pencil },
    { id: 'marker', name: 'Marker', icon: Paintbrush },
    { id: 'highlighter', name: 'Highlighter', icon: Highlighter },
    { id: 'eraser', name: 'Eraser', icon: Eraser },
    { id: 'spray', name: 'Spray', icon: Spray },
    { id: 'fill', name: 'Fill', icon: PaintBucket },
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold tracking-tight">Drawing Tools</h3>
      
      <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as 'brush' | 'fill')}>
        <TabsList className="grid grid-cols-2 h-8">
          <TabsTrigger value="brush" className="text-xs">Brushes</TabsTrigger>
          <TabsTrigger value="fill" className="text-xs">Fill</TabsTrigger>
        </TabsList>
      </Tabs>
      
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
                onClick={() => onToolSelect(tool.id)}
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
                onClick={() => onToolSelect(tool.id)}
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
      
      <div className="space-y-2">
        <Label className="text-xs">Color</Label>
        <HexColorPicker 
          color={currentColor} 
          onChange={onColorChange} 
          className="w-full"
        />
      </div>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={onClear}
        className="w-full mt-2"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Clear Drawing
      </Button>
    </div>
  );
}
