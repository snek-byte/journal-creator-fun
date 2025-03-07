
import { useState } from 'react';

interface DrawingControlsProps {
  onDrawingToolSelect: (tool: string) => void;
  onDrawingColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onDrawingModeToggle: (enabled: boolean) => void;
  onClearDrawing: () => void;
}

export function DrawingControls({
  onDrawingToolSelect,
  onDrawingColorChange,
  onBrushSizeChange,
  onDrawingModeToggle,
  onClearDrawing
}: DrawingControlsProps) {
  const [currentDrawingTool, setCurrentDrawingTool] = useState('pen');
  const [currentDrawingColor, setCurrentDrawingColor] = useState('#000000');
  const [currentBrushSize, setCurrentBrushSize] = useState(3);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  
  const handleDrawingToolChange = (tool: string) => {
    setCurrentDrawingTool(tool);
    onDrawingToolSelect(tool);
  };
  
  const handleDrawingColorChange = (color: string) => {
    setCurrentDrawingColor(color);
    onDrawingColorChange(color);
  };
  
  const handleBrushSizeChange = (size: number) => {
    setCurrentBrushSize(size);
    onBrushSizeChange(size);
  };
  
  const handleDrawingModeToggle = (enabled: boolean) => {
    setIsDrawingMode(enabled);
    onDrawingModeToggle(enabled);
  };
  
  return {
    currentDrawingTool,
    currentDrawingColor,
    currentBrushSize,
    isDrawingMode,
    handleDrawingToolChange,
    handleDrawingColorChange,
    handleBrushSizeChange,
    handleDrawingModeToggle,
    handleClearDrawing: onClearDrawing
  };
}
