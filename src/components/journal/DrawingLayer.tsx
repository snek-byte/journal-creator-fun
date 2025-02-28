
import { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Point {
  x: number;
  y: number;
}

interface DrawingLayerProps {
  className?: string;
  width: number;
  height: number;
  onDrawingChange?: (dataUrl: string) => void;
  tool?: string;
  color?: string;
  brushSize?: number;
  initialDrawing?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  onToolChange?: (tool: string) => void;
  onColorChange?: (color: string) => void;
  onBrushSizeChange?: (size: number) => void;
}

export function DrawingLayer({ 
  className, 
  width, 
  height, 
  onDrawingChange,
  tool = 'pen',
  color = '#000000',
  brushSize = 3,
  initialDrawing,
  onUndo,
  onRedo,
  onClear,
  onToolChange,
  onColorChange,
  onBrushSizeChange
}: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [opacity, setOpacity] = useState(1);
  const sprayInterval = useRef<number | null>(null);
  const hasInitialized = useRef(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const canvasInitialized = useRef(false);

  // Initialize canvas on mount and when dimensions change
  useEffect(() => {
    console.log("DrawingLayer: Initializing canvas with width:", width, "height:", height);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial canvas context properties
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (!canvasInitialized.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const emptyState = canvas.toDataURL();
      setUndoStack([emptyState]);
      
      canvasInitialized.current = true;
      console.log("DrawingLayer: Canvas initialized with dimensions", width, "x", height);
      
      // Load initial drawing if provided
      if (initialDrawing) {
        console.log("DrawingLayer: Loading initial drawing");
        loadState(initialDrawing);
      }
    }

    return () => {
      if (sprayInterval.current !== null) {
        window.clearInterval(sprayInterval.current);
      }
    };
  }, [width, height, initialDrawing]);

  // Update brush settings when they change
  useEffect(() => {
    console.log("DrawingLayer: Tool changed:", tool, "Color:", color, "Size:", brushSize);
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      
      if (tool === 'highlighter') {
        ctx.globalAlpha = 0.3;
      } else if (tool === 'marker') {
        ctx.globalAlpha = 0.8;
      } else {
        ctx.globalAlpha = opacity;
      }
    }
    
    ctx.lineWidth = brushSize;
  }, [color, tool, brushSize, opacity]);

  const saveState = () => {
    if (!canvasRef.current) return;
    
    const dataUrl = canvasRef.current.toDataURL();
    console.log("DrawingLayer: Saving drawing state");
    setUndoStack(prev => [...prev, dataUrl]);
    setRedoStack([]);
    
    if (onDrawingChange) {
      onDrawingChange(dataUrl);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    console.log("DrawingLayer: Starting drawing with tool:", tool);
    e.preventDefault();
    e.stopPropagation();
    
    setIsDrawing(true);
    const point = getPoint(e);
    setLastPoint(point);

    // Handle special brush types
    if (tool === 'fill') {
      fillArea(point);
      saveState();
      return;
    }
    
    if (tool === 'spray') {
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
    e.stopPropagation();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentPoint = getPoint(e);
    
    if (tool === 'spray') {
      setLastPoint(currentPoint);
      return; // Spray is handled in the interval
    }
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 3; // Bigger eraser
    } else {
      ctx.globalCompositeOperation = 'source-over';
      
      if (tool === 'highlighter') {
        ctx.lineWidth = brushSize * 3;
        ctx.globalAlpha = 0.3;
      } else if (tool === 'marker') {
        ctx.lineWidth = brushSize * 2;
        ctx.globalAlpha = 0.8;
      } else {
        ctx.lineWidth = brushSize;
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
    const density = brushSize * 5;
    const radius = brushSize * 3;

    ctx.fillStyle = color;
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
    const fillColor = hexToRgb(color);
    
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
    
    console.log("DrawingLayer: Stopping drawing");
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

  // Debugging Canvas rendering
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // Just to verify canvas is working, draw a small dot in the center
          if (!hasInitialized.current) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(width/2, height/2, 2, 0, Math.PI * 2);
            ctx.fill();
            hasInitialized.current = true;
            console.log("DrawingLayer: Validated canvas rendering with test dot");
          }
        }
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [width, height]);

  return (
    <div className={cn("absolute inset-0", className)} style={{ zIndex: 200, pointerEvents: 'auto' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="touch-none cursor-crosshair w-full h-full"
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
