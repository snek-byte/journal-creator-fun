
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paintbrush, Eraser, UndoIcon, RedoIcon, Trash2, CircleDashed, PaintBucket, Pencil, Highlighter, X, GripVertical, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

interface Point {
  x: number;
  y: number;
}

interface DrawingLayerProps {
  className?: string;
  width?: number;
  height?: number;
  onDrawingChange?: (dataUrl: string) => void;
  initialDrawing?: string;
}

// Organized color palette - Primary colors
const colors = [
  { value: '#000000', label: 'Black' },
  { value: '#1e40af', label: 'Blue' },
  { value: '#7e22ce', label: 'Purple' },
  { value: '#dc2626', label: 'Red' },
  { value: '#ea580c', label: 'Orange' },
  { value: '#ca8a04', label: 'Yellow' },
  { value: '#16a34a', label: 'Green' },
  { value: '#0d9488', label: 'Teal' },
];

// Brush types
const brushTypes = [
  { name: 'Pen', value: 'pen', icon: <Pencil className="h-2.5 w-2.5" /> },
  { name: 'Marker', value: 'marker', icon: <Paintbrush className="h-2.5 w-2.5" /> },
  { name: 'Highlighter', value: 'highlighter', icon: <Highlighter className="h-2.5 w-2.5" /> },
  { name: 'Spray', value: 'spray', icon: <CircleDashed className="h-2.5 w-2.5" /> },
  { name: 'Fill', value: 'fill', icon: <PaintBucket className="h-2.5 w-2.5" /> },
  { name: 'Eraser', value: 'eraser', icon: <Eraser className="h-2.5 w-2.5" /> },
];

export function DrawingLayer({ className, width = 800, height = 600, onDrawingChange, initialDrawing }: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [brushType, setBrushType] = useState('pen');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const sprayInterval = useRef<number | null>(null);
  const [opacity, setOpacity] = useState(1);
  const hasInitialized = useRef(false);
  
  // For dragging functionality
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const [compactMode, setCompactMode] = useState(false);
  const [isActive, setIsActive] = useState(true);

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
    
    // Load initial drawing if provided
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialDrawing;
    }
    
    const emptyState = canvas.toDataURL();
    setUndoStack([emptyState]);
    
    hasInitialized.current = true;

    return () => {
      if (sprayInterval.current !== null) {
        window.clearInterval(sprayInterval.current);
      }
    };
  }, [initialDrawing]);

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

  // Improved dragging functionality
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    
    // Store the initial mouse position
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    // Store the initial position of the toolbar
    initialPos.current = { ...position };
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate the distance moved from the start position
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    // Update the position based on the initial position plus the distance moved
    setPosition({
      x: initialPos.current.x + dx,
      y: initialPos.current.y + dy
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCloseDrawTool = () => {
    // This function should close the drawing tool and clear the drawing
    console.log("Close drawing tool clicked");
    toast.info("Closing drawing tool");
    
    // Set isActive to false to hide the toolbar
    setIsActive(false);
    
    // Clear the canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    
    // Notify parent that drawing is cleared
    if (onDrawingChange) {
      onDrawingChange('');
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

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

  // Add a useEffect that runs once on mount to notify via toast
  useEffect(() => {
    toast.info("Drawing tool opened. Click X to close when done.");
  }, []);

  return (
    <div className={cn("absolute inset-0", className)}>
      <div 
        ref={toolbarRef}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          position: 'absolute',
          zIndex: 50,
          display: isActive ? 'block' : 'none'
        }}
        className={cn(
          "bg-white rounded-lg shadow-md border border-gray-200",
          compactMode ? "w-auto" : "w-[160px]"
        )}
      >
        {/* Draggable header */}
        <div 
          className="flex items-center justify-between bg-gray-50 rounded-t-lg px-2 py-1 cursor-move border-b border-gray-100"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-1">
            <GripVertical className="h-2.5 w-2.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">Draw Tool</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
              onClick={() => setCompactMode(!compactMode)}
              type="button"
            >
              {compactMode ? <Paintbrush className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 text-red-400 hover:text-red-600"
              onClick={handleCloseDrawTool}
              type="button"
              aria-label="Close drawing tool"
            >
              <X className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
        
        {!compactMode && (
          <div className="p-2 space-y-2">
            {/* Color palette */}
            <div>
              <div className="flex flex-wrap gap-1">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-3.5 h-3.5 rounded-full ${currentColor === color.value ? 'ring-1 ring-offset-1 ring-black' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setCurrentColor(color.value)}
                    title={color.label}
                    type="button"
                  />
                ))}
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-5 mt-1 flex items-center justify-center gap-1 text-[10px]"
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentColor }}></div>
                    Custom Color
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <HexColorPicker color={currentColor} onChange={setCurrentColor} />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Brush types */}
            <div>
              <div className="grid grid-cols-3 gap-1">
                {brushTypes.map((brush) => (
                  <Button
                    key={brush.value}
                    variant={brushType === brush.value ? "secondary" : "ghost"}
                    size="sm"
                    className="h-5 p-0"
                    onClick={() => {
                      handleBrushTypeChange(brush.value);
                    }}
                    title={brush.name}
                    type="button"
                  >
                    {brush.icon}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Brush size */}
            <div className="flex justify-between gap-1">
              {[2, 4, 6, 8].map((size) => (
                <button
                  key={size}
                  className={`flex-1 flex items-center justify-center rounded border ${lineWidth === size ? 'bg-primary/20 border-primary' : 'border-gray-300'} h-5`}
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
            
            {/* Opacity (only for certain brush types) */}
            {brushType !== 'eraser' && brushType !== 'highlighter' && (
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-medium">Opacity</span>
                  <span className="text-[10px] text-gray-500">{opacity.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full h-1 mt-1"
                />
              </div>
            )}
            
            {/* Control buttons - Redesigned to be narrower */}
            <div className="grid grid-cols-3 gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-0 py-0 text-[8px]"
                onClick={undo}
                disabled={undoStack.length <= 1}
                type="button"
              >
                <UndoIcon className="h-2 w-2 mr-0.5" />
                Undo
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-0 py-0 text-[8px]"
                onClick={redo}
                disabled={redoStack.length === 0}
                type="button"
              >
                <RedoIcon className="h-2 w-2 mr-0.5" />
                Redo
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-0 py-0 text-[8px]"
                onClick={clearCanvas}
                type="button"
              >
                <Trash2 className="h-2 w-2 mr-0.5" />
                Clr
              </Button>
            </div>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={cn(
          "touch-none",
          isActive ? "cursor-crosshair" : "cursor-default"
        )}
        onMouseDown={(e) => {
          if (isActive) startDrawing(e);
        }}
        onMouseMove={(e) => {
          if (isActive) draw(e);
        }}
        onMouseUp={() => {
          if (isActive) stopDrawing();
        }}
        onMouseOut={() => {
          if (isActive) stopDrawing();
        }}
        onTouchStart={(e) => {
          if (isActive) startDrawing(e);
        }}
        onTouchMove={(e) => {
          if (isActive) draw(e);
        }}
        onTouchEnd={() => {
          if (isActive) stopDrawing();
        }}
      />
    </div>
  );
}
