
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
  const sprayIntervalRef = useRef<number | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

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
    
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    
    // Different line widths based on tool
    if (tool === 'pen') {
      ctx.lineWidth = brushSize;
    } else if (tool === 'marker') {
      ctx.lineWidth = brushSize * 2; // Marker is thicker
    } else if (tool === 'highlighter') {
      ctx.lineWidth = brushSize * 3; // Highlighter is even thicker
    } else if (tool === 'eraser') {
      ctx.lineWidth = brushSize * 2.5; // Eraser is also thicker
    } else {
      ctx.lineWidth = brushSize;
    }
    
    // Special tool settings
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      
      // Different opacity based on tool
      if (tool === 'highlighter') {
        ctx.globalAlpha = 0.3;
      } else if (tool === 'marker') {
        ctx.globalAlpha = 0.7; // Marker is semi-transparent
      } else if (tool === 'pen') {
        ctx.globalAlpha = 1; // Pen is fully opaque
      } else {
        ctx.globalAlpha = 1;
      }
    }
    
    console.log("DrawingLayer: Updated brush settings:", { 
      tool, 
      color, 
      brushSize, 
      lineWidth: ctx.lineWidth,
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
    
    // Special handling for different tools
    if (tool === 'spray') {
      // Start spray effect
      spray(point);
      
      // Set up an interval to continue spraying while the mouse is down
      sprayIntervalRef.current = window.setInterval(() => {
        spray(point);
      }, 50);
      
      return;
    }
    
    if (tool === 'fill') {
      // Flood fill algorithm
      floodFill(point);
      saveDrawing();
      return;
    }
    
    // For single click with pen, marker, highlighter - draw a dot
    ctx.beginPath();
    
    if (tool === 'marker') {
      // Marker makes a slightly larger, more rounded dot
      ctx.arc(point.x, point.y, brushSize, 0, Math.PI * 2);
    } else {
      ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    }
    
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const currentPoint = getPoint(e);
    
    // Update spray position if currently spraying
    if (tool === 'spray') {
      setLastPoint(currentPoint);
      return; // Spray effect is handled by the interval
    }
    
    // Draw line from last point to current point
    if (tool === 'marker') {
      // Marker uses quadratic curves for smoother effect
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      
      const midPoint = {
        x: (lastPoint.x + currentPoint.x) / 2,
        y: (lastPoint.y + currentPoint.y) / 2
      };
      
      ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
      ctx.stroke();
      
      // Start a new path for the next segment
      ctx.beginPath();
      ctx.moveTo(midPoint.x, midPoint.y);
    } else {
      // Standard drawing for pen and other tools
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    }
    
    setLastPoint(currentPoint);
  };

  const spray = (point: Point) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const density = brushSize * 5; // How many particles to spray
    const radius = brushSize * 2;  // Spray radius
    
    ctx.fillStyle = color;
    
    // Draw random dots inside the radius
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * radius * 2;
      const offsetY = (Math.random() - 0.5) * radius * 2;
      
      // Only draw inside the circle
      if (offsetX * offsetX + offsetY * offsetY <= radius * radius) {
        ctx.beginPath();
        ctx.arc(point.x + offsetX, point.y + offsetY, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const floodFill = (point: Point) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    // Get image data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Get the color of the clicked pixel
    const targetX = Math.floor(point.x);
    const targetY = Math.floor(point.y);
    const targetIndex = (targetY * canvas.width + targetX) * 4;
    
    // Extract target RGBA
    const targetR = data[targetIndex];
    const targetG = data[targetIndex + 1];
    const targetB = data[targetIndex + 2];
    const targetA = data[targetIndex + 3];
    
    // Parse the fill color
    const fillColorMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (!fillColorMatch) return;
    
    const fillR = parseInt(fillColorMatch[1], 16);
    const fillG = parseInt(fillColorMatch[2], 16);
    const fillB = parseInt(fillColorMatch[3], 16);
    const fillA = 255;
    
    // Check if target color is the same as fill color
    if (
      targetR === fillR &&
      targetG === fillG &&
      targetB === fillB &&
      targetA === fillA
    ) {
      return; // No need to fill with the same color
    }
    
    // Queue for flood fill algorithm (x, y coordinates)
    const queue: [number, number][] = [[targetX, targetY]];
    const visited = new Set<string>(); // Track visited pixels
    
    // Process the queue
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const pixelKey = `${x},${y}`;
      
      // Skip if out of bounds or already visited
      if (
        x < 0 || x >= canvas.width ||
        y < 0 || y >= canvas.height ||
        visited.has(pixelKey)
      ) {
        continue;
      }
      
      // Get current pixel index
      const index = (y * canvas.width + x) * 4;
      
      // Check if the color matches the target color
      if (
        Math.abs(data[index] - targetR) <= 10 &&
        Math.abs(data[index + 1] - targetG) <= 10 &&
        Math.abs(data[index + 2] - targetB) <= 10 &&
        Math.abs(data[index + 3] - targetA) <= 10
      ) {
        // Set the color to the fill color
        data[index] = fillR;
        data[index + 1] = fillG;
        data[index + 2] = fillB;
        data[index + 3] = fillA;
        
        // Mark pixel as visited
        visited.add(pixelKey);
        
        // Add adjacent pixels to the queue
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }
    
    // Update the canvas with the filled area
    ctx.putImageData(imageData, 0, 0);
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Save the drawing BEFORE resetting states
    saveDrawing();
    
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
    
    const dataUrl = canvas.toDataURL('image/png');
    
    // Debug: check if dataUrl is not empty
    console.log("DrawingLayer: Saving drawing, data URL length:", dataUrl.length);
    
    onDrawingChange(dataUrl);
  };

  const getPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale ratios in case the canvas is stretched
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
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
    
    // Get coordinates relative to canvas and adjust for scaling
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
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
