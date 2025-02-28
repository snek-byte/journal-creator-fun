
import { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Point, DrawingLayerProps } from '@/types/drawing';
import { configureBrushStyles, getPointFromEvent, canvasToDataURL } from '@/utils/drawingUtils';
import { drawStroke, drawDot, sprayPaint, floodFill } from './drawing/DrawingTools';
import { DrawingCanvas } from './drawing/DrawingCanvas';
import { ClearButton } from './drawing/ClearButton';

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
  const sprayIntervalRef = useRef<number | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  // Store the current drawing state
  const [currentDrawing, setCurrentDrawing] = useState<string>(initialDrawing || '');

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
    if (initialDrawing && !hasLoaded) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHasLoaded(true);
        setCurrentDrawing(initialDrawing);
      };
      img.src = initialDrawing;
    }
    
    console.log("DrawingLayer: Canvas initialized with dimensions", width, "x", height);
    
    return () => {
      // Clean up spray interval if it exists
      if (sprayIntervalRef.current) {
        window.clearInterval(sprayIntervalRef.current);
      }
    };
    
  }, [width, height, initialDrawing, hasLoaded]);

  // Update brush styles when props change
  const updateBrushStyles = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const settings = configureBrushStyles(ctx, tool, color, brushSize);
    
    console.log("DrawingLayer: Updated brush settings:", settings);
  };
  
  useEffect(() => {
    updateBrushStyles();
  }, [tool, color, brushSize]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    
    updateBrushStyles();
    
    const point = getPointFromEvent(e, canvas);
    setIsDrawing(true);
    setLastPoint(point);
    
    console.log("DrawingLayer: Started drawing at", point);
    
    // Special handling for different tools
    if (tool === 'spray') {
      // Start spray effect
      sprayPaint(ctx, point, brushSize, color);
      
      // Set up an interval to continue spraying while the mouse is down
      sprayIntervalRef.current = window.setInterval(() => {
        sprayPaint(ctx, point, brushSize, color);
      }, 50);
      
      return;
    }
    
    if (tool === 'fill') {
      // Flood fill algorithm
      floodFill(ctx, canvas, point, color);
      saveDrawing();
      return;
    }
    
    // For single click with pen, marker, highlighter - draw a dot
    drawDot(ctx, point, brushSize, tool);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    
    const currentPoint = getPointFromEvent(e, canvas);
    
    // Update spray position if currently spraying
    if (tool === 'spray') {
      setLastPoint(currentPoint);
      return; // Spray effect is handled by the interval
    }
    
    // Draw line from last point to current point
    drawStroke(ctx, lastPoint, currentPoint, tool);
    
    setLastPoint(currentPoint);
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    
    // Save drawing before clearing state
    saveDrawing();
    
    setIsDrawing(false);
    setLastPoint(null);
    
    console.log("DrawingLayer: Ended drawing");
    
    // Clear spray interval if it exists
    if (sprayIntervalRef.current) {
      window.clearInterval(sprayIntervalRef.current);
      sprayIntervalRef.current = null;
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onDrawingChange) return;
    
    // Generate dataURL from canvas
    const dataUrl = canvasToDataURL(canvas);
    
    // Track the current drawing state
    setCurrentDrawing(dataUrl);
    
    // Debug: check if dataUrl is not empty
    console.log("DrawingLayer: Saving drawing, data URL length:", dataUrl.length);
    
    // Send drawing to parent component
    onDrawingChange(dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    setCurrentDrawing('');
    
    if (onDrawingChange) {
      onDrawingChange('');
    }
    
    if (onClear) {
      onClear();
    }
    
    toast.info("Canvas cleared");
    console.log("DrawingLayer: Canvas cleared");
  };

  // Ensure drawing is saved when component unmounts
  useEffect(() => {
    return () => {
      if (isDrawing) {
        saveDrawing();
      }
    };
  }, [isDrawing]);

  // Add continuous drawing capture
  useEffect(() => {
    const captureInterval = setInterval(() => {
      if (isDrawing) {
        saveDrawing();
      }
    }, 1000); // Save every second while drawing

    return () => clearInterval(captureInterval);
  }, [isDrawing]);

  return (
    <div 
      className={cn("relative", className)} 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <DrawingCanvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      <ClearButton onClick={clearCanvas} />
    </div>
  );
}
