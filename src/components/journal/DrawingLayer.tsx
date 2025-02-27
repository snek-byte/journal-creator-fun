
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paintbrush, Eraser, UndoIcon, RedoIcon, Trash2, CircleDashed, PaintBucket, Pencil, Highlighter, GripVertical, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Point {
  x: number;
  y: number;
}

interface DrawingLayerProps {
  className?: string;
  width: number;
  height: number;
  onDrawingChange?: (dataUrl: string) => void;
}

// Soft pastel color palette
const colors = [
  { name: 'Black', value: '#000000' },
  { name: 'Soft Purple', value: '#E5DEFF' },
  { name: 'Soft Blue', value: '#D3E4FD' },
  { name: 'Soft Green', value: '#F2FCE2' },
  { name: 'Soft Yellow', value: '#FEF7CD' },
  { name: 'Soft Orange', value: '#FEC6A1' },
  { name: 'Soft Pink', value: '#FFDEE2' },
  { name: 'Soft Peach', value: '#FDE1D3' },
];

// Brush types
const brushTypes = [
  { name: 'Pen', value: 'pen', icon: <Pencil className="h-3 w-3" /> },
  { name: 'Marker', value: 'marker', icon: <Paintbrush className="h-3 w-3" /> },
  { name: 'Highlighter', value: 'highlighter', icon: <Highlighter className="h-3 w-3" /> },
  { name: 'Spray', value: 'spray', icon: <CircleDashed className="h-3 w-3" /> },
  { name: 'Fill', value: 'fill', icon: <PaintBucket className="h-3 w-3" /> },
  { name: 'Eraser', value: 'eraser', icon: <Eraser className="h-3 w-3" /> },
];

