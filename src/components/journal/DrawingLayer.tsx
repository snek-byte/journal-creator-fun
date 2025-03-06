import { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { Point, DrawingLayerProps } from '@/types/drawing';
import { configureBrushStyles, getPointFromEvent, canvasToDataURL } from '@/utils/drawingUtils';
import { drawStroke, drawDot, sprayPaint, floodFill } from './drawing/DrawingTools';
import { DrawingCanvas } from './drawing/DrawingCanvas';

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
  
  const forceUpdate = useRef<boolean>(false);
  const initialDrawingRef = useRef<string | undefined>(initialDrawing);
  const previousInitialDrawing = useRef<string | undefined>(initialDrawing);
  
  const lastToolRef = useRef<string>(tool);
  const lastColorRef = useRef<string>(color);
  const lastBrushSizeRef = useRef<number>(brushSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log("DrawingLayer: Initializing canvas with width:", width, "height:", height);
    console.log("DrawingLayer: Initial drawing available:", !!initialDrawing);

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    initialDrawingRef.current = initialDrawing;
    
    if (initialDrawing) {
      console.log("DrawingLayer: Loading initial drawing");
      loadDrawingToCanvas(initialDrawing);
    }
    
    console.log("DrawingLayer: Canvas initialized with dimensions", width, "x", height);
    
    return () => {
      if (sprayIntervalRef.current) {
        window.clearInterval(sprayIntervalRef.current);
      }
      
      if (canvas) {
        const finalDrawing = canvas.toDataURL('image/png');
        if (onDrawingChange && finalDrawing.length > 1000) {
          console.log("DrawingLayer: Saving final drawing on unmount");
          onDrawingChange(finalDrawing);
        }
      }
    };
  }, [width, height]);

  const loadDrawingToCanvas = (drawingDataUrl: string) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !drawingDataUrl) return;

    const img = new Image();
    img.onload = () => {
      if (ctxRef.current) {
        ctxRef.current.drawImage(img, 0, 0);
        console.log("DrawingLayer: Drawing loaded successfully");
        setHasLoaded(true);
        previousInitialDrawing.current = drawingDataUrl;
      }
    };
    img.onerror = (err) => {
      console.error("DrawingLayer: Error loading drawing:", err);
    };
    img.src = drawingDataUrl;
  };

  useEffect(() => {
    if (initialDrawing !== previousInitialDrawing.current) {
      console.log("DrawingLayer: initialDrawing changed, updating canvas");
      loadDrawingToCanvas(initialDrawing || '');
    }
  }, [initialDrawing]);

  useEffect(() => {
    if (lastToolRef.current !== tool || 
        lastColorRef.current !== color || 
        lastBrushSizeRef.current !== brushSize) {
      
      console.log("DrawingLayer: Tool or style changed from", 
                 lastToolRef.current, "to", tool);
      
      lastToolRef.current = tool;
      lastColorRef.current = color;
      lastBrushSizeRef.current = brushSize;
      
      updateBrushStyles();
    }
  }, [tool, color, brushSize]);

  const updateBrushStyles = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const settings = configureBrushStyles(ctx, tool, color, brushSize);
    
    console.log("DrawingLayer: Updated brush settings:", settings);
  };

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
    
    console.log("DrawingLayer: Started drawing at", point, "with tool:", tool);
    
    if (tool === 'spray') {
      sprayPaint(ctx, point, brushSize, color);
      
      sprayIntervalRef.current = window.setInterval(() => {
        sprayPaint(ctx, point, brushSize, color);
      }, 50);
      
      forceUpdate.current = true;
      saveDrawing();
      return;
    }
    
    if (tool === 'fill') {
      floodFill(ctx, canvas, point, color);
      forceUpdate.current = true;
      saveDrawing();
      return;
    }
    
    drawDot(ctx, point, brushSize, tool);
    
    forceUpdate.current = true;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    
    const currentPoint = getPointFromEvent(e, canvas);
    
    if (tool === 'spray') {
      setLastPoint(currentPoint);
      return;
    }
    
    drawStroke(ctx, lastPoint, currentPoint, tool);
    
    setLastPoint(currentPoint);
    
    forceUpdate.current = true;
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    
    forceUpdate.current = true;
    saveDrawing();
    
    setIsDrawing(false);
    setLastPoint(null);
    
    console.log("DrawingLayer: Ended drawing");
    
    if (sprayIntervalRef.current) {
      window.clearInterval(sprayIntervalRef.current);
      sprayIntervalRef.current = null;
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onDrawingChange) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    
    console.log("DrawingLayer: Saving drawing, data URL length:", dataUrl.length);
    
    if (dataUrl.length > 1000 || forceUpdate.current) {
      previousInitialDrawing.current = dataUrl;
      
      onDrawingChange(dataUrl);
      console.log("DrawingLayer: Drawing sent to parent");
      forceUpdate.current = false;
    }
  };

  const clearCanvas = () => {
    console.log("DrawingLayer: clearCanvas called");
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      console.error("Canvas or context is null in clearCanvas");
      return;
    }
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    console.log("DrawingLayer: Canvas cleared successfully");
    
    previousInitialDrawing.current = '';
    initialDrawingRef.current = '';
    
    if (onDrawingChange) {
      console.log("DrawingLayer: Notifying parent of cleared canvas");
      onDrawingChange('');
    }
    
    if (onClear) {
      console.log("DrawingLayer: Calling onClear callback");
      onClear();
    }
    
    forceUpdate.current = true;
    saveDrawing();
  };

  useEffect(() => {
    return () => {
      if (isDrawing) {
        saveDrawing();
      }
    };
  }, [isDrawing]);

  useEffect(() => {
    const captureInterval = setInterval(() => {
      if (isDrawing && forceUpdate.current) {
        saveDrawing();
      }
    }, 300);
    
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
    </div>
  );
}
