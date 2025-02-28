
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
  onClear?: () => void;
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
  onClear
}: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Get and store context
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;
    
    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    updateBrushStyles();
    
    // Load initial drawing if provided
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialDrawing;
    }
    
    console.log("DrawingLayer: Canvas initialized with dimensions", width, "x", height);
    
    // Draw a test pixel to confirm canvas is working
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    ctx.fillRect(10, 10, 10, 10);
    
    toast.info("Drawing canvas ready! Click and drag to draw.");
    
  }, [width, height, initialDrawing]);

  // Update brush styles when props change
  const updateBrushStyles = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    
    // Special tool settings
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    
    if (tool === 'highlighter') {
      ctx.globalAlpha = 0.3;
    } else if (tool === 'marker') {
      ctx.globalAlpha = 0.8;
    } else {
      ctx.globalAlpha = 1;
    }
    
    console.log("DrawingLayer: Updated brush settings:", { 
      tool, 
      color, 
      brushSize, 
      globalCompositeOperation: ctx.globalCompositeOperation,
      globalAlpha: ctx.globalAlpha
    });
  };
  
  useEffect(() => {
    updateBrushStyles();
  }, [tool, color, brushSize]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    updateBrushStyles();
    
    const point = getPoint(e);
    setIsDrawing(true);
    setLastPoint(point);
    
    console.log("DrawingLayer: Started drawing at", point);
    
    // For single click, draw a dot
    ctx.beginPath();
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const currentPoint = getPoint(e);
    
    // Draw line from last point to current point
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    
    setLastPoint(currentPoint);
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    saveDrawing();
    
    console.log("DrawingLayer: Ended drawing");
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onDrawingChange) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    onDrawingChange(dataUrl);
    console.log("DrawingLayer: Saved drawing");
  };

  const getPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Get coordinates relative to canvas
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (onDrawingChange) {
      onDrawingChange('');
    }
    
    if (onClear) {
      onClear();
    }
    
    toast.info("Canvas cleared");
    console.log("DrawingLayer: Canvas cleared");
  };

  return (
    <div 
      className={cn("relative", className)} 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        style={{ 
          width: '100%', 
          height: '100%',
          touchAction: 'none'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      <button
        className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full shadow-md"
        onClick={clearCanvas}
        title="Clear Canvas"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    </div>
  );
}