export function DrawingLayer({ className, width, height, onDrawingChange }: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [brushType, setBrushType] = useState('pen');
  const [opacity, setOpacity] = useState(1);
  const hasInitialized = useRef(false);
  const spraying = useRef(false);
  const sprayInterval = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(false);

  // Initialize canvas only once on component mount
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial canvas properties
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear the canvas to ensure it's empty on mount
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Initialize the undo stack with an empty canvas state
    const emptyState = canvas.toDataURL();
    setUndoStack([emptyState]);
    
    hasInitialized.current = true;

    return () => {
      // Clean up any spray interval on unmount
      if (sprayInterval.current !== null) {
        window.clearInterval(sprayInterval.current);
      }
    };
  }, []);

  // Update stroke style when color changes
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    if (brushType === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      
      // Apply different settings based on brush type
      if (brushType === 'highlighter') {
        ctx.globalAlpha = 0.3;
      } else if (brushType === 'marker') {
        ctx.globalAlpha = 0.8;
      } else {
        ctx.globalAlpha = opacity;
      }
    }
  }, [currentColor, brushType, opacity]);

  const saveState = () => {
    if (!canvasRef.current) return;
    if (!isDrawing) return; // Only save state when we've actually drawn something
    
    const dataUrl = canvasRef.current.toDataURL();
    
    setUndoStack(prev => [...prev, dataUrl]);
    setRedoStack([]);
    
    // Only call onDrawingChange if there's an actual change
    if (onDrawingChange && dataUrl !== undoStack[0]) {
      onDrawingChange(dataUrl);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getPoint(e);
    setLastPoint(point);

    if (brushType === 'fill') {
      fillArea(point);
      saveState();
      return;
    }

    if (brushType === 'spray') {
      spraying.current = true;
      spray(point);
      // Set up interval for continuous spraying
      sprayInterval.current = window.setInterval(() => {
        if (spraying.current && lastPoint) {
          spray(lastPoint);
        }
      }, 50);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current || !lastPoint) return;
    e.preventDefault();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentPoint = getPoint(e);
    
    if (brushType === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 3; // Make eraser bigger
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = lineWidth;
      
      if (brushType === 'highlighter') {
        ctx.lineWidth = lineWidth * 3;
        ctx.globalAlpha = 0.3;
      } else if (brushType === 'marker') {
        ctx.lineWidth = lineWidth * 2;
        ctx.globalAlpha = 0.8;
      } else if (brushType === 'spray') {
        setLastPoint(currentPoint);
        return; // The spray effect is handled in the interval
      } else {
        ctx.globalAlpha = opacity;
      }
    }
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
  };

  const spray = (point: Point) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Spray parameters
    const density = lineWidth * 5;
    const radius = lineWidth * 3;

    ctx.fillStyle = currentColor;
    ctx.globalAlpha = 0.05; // Lower opacity for spray particles

    for (let i = 0; i < density; i++) {
      const offsetX = Math.random() * 2 * radius - radius;
      const offsetY = Math.random() * 2 * radius - radius;
      const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
      
      if (distance <= radius) {
        ctx.beginPath();
        ctx.arc(point.x + offsetX, point.y + offsetY, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Reset globalAlpha for other tools
    ctx.globalAlpha = opacity;
  };

  const fillArea = (point: Point) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const targetColor = getColorAtPixel(imageData, Math.floor(point.x), Math.floor(point.y));
    const fillColor = hexToRgb(currentColor);
    
    // Simple flood fill algorithm
    if (fillColor) {
      floodFill(imageData, Math.floor(point.x), Math.floor(point.y), targetColor, fillColor);
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const getColorAtPixel = (imageData: ImageData, x: number, y: number) => {
    const { width, data } = imageData;
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };

  const setColorAtPixel = (imageData: ImageData, x: number, y: number, color: number[]) => {
    const { width, data } = imageData;
    const index = (y * width + x) * 4;
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = color[3];
  };

  const hexToRgb = (hex: string): number[] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255
    ] : null;
  };

  const floodFill = (imageData: ImageData, x: number, y: number, targetColor: number[], fillColor: number[]) => {
    const { width, height } = imageData;
    
    if (
      x < 0 || x >= width || y < 0 || y >= height ||
      colorsEqual(getColorAtPixel(imageData, x, y), fillColor)
    ) {
      return;
    }
    
    if (!colorsEqual(getColorAtPixel(imageData, x, y), targetColor)) {
      return;
    }
    
    // Use a queue for non-recursive fill
    const queue: [number, number][] = [[x, y]];
    while (queue.length > 0) {
      const [curX, curY] = queue.shift()!;
      
      if (
        curX < 0 || curX >= width || curY < 0 || curY >= height ||
        !colorsEqual(getColorAtPixel(imageData, curX, curY), targetColor)
      ) {
        continue;
      }
      
      setColorAtPixel(imageData, curX, curY, fillColor);
      
      queue.push([curX + 1, curY]);
      queue.push([curX - 1, curY]);
      queue.push([curX, curY + 1]);
      queue.push([curX, curY - 1]);
    }
  };

  const colorsEqual = (a: number[], b: number[]) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && Math.abs(a[3] - b[3]) < 50;
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setLastPoint(null);
    saveState();
    
    // Clean up spray interval if active
    if (sprayInterval.current !== null) {
      window.clearInterval(sprayInterval.current);
      sprayInterval.current = null;
      spraying.current = false;
    }
  };

  const getPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const undo = () => {
    if (undoStack.length <= 1) return;
    
    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack[undoStack.length - 2];
    
    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, -1));
    
    loadState(previousState);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, nextState]);
    
    loadState(nextState);
  };

  const loadState = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      if (onDrawingChange) {
        onDrawingChange(dataUrl);
      }
    };
    img.src = dataUrl;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const emptyState = canvas.toDataURL();
    setUndoStack([emptyState]);
    setRedoStack([]);
    
    if (onDrawingChange) {
      onDrawingChange('');
    }
  };

  const handleLineWidthChange = (newWidth: number) => {
    setLineWidth(newWidth);
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = newWidth;
  };

  const handleBrushTypeChange = (type: string) => {
    setBrushType(type);
    
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    if (type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      
      if (type === 'highlighter') {
        ctx.globalAlpha = 0.3;
      } else if (type === 'marker') {
        ctx.globalAlpha = 0.8;
      } else {
        ctx.globalAlpha = opacity;
      }
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (toolbarRef.current) {
      e.preventDefault();
      e.stopPropagation();
      const rect = toolbarRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div className={cn("absolute inset-0", className)}>
      <div 
        ref={toolbarRef}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px` 
        }}
        className={cn(
          "absolute z-50 flex flex-col bg-white/95 rounded-lg shadow-md border border-gray-200 transition-all",
          minimized ? "w-auto" : "w-[180px]"
        )}
      >
        <div 
          className="flex items-center justify-between bg-gray-50 rounded-t-lg p-1 cursor-move"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-1 px-1">
            <GripVertical className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">Doodle Tool</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setMinimized(!minimized)}
              type="button"
            >
              {minimized ? <Paintbrush className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              onClick={clearCanvas}
              type="button"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {!minimized && (
          <div className="p-2 space-y-2">
            <Tabs defaultValue="brushes" className="w-full">
              <TabsList className="grid grid-cols-2 h-6">
                <TabsTrigger value="brushes" className="text-xs">Brushes</TabsTrigger>
                <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
              </TabsList>
              
              <TabsContent value="brushes" className="space-y-2 mt-1.5">
                <div className="flex flex-wrap gap-1">
                  {brushTypes.map((brush) => (
                    <Button
                      key={brush.value}
                      variant={brushType === brush.value ? "secondary" : "ghost"}
                      size="icon"
                      className="h-6 w-6 p-1"
                      onClick={() => handleBrushTypeChange(brush.value)}
                      title={brush.name}
                      type="button"
                    >
                      {brush.icon}
                    </Button>
                  ))}
                </div>
                
                <div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-xs">Size:</span>
                    <div className="flex gap-1">
                      {[2, 4, 6, 8].map((size) => (
                        <button
                          key={size}
                          className={`w-4 h-4 flex items-center justify-center border rounded-sm ${lineWidth === size ? 'bg-primary/20 border-primary' : 'border-gray-300'}`}
                          onClick={() => handleLineWidthChange(size)}
                          type="button"
                        >
                          <div 
                            className="rounded-full" 
                            style={{ 
                              width: `${size/2}px`, 
                              height: `${size/2}px`,
                              backgroundColor: brushType === 'eraser' ? '#888' : currentColor
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {brushType !== 'eraser' && brushType !== 'highlighter' && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-xs">Opacity:</span>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={opacity}
                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                        className="flex-1 h-1"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="colors" className="mt-1.5">
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      className={`w-5 h-5 rounded-full ${currentColor === color.value ? 'ring-1 ring-offset-1 ring-primary' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setCurrentColor(color.value)}
                      title={color.name}
                      type="button"
                    />
                  ))}
                </div>
                
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="w-full h-6 rounded-md flex items-center justify-center gap-1 border border-gray-200"
                        type="button"
                      >
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: currentColor }}
                        />
                        <span className="text-xs">Custom</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <HexColorPicker color={currentColor} onChange={setCurrentColor} />
                    </PopoverContent>
                  </Popover>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex gap-1 justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-1"
                onClick={undo}
                disabled={undoStack.length <= 1}
                type="button"
              >
                <UndoIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-1"
                onClick={redo}
                disabled={redoStack.length === 0}
                type="button"
              >
                <RedoIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-1"
                onClick={clearCanvas}
                type="button"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={cn("touch-none cursor-crosshair")}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}
