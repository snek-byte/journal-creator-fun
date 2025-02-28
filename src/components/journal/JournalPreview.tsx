import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { DrawingLayer } from './DrawingLayer';
import { Sticker } from '@/types/journal';
import { IconContainer } from './IconContainer';
import { useScreenshot } from 'use-react-screenshot';
import { ImageIcon } from 'lucide-react';
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
    setTextOffset({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingText || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - textOffset.x + textPosition.x;
    const y = e.clientY - rect.top - textOffset.y + textPosition.y;

    // Ensure position stays within bounds (0-100%)
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    onTextMove({ x: boundedX, y: boundedY });
    setTextOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    setIsDraggingText(false);
  };

  const handleMouseLeave = () => {
    setIsDraggingText(false);
  };

  return (
    <div className={cn("relative flex-1 overflow-hidden bg-white", className)}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: filter || undefined,
        }}
        onClick={() => onBackgroundSelect('')}
      />

      <div className="relative h-full w-full" ref={previewRef}>
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
              width: `${sticker.size}px`,
              height: `${sticker.size}px`,
              zIndex: 30,
            }}
            draggable={false}
            onMouseDown={(e) => {
              e.stopPropagation();
              let offsetX = e.clientX - e.currentTarget.offsetLeft;
              let offsetY = e.clientY - e.currentTarget.offsetTop;

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
            containerRef={previewRef}
          />
        ))}

        {/* Text Area */}
        <div
          className="absolute z-20 break-words w-[80%] font-normal"
          style={{
            left: `${textPosition.x}%`,
            top: `${textPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            fontFamily: font,
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: fontColor,
            backgroundImage: gradient ? `linear-gradient(${gradient})` : 'none',
            WebkitBackgroundClip: gradient ? 'text' : 'none',
            WebkitTextFillColor: gradient ? 'transparent' : fontColor,
            fontStyle: textStyle?.includes('italic') ? 'italic' : 'normal',
            textDecoration: textStyle?.includes('underline') ? 'underline' : 'none',
            textAlign: textStyle?.includes('center') ? 'center' : 'left',
            cursor: 'move',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {text}
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
          />
        )}
      </div>

      {showPreview && (
        <img
          src={drawing || undefined}
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
