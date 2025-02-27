
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paintbrush, Eraser, UndoIcon, RedoIcon, Trash2 } from "lucide-react";
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

// Drawing colors
const colors = [
  { name: 'Black', value: '#000000' },
  { name: 'Dark Gray', value: '#403E43' },
  { name: 'Medium Gray', value: '#8E9196' },
  { name: 'Primary Purple', value: '#9b87f5' },
  { name: 'Red', value: '#ea384c' },
  { name: 'Blue', value: '#0EA5E9' },
  { name: 'Green', value: '#4CAF50' },
  { name: 'Orange', value: '#F97316' },
];

export function DrawingLayer({ className, width, height, onDrawingChange }: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial canvas properties
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Save initial state
    saveState();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = isErasing ? '#ffffff' : currentColor;
  }, [currentColor, isErasing]);

  const saveState = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    setUndoStack(prev => [...prev, dataUrl]);
    setRedoStack([]);
    onDrawingChange?.(dataUrl);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const point = getPoint(e);
    setLastPoint(point);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current || !lastPoint) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentPoint = getPoint(e);
    
    ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    ctx.lineWidth = isErasing ? 20 : lineWidth;
    if (!isErasing) {
      ctx.strokeStyle = currentColor;
    }
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      saveState();
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
      onDrawingChange?.(dataUrl);
    };
    img.src = dataUrl;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const handleLineWidthChange = (newWidth: number) => {
    setLineWidth(newWidth);
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = newWidth;
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 bg-white/80 p-2 rounded-lg shadow-sm">
        <div className="flex gap-2">
          <Button
            variant={isErasing ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsErasing(false)}
          >
            <Paintbrush className="h-4 w-4" />
          </Button>
          <Button
            variant={isErasing ? "ghost" : "secondary"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsErasing(true)}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={undo}
            disabled={undoStack.length <= 1}
          >
            <UndoIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={redo}
            disabled={redoStack.length === 0}
          >
            <RedoIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={clearCanvas}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1 mt-1">
          {colors.map((color) => (
            <button
              key={color.value}
              className={`w-6 h-6 rounded-full border ${currentColor === color.value ? 'ring-2 ring-offset-1 ring-primary' : 'border-gray-300'}`}
              style={{ backgroundColor: color.value }}
              onClick={() => setCurrentColor(color.value)}
              title={color.name}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs">Size:</span>
          <div className="flex gap-1">
            {[2, 4, 6, 8].map((size) => (
              <button
                key={size}
                className={`w-6 h-6 flex items-center justify-center border rounded ${lineWidth === size ? 'bg-primary/20 border-primary' : 'border-gray-300'}`}
                onClick={() => handleLineWidthChange(size)}
              >
                <div 
                  className="rounded-full bg-black" 
                  style={{ 
                    width: `${size}px`, 
                    height: `${size}px` 
                  }}
                />
              </button>
            ))}
          </div>
        </div>
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
