
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { DrawingLayer } from './DrawingLayer';
import { Sticker } from '@/types/journal';
import { IconContainer } from './IconContainer';
import { useScreenshot } from 'use-react-screenshot';
import type { Icon } from '@/types/journal';

interface JournalPreviewProps {
  className?: string;
  showPreview: boolean;
  text: string;
  mood?: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle: string;
  stickers: Sticker[];
  icons: Icon[];
  textPosition: { x: number; y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
  onStickerAdd: (sticker: Sticker) => void;
  onIconAdd: (icon: Icon) => void;
  onStickerMove: (id: string, position: { x: number; y: number }) => void;
  onIconMove: (id: string, position: { x: number; y: number }) => void;
  onIconUpdate: (id: string, updates: Partial<Icon>) => void;
  onIconSelect: (id: string) => void;
  onTextMove: (position: { x: number; y: number }) => void;
  onBackgroundSelect: (image: string) => void;
  onDrawingChange: (dataUrl: string) => void;
  onFilterChange: (filter: string) => void;
  onTogglePreview: () => void;
  drawingTool?: string;
  drawingColor?: string;
  brushSize?: number;
}

export function JournalPreview({
  className,
  showPreview,
  text,
  mood,
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  textStyle,
  stickers,
  icons,
  textPosition,
  backgroundImage,
  drawing,
  filter,
  onStickerAdd,
  onIconAdd,
  onStickerMove,
  onIconMove,
  onIconUpdate,
  onIconSelect,
  onTextMove,
  onBackgroundSelect,
  onDrawingChange,
  onFilterChange,
  onTogglePreview,
  drawingTool = 'pen',
  drawingColor = '#000000',
  brushSize = 3
}: JournalPreviewProps) {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(500);
  const [previewHeight, setPreviewHeight] = useState(500);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [textOffset, setTextOffset] = useState({ x: 0, y: 0 });
  const [image, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });

  useEffect(() => {
    if (!previewRef.current) return;

    const handleResize = () => {
      if (!previewRef.current) return;
      const width = previewRef.current.offsetWidth;
      const height = previewRef.current.offsetHeight;
      setPreviewWidth(width);
      setPreviewHeight(height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (drawing) {
      setIsDrawingMode(true);
    }
  }, [drawing]);

  const handleIconSelect = (id: string) => {
    setSelectedIconId(id);
    onIconSelect(id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingText(true);
    setTextOffset({ x: e.clientX - textPosition.x, y: e.clientY - textPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingText || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Ensure position stays within bounds (0-100%)
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    onTextMove({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDraggingText(false);
  };

  const handleMouseLeave = () => {
    setIsDraggingText(false);
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  return (
    <div className={cn("relative flex-1 overflow-hidden bg-white", className)}>
      <div
        className="absolute inset-0 z-0 bg-white"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: filter || undefined,
        }}
      />

      <div className="relative h-full w-full" ref={previewRef}>
        {/* Control overlay buttons */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button
            onClick={toggleDrawingMode}
            className={`p-2 rounded-full ${isDrawingMode ? 'bg-primary text-white' : 'bg-gray-100'}`}
            title={isDrawingMode ? "Exit Drawing Mode" : "Enter Drawing Mode"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <path d="M11 11l5 5"></path>
            </svg>
          </button>
        </div>

        {/* Stickers */}
        {stickers.map((sticker) => (
          <img
            key={sticker.id}
            src={sticker.url}
            alt="Sticker"
            className="absolute cursor-move"
            style={{
              left: `${sticker.position.x}%`,
              top: `${sticker.position.y}%`,
              transform: 'translate(-50%, -50%)',
              width: `${sticker.width || 48}px`,
              height: `${sticker.height || 48}px`,
              zIndex: 30,
            }}
            draggable={false}
            onMouseDown={(e) => {
              e.stopPropagation();
              let offsetX = e.clientX - (sticker.position.x / 100) * previewRef.current!.offsetWidth;
              let offsetY = e.clientY - (sticker.position.y / 100) * previewRef.current!.offsetHeight;

              const handleMouseMove = (e: MouseEvent) => {
                if (!previewRef.current) return;
                const containerRect = previewRef.current.getBoundingClientRect();
                const x = ((e.clientX - offsetX - containerRect.left) / containerRect.width) * 100;
                const y = ((e.clientY - offsetY - containerRect.top) / containerRect.height) * 100;

                // Ensure position stays within bounds (0-100%)
                const boundedX = Math.max(0, Math.min(100, x));
                const boundedY = Math.max(0, Math.min(100, y));

                onStickerMove(sticker.id, { x: boundedX, y: boundedY });
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        ))}

        {/* Icons */}
        {icons.map((icon) => (
          <IconContainer
            key={icon.id}
            icon={icon}
            selected={selectedIconId === icon.id}
            onSelect={handleIconSelect}
            onMove={onIconMove}
            onUpdate={onIconUpdate}
            containerRef={previewRef}
          />
        ))}

        {/* Text Area */}
        <div
          className="absolute z-20 break-words w-[80%] font-normal cursor-move"
          style={{
            left: `${textPosition.x}%`,
            top: `${textPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            fontFamily: font || 'inherit',
            fontSize: fontSize || 'inherit',
            fontWeight: fontWeight || 'inherit',
            color: fontColor || 'inherit',
            backgroundImage: gradient ? `${gradient}` : 'none',
            WebkitBackgroundClip: gradient ? 'text' : 'unset',
            WebkitTextFillColor: gradient ? 'transparent' : 'unset',
            fontStyle: textStyle?.includes('italic') ? 'italic' : 'normal',
            textDecoration: textStyle?.includes('underline') ? 'underline' : 'none',
            textAlign: textStyle?.includes('center') ? 'center' : 'left',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {text || 'Start typing to add text...'}
        </div>
      
        {/* Drawing Layer */}
        {isDrawingMode && (
          <DrawingLayer
            width={previewWidth}
            height={previewHeight}
            onDrawingChange={onDrawingChange}
            tool={drawingTool}
            color={drawingColor}
            brushSize={brushSize}
            initialDrawing={drawing}
          />
        )}
      </div>

      {/* Display existing drawing */}
      {drawing && !isDrawingMode && (
        <img
          src={drawing}
          alt="Drawing"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  );
}
