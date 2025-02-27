
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paintbrush, Eraser, UndoIcon, RedoIcon, Trash2, CircleDashed, PaintBucket, Pencil, Highlighter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";

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

// Basic color palette
const colors = [
  '#000000', // Black
  '#1E40AF', // Blue
  '#7E22CE', // Purple
  '#DC2626', // Red
  '#EA580C', // Orange
  '#CA8A04', // Yellow
  '#16A34A', // Green
  '#0D9488', // Teal
];

// Pastel colors
const pastelColors = [
  '#E5DEFF', // Pastel Purple
  '#D3E4FD', // Pastel Blue
  '#F2FCE2', // Pastel Green
  '#FEF7CD', // Pastel Yellow
  '#FEC6A1', // Pastel Orange
  '#FFDEE2', // Pastel Pink
  '#FDE1D3', // Pastel Peach
  '#F0F0F0', // Pastel Gray
];

export function DrawingLayer({ className, width, height, onDrawingChange }: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [brushType, setBrushType] = useState('pen');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const hasInitialized = useRef(false);
  const sprayInterval = useRef<number | null>(null);
  const [opacity, setOpacity] = useState(1);

  // Initialize canvas on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const emptyState = canvas.toDataURL();
    setUndoStack([emptyState]);
    
    hasInitialized.current = true;

    return () => {
      if (sprayInterval.current !== null) {
        window.clearInterval(sprayInterval.current);
      }
    };
  }, []);

  // Update brush settings when they change
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    if (brushType === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      
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
    if (!canvasRef.current || !isDrawing) return;
    
    const dataUrl = canvasRef.current.toDataURL();
    setUndoStack(prev => [...prev, dataUrl]);
    setRedoStack([]);
    
    if (onDrawingChange) {
      onDrawingChange(dataUrl);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getPoint(e);
    setLastPoint(point);

    // Handle special brush types
    if (brushType === 'fill') {
      fillArea(point);
      saveState();
      return;
    }
    
    if (brushType === 'spray') {
      spray(point);
      sprayInterval.current = window.setInterval(() => {
        if (lastPoint) {
          spray(lastPoint);
        }
      }, 50);
      return;
    }
    
    // Start a path for regular brushes
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current || !lastPoint) return;
    e.preventDefault();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentPoint = getPoint(e);
    
    if (brushType === 'spray') {
      setLastPoint(currentPoint);
      return; // Spray is handled in the interval
    }
    
    if (brushType === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 3; // Bigger eraser
    } else {
      ctx.globalCompositeOperation = 'source-over';
      
      if (brushType === 'highlighter') {
        ctx.lineWidth = lineWidth * 3;
        ctx.globalAlpha = 0.3;
      } else if (brushType === 'marker') {
        ctx.lineWidth = lineWidth * 2;
        ctx.globalAlpha = 0.8;
      } else {
        ctx.lineWidth = lineWidth;
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

    // Reset globalAlpha
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

  const handleBrushTypeChange = (type: string) => {
    setBrushType(type);
    
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    if (type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 3; // Bigger eraser
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = lineWidth;
      
      if (type === 'highlighter') {
        ctx.globalAlpha = 0.3;
      } else if (type === 'marker') {
        ctx.globalAlpha = 0.8;
      } else {
        ctx.globalAlpha = opacity;
      }
    }
  };

  return (
    <div className={cn("absolute inset-0", className)}>
      <div className="absolute top-2 left-2 z-50 bg-white rounded-lg shadow-md p-2 border border-gray-200 space-y-2 max-w-[200px]">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs font-medium">Doodle Tool</div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onDrawingChange && onDrawingChange('')}
            type="button"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div>
          <p className="text-xs mb-1 font-medium">Colors</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-5 h-5 rounded-full ${currentColor === color ? 'ring-1 ring-offset-1 ring-black' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
                type="button"
              />
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {pastelColors.map((color) => (
              <button
                key={color}
                className={`w-5 h-5 rounded-full ${currentColor === color ? 'ring-1 ring-offset-1 ring-black' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
                type="button"
              />
            ))}
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full h-7 flex items-center justify-center gap-1 text-xs"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentColor }}></div>
                Custom Color
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <HexColorPicker color={currentColor} onChange={setCurrentColor} />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <p className="text-xs mb-1 font-medium">Brush Type</p>
          <div className="grid grid-cols-3 gap-1 mb-2">
            <Button
              variant={brushType === 'pen' ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-full p-0"
              onClick={() => handleBrushTypeChange('pen')}
              title="Pen"
              type="button"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            
            <Button
              variant={brushType === 'marker' ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-full p-0"
              onClick={() => handleBrushTypeChange('marker')}
              title="Marker"
              type="button"
            >
              <Paintbrush className="h-3 w-3" />
            </Button>
            
            <Button
              variant={brushType === 'highlighter' ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-full p-0"
              onClick={() => handleBrushTypeChange('highlighter')}
              title="Highlighter"
              type="button"
            >
              <Highlighter className="h-3 w-3" />
            </Button>
            
            <Button
              variant={brushType === 'spray' ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-full p-0"
              onClick={() => handleBrushTypeChange('spray')}
              title="Spray"
              type="button"
            >
              <CircleDashed className="h-3 w-3" />
            </Button>
            
            <Button
              variant={brushType === 'fill' ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-full p-0"
              onClick={() => handleBrushTypeChange('fill')}
              title="Fill"
              type="button"
            >
              <PaintBucket className="h-3 w-3" />
            </Button>
            
            <Button
              variant={brushType === 'eraser' ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-full p-0"
              onClick={() => handleBrushTypeChange('eraser')}
              title="Eraser"
              type="button"
            >
              <Eraser className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div>
          <p className="text-xs mb-1 font-medium">Brush Size</p>
          <div className="flex justify-between gap-1 mb-2">
            {[2, 4, 6, 8].map((size) => (
              <button
                key={size}
                className={`flex items-center justify-center rounded border ${lineWidth === size ? 'bg-primary/20 border-primary' : 'border-gray-300'} w-10 h-6`}
                onClick={() => setLineWidth(size)}
                type="button"
              >
                <div 
                  className="rounded-full"
                  style={{ 
                    width: `${size}px`, 
                    height: `${size}px`,
                    backgroundColor: brushType === 'eraser' ? '#888' : currentColor
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        
        {brushType !== 'eraser' && brushType !== 'highlighter' && (
          <div>
            <p className="text-xs mb-1 font-medium">Opacity: {opacity}</p>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1"
            />
          </div>
        )}
        
        <div className="flex gap-1 justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="h-7"
            onClick={undo}
            disabled={undoStack.length <= 1}
            type="button"
          >
            <UndoIcon className="h-3 w-3 mr-1" />
            Undo
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7"
            onClick={redo}
            disabled={redoStack.length === 0}
            type="button"
          >
            <RedoIcon className="h-3 w-3 mr-1" />
            Redo
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7"
            onClick={clearCanvas}
            type="button"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="touch-none cursor-crosshair"
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
