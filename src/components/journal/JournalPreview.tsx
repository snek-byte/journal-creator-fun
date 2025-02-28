
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { DrawingLayer } from './DrawingLayer';
import { Sticker } from '@/types/journal';
import { IconContainer } from './IconContainer';
import { useScreenshot } from 'use-react-screenshot';
import type { Icon } from '@/types/journal';
import { applyTextStyle } from '@/utils/unicodeTextStyles';

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
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(500);
  const [previewHeight, setPreviewHeight] = useState(500);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [textOffset, setTextOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizingStickerId, setResizingStickerId] = useState<string | null>(null);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
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

  // Handle keyboard delete for stickers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedStickerId && (e.key === 'Delete' || e.key === 'Backspace')) {
        console.log("Delete key pressed for sticker:", selectedStickerId);
        onStickerMove(selectedStickerId, { x: -999, y: -999 });
        setSelectedStickerId(null);
      }
    };

    if (selectedStickerId) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedStickerId, onStickerMove]);

  const handleIconSelect = (id: string) => {
    setSelectedIconId(id);
    setSelectedStickerId(null);
    onIconSelect(id);
  };

  const handleStickerSelect = (id: string) => {
    setSelectedStickerId(id);
    setSelectedIconId(null);
    onIconSelect(''); // Deselect any icon
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
    if (isResizing) {
      setIsResizing(false);
      setResizingStickerId(null);
    }
  };

  const handleMouseLeave = () => {
    setIsDraggingText(false);
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  // Start resizing a sticker
  const handleResizeStart = (e: React.MouseEvent, sticker: Sticker) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizingStickerId(sticker.id);
    setInitialSize({ width: sticker.width || 100, height: sticker.height || 100 });
    setInitialMousePos({ x: e.clientX, y: e.clientY });
  };

  // Handle resizing during mouse move
  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !resizingStickerId || !previewRef.current) return;

    const sticker = stickers.find(s => s.id === resizingStickerId);
    if (!sticker) return;

    const deltaX = e.clientX - initialMousePos.x;
    const deltaY = e.clientY - initialMousePos.y;
    const scale = Math.max(deltaX, deltaY) / 100; // Simplified scaling logic
    
    const newWidth = Math.max(30, initialSize.width + (initialSize.width * scale));
    const newHeight = Math.max(30, initialSize.height + (initialSize.height * scale));

    // Update sticker size
    const updatedStickers = stickers.map(s => 
      s.id === resizingStickerId 
        ? { ...s, width: newWidth, height: newHeight } 
        : s
    );

    // Send the updated sticker to the parent component
    onStickerAdd({
      ...sticker,
      width: newWidth,
      height: newHeight
    });
  };

  // Setup global mouse move handler for resizing
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizingStickerId, initialSize, initialMousePos]);

  // Function to process text and apply special Unicode text styles
  const processText = (text: string) => {
    // Handle special style transformations from the utility
    if (textStyle && textStyle !== 'normal' && !textStyle.includes(' ')) {
      return applyTextStyle(text, textStyle);
    }
    
    // Return regular text if no special transformation is needed
    return text;
  };

  return (
    <div className={cn("relative flex-1 overflow-hidden bg-white", className)}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: backgroundImage 
            ? `url(${backgroundImage})` 
            : gradient 
              ? gradient 
              : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: filter && filter !== 'none' ? filter : undefined,
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
        {stickers && stickers.map((sticker) => (
          <div
            key={sticker.id}
            className={`absolute cursor-move ${
              selectedStickerId === sticker.id ? 'ring-2 ring-primary z-50' : 'hover:ring-1 hover:ring-primary/30 z-30'
            }`}
            style={{
              left: `${sticker.position.x}%`,
              top: `${sticker.position.y}%`,
              transform: 'translate(-50%, -50%)',
              width: `${sticker.width || 100}px`,
              height: `${sticker.height || 100}px`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleStickerSelect(sticker.id);
            }}
            onMouseDown={(e) => {
              if (selectedStickerId === sticker.id) {
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
              }
            }}
            tabIndex={0} // Make focusable for keyboard events
          >
            <img
              src={sticker.url}
              alt="Sticker"
              className="w-full h-full object-contain"
              draggable={false}
            />
            
            {/* Resize handle - only shown when sticker is selected */}
            {selectedStickerId === sticker.id && (
              <div
                className="absolute bottom-0 right-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center cursor-se-resize"
                onMouseDown={(e) => handleResizeStart(e, sticker)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                  <path d="M18 21h-6"></path>
                  <path d="M3 6v6"></path>
                  <path d="M3 3v.01"></path>
                  <path d="M21 21v.01"></path>
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Icons */}
        {icons && icons.map((icon) => (
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
            backgroundImage: gradient ? gradient : 'none',
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
          onClick={() => {
            // Deselect any selected sticker or icon when clicking on text
            setSelectedStickerId(null);
            setSelectedIconId(null);
            onIconSelect('');
          }}
        >
          {processText(text) || 'Start typing to add text...'}
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
