
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paintbrush, Eraser, UndoIcon, RedoIcon, Trash2, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Simple color palette
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
    }
  }, [currentColor, brushType]);

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
    
    // Start a new path
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
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastPoint(null);
    saveState();
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
      ctx.lineWidth = 10; // Bigger eraser
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = lineWidth;
    }
  };

  return (
    <div className={cn("absolute inset-0", className)}>
      <div className="absolute top-2 left-2 z-50 bg-white rounded-lg shadow-md p-1 border border-gray-200 space-y-1">
        <div className="flex flex-wrap gap-1 mb-1">
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
        
        <div className="flex justify-between">
          <Button
            variant={brushType === 'pen' ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => handleBrushTypeChange('pen')}
            type="button"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          
          <Button
            variant={brushType === 'marker' ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => handleBrushTypeChange('marker')}
            type="button"
          >
            <Paintbrush className="h-3 w-3" />
          </Button>
          
          <Button
            variant={brushType === 'eraser' ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => handleBrushTypeChange('eraser')}
            type="button"
          >
            <Eraser className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={undo}
            disabled={undoStack.length <= 1}
            type="button"
          >
            <UndoIcon className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={redo}
            disabled={redoStack.length === 0}
            type="button"
          >
            <RedoIcon className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 p-0 text-xs w-1/2"
            onClick={clearCanvas}
            type="button"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            className="h-7 p-0 text-xs w-1/2"
            onClick={() => onDrawingChange && onDrawingChange('')}
            type="button"
          >
            <X className="h-3 w-3 mr-1" />
            Close
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
