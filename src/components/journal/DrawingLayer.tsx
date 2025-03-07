import React, { useRef, useEffect, useState } from 'react';
import { DrawingCanvas } from './drawing/DrawingCanvas';
import { ClearButton } from './drawing/ClearButton';
import { Point } from '@/types/drawing';
import { DrawingLayerProps } from '@/types/drawing';

export function DrawingLayer({
  className,
  width = 500,
  height = 500,
  onDrawingChange = () => {},
  tool = 'pen',
  color = '#000000',
  brushSize = 3,
  initialDrawing,
  onClear,
}: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<Point | null>(null);
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    if (initialDrawing && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.src = initialDrawing;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          setHasDrawing(true);
        };
      }
    }
  }, [initialDrawing, width, height]);

  const handleDrawing = (x: number, y: number) => {
    if (!drawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    if (lastPosition) {
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setLastPosition({ x, y });
    setHasDrawing(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDrawing(true);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setLastPosition({ x, y });
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setLastPosition(null);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onDrawingChange(dataUrl);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    handleDrawing(x, y);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canvasRef.current) return;
    setDrawing(true);
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setLastPosition({ x, y });
  };

  const handleTouchEnd = () => {
    setDrawing(false);
    setLastPosition(null);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onDrawingChange(dataUrl);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canvasRef.current) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    handleDrawing(x, y);
  };

  const handleClearCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    setHasDrawing(false);
    
    const emptyDataUrl = canvasRef.current.toDataURL('image/png');
    onDrawingChange('');
    
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`relative ${className || ''}`}>
      <DrawingCanvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      {hasDrawing && <ClearButton onClick={handleClearCanvas} />}
    </div>
  );
}
