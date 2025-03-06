
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
  width = 800, 
  height = 600, 
  onDrawingChange,
  tool = 'pen',
  color = '#000000',
  brushSize = 3,
  initialDrawing,
  onClear,
  isDrawingMode = false,
}: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sprayIntervalRef = useRef<number | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Force regenerate the dataURL when we need to
  const forceUpdate = useRef<boolean>(false);
  const initialDrawingRef = useRef<string | undefined>(initialDrawing);
  const previousInitialDrawing = useRef<string | undefined>(initialDrawing);
  
  // Track the last used tool to detect changes
  const lastToolRef = useRef<string>(tool);
  const lastColorRef = useRef<string>(color);
  const lastBrushSizeRef = useRef<number>(brushSize);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log("DrawingLayer: Initializing canvas with width:", width, "height:", height);
    console.log("DrawingLayer: Initial drawing available:", !!initialDrawing);

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
    
    // Update initialDrawingRef
    initialDrawingRef.current = initialDrawing;
    
    // Load initial drawing if provided
    if (initialDrawing) {
      console.log("DrawingLayer: Loading initial drawing");
      loadDrawingToCanvas(initialDrawing);
    }
    
    console.log("DrawingLayer: Canvas initialized with dimensions", width, "x", height);
    
    return () => {
      // Clean up spray interval if it exists
      if (sprayIntervalRef.current) {
        window.clearInterval(sprayIntervalRef.current);
      }
      
      // Save one final time when unmounting
      if (canvas) {
        const finalDrawing = canvasToDataURL(canvas);
        if (onDrawingChange && finalDrawing.length > 1000) {
          console.log("DrawingLayer: Saving final drawing on unmount");
          onDrawingChange(finalDrawing);
        }
      }
    };
  }, [width, height, initialDrawing, onDrawingChange]);

  // Helper function to load drawing to canvas
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

  // Effect to handle initialDrawing changes
  useEffect(() => {
    if (initialDrawing !== previousInitialDrawing.current) {
      console.log("DrawingLayer: initialDrawing changed, updating canvas");
      loadDrawingToCanvas(initialDrawing || '');
    }
  }, [initialDrawing]);

  // Update brush styles when props change, but preserve drawing
  useEffect(() => {
    // Store the current canvas state if a tool/color/size change is detected
    if (lastToolRef.current !== tool || 
        lastColorRef.current !== color || 
        lastBrushSizeRef.current !== brushSize) {
      
      // Log the tool change
      console.log("DrawingLayer: Tool or style changed from", 
                 lastToolRef.current, "to", tool);
      
      // Update last used tool/color/size
      lastToolRef.current = tool;
      lastColorRef.current = color;
      lastBrushSizeRef.current = brushSize;
      
      // Apply the new brush styles
      updateBrushStyles();
    }
  }, [tool, color, brushSize]);

  // Update brush styles
  const updateBrushStyles = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const settings = configureBrushStyles(ctx, tool, color, brushSize);
    
    console.log("DrawingLayer: Updated brush settings:", settings);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    // Skip if drawing mode is disabled
    if (!isDrawingMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    
    // Always ensure brush settings are applied before drawing
    updateBrushStyles();
    
    const point = getPointFromEvent(e, canvas);
    setIsDrawing(true);
    setLastPoint(point);
    
    console.log("DrawingLayer: Started drawing at", point, "with tool:", tool);
    
    // Special handling for different tools
    if (tool === 'spray') {
      // Start spray effect
      sprayPaint(ctx, point, brushSize, color);
      
      // Set up an interval to continue spraying while the mouse is down
      sprayIntervalRef.current = window.setInterval(() => {
        sprayPaint(ctx, point, brushSize, color);
      }, 50);
      
      // Save drawing state for spray tool
      forceUpdate.current = true;
      saveDrawing();
      return;
    }
    
    if (tool === 'fill') {
      // Flood fill algorithm
      floodFill(ctx, canvas, point, color);
      forceUpdate.current = true;
      saveDrawing();
      return;
    }
    
    // For single click with pen, marker, highlighter - draw a dot
    drawDot(ctx, point, brushSize, tool);
    
    // Save drawing immediately after drawing a dot
    forceUpdate.current = true;
    saveDrawing();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    // Skip if drawing mode is disabled
    if (!isDrawingMode) return;
    
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
    
    // Indicate we've made changes
    forceUpdate.current = true;
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    
    // Save drawing before clearing state
    forceUpdate.current = true;
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
    
    // Debug: check if dataUrl is not empty
    console.log("DrawingLayer: Saving drawing, data URL length:", dataUrl.length);
    
    // Only send if it's not an empty canvas or if we've made new changes
    if (dataUrl.length > 1000 || forceUpdate.current) {
      // Update the reference to the current drawing
      previousInitialDrawing.current = dataUrl;
      
      // Send drawing to parent component
      onDrawingChange(dataUrl);
      console.log("DrawingLayer: Drawing sent to parent");
      forceUpdate.current = false;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset drawing references
    previousInitialDrawing.current = '';
    initialDrawingRef.current = '';
    
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
      if (isDrawing && forceUpdate.current) {
        saveDrawing();
      }
    }, 300); // Save more frequently (300ms) while drawing

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
      {isDrawingMode && <ClearButton onClick={clearCanvas} />}
    </div>
  );
}
