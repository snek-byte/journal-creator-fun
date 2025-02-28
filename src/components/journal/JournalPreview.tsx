
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { DrawingLayer } from './DrawingLayer';
import { Sticker } from '@/types/journal';
import { IconContainer } from './IconContainer';
import { useScreenshot } from 'use-react-screenshot';
import type { Icon } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';

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
  onStickerSelect: (id: string | null) => void;
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
  onStickerSelect,
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
  const textRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(500);
  const [previewHeight, setPreviewHeight] = useState(500);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [startTextPos, setStartTextPos] = useState({ x: 50, y: 50 });
  const [image, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });

  // Journal page styles
  const journalPageStyle = {
    backgroundColor: '#fff',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px', 
    width: '100%',
    height: '100%',
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  };

  // Initialize text position to center of the page
  useEffect(() => {
    if (!textPosition || (textPosition.x === 0 && textPosition.y === 0)) {
      onTextMove({ x: 50, y: 50 });
    }
  }, []);

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

  // Set up global mouse move and up handlers for text dragging
  useEffect(() => {
    if (!isDraggingText) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const rect = previewRef.current.getBoundingClientRect();
      const deltaX = (e.clientX - startDragPos.x) / rect.width * 100;
      const deltaY = (e.clientY - startDragPos.y) / rect.height * 100;
      
      // Calculate new position by adding the delta to the start position
      let newX = startTextPos.x + deltaX;
      let newY = startTextPos.y + deltaY;
      
      // Ensure position stays within bounds
      newX = Math.max(5, Math.min(95, newX));
      newY = Math.max(5, Math.min(95, newY));
      
      onTextMove({ x: newX, y: newY });
    };

    const handleGlobalMouseUp = () => {
      setIsDraggingText(false);
      
      if (textRef.current) {
        textRef.current.style.cursor = 'grab';
      }
      
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingText, startDragPos, startTextPos, onTextMove]);

  const handleIconSelect = (id: string) => {
    setSelectedIconId(id);
    setSelectedStickerId(null);
    onIconSelect(id);
    onStickerSelect(null);
  };

  const handleStickerSelect = (id: string) => {
    console.log(`handleStickerSelect in JournalPreview: ${id}`);
    setSelectedStickerId(id);
    onStickerSelect(id);
    setSelectedIconId(null);
    onIconSelect('');
  };

  // Simplified text drag start handler
  const handleTextDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (textRef.current) {
      textRef.current.style.cursor = 'grabbing';
    }
    
    document.body.style.cursor = 'grabbing';
    
    setIsDraggingText(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setStartTextPos({ x: textPosition.x, y: textPosition.y });
    
    console.log("Text drag started", { 
      mousePos: { x: e.clientX, y: e.clientY },
      textPos: textPosition
    });
  };

  // This stops the general page click from affecting text position
  const handlePageClick = (e: React.MouseEvent) => {
    // Only deselect items if clicking on the background, not on any specific element
    if (e.target === e.currentTarget || (e.target as HTMLElement).className.includes('journal-page')) {
      setSelectedStickerId(null);
      setSelectedIconId(null);
      onIconSelect('');
      onStickerSelect(null);
    }
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  // Function to process text and apply special Unicode text styles
  const processText = (text: string) => {
    // Handle special style transformations from the utility
    if (textStyle && textStyle !== 'normal' && !textStyle.includes(' ')) {
      // Type assertion to ensure textStyle is treated as a valid TextStyle
      // This is safe assuming the textStyle values are controlled by our app
      return applyTextStyle(text, textStyle as TextStyle);
    }
    
    // Return regular text if no special transformation is needed
    return text;
  };

  // Function to handle sticker dragging
  const handleStickerDrag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const sticker = stickers.find(s => s.id === id);
    if (!sticker || !previewRef.current) return;
    
    // Calculate the offsets relative to the sticker's position
    const containerRect = previewRef.current.getBoundingClientRect();
    const stickerLeftPos = (sticker.position.x / 100) * containerRect.width;
    const stickerTopPos = (sticker.position.y / 100) * containerRect.height;
    
    const offsetX = e.clientX - containerRect.left - stickerLeftPos;
    const offsetY = e.clientY - containerRect.top - stickerTopPos;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const containerRect = previewRef.current.getBoundingClientRect();
      
      // Calculate new position as a percentage of the container
      const x = ((e.clientX - containerRect.left - offsetX) / containerRect.width) * 100;
      const y = ((e.clientY - containerRect.top - offsetY) / containerRect.height) * 100;
      
      // Ensure position stays within bounds (0-100%)
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));
      
      onStickerMove(id, { x: boundedX, y: boundedY });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Check if the gradient string indicates it's a text gradient
  const isTextGradient = gradient && gradient.includes('text');

  // Function to determine if backgroundImage is a URL or a gradient
  const isGradientBackground = backgroundImage && backgroundImage.includes('linear-gradient');

  return (
    <div className={cn("relative flex-1 overflow-hidden bg-gray-50", className)}>
      <div className="absolute inset-0 flex items-center justify-center" onClick={handlePageClick}>
        {/* Journal page with proper styling */}
        <div style={journalPageStyle} className="journal-page">
          {/* Background image layer */}
          {backgroundImage && !isGradientBackground && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: backgroundImage.includes('http') ? `url(${backgroundImage})` : backgroundImage,
                backgroundColor: backgroundImage.includes('placehold.co') ? backgroundImage.split('/')[3] : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: filter || undefined,
                zIndex: 1,
                border: '1px solid #e0e0e0'
              }}
              className="journal-page"
            />
          )}
          
          {/* Gradient background layer */}
          {backgroundImage && isGradientBackground && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: backgroundImage,
                opacity: 0.9,
                zIndex: 1
              }}
              className="journal-page"
            />
          )}

          <div className="relative h-full w-full z-10 journal-page" ref={previewRef}>
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

            {/* Text Area - Simplified dragging with improved indicators */}
            <div
              ref={textRef}
              className="absolute z-30 break-words w-[80%] font-normal cursor-grab p-4 rounded-md hover:bg-gray-50/10 border border-transparent hover:border-gray-200/20"
              style={{
                left: `${textPosition.x}%`,
                top: `${textPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: font || 'inherit',
                fontSize: fontSize || 'inherit',
                fontWeight: fontWeight || 'inherit',
                color: isTextGradient ? 'transparent' : (fontColor || 'inherit'),
                background: isTextGradient ? gradient.replace(' text', '') : 'none',
                WebkitBackgroundClip: isTextGradient ? 'text' : 'unset',
                WebkitTextFillColor: isTextGradient ? 'transparent' : 'unset',
                fontStyle: textStyle?.includes('italic') ? 'italic' : 'normal',
                textDecoration: textStyle?.includes('underline') ? 'underline' : 'none',
                textAlign: textStyle?.includes('center') ? 'center' : 'left',
                minHeight: '2em', // Ensure text area is always visible
                minWidth: '100px',
                maxHeight: '80%', // Prevent text from extending too far
                overflow: 'visible', // Allow text to flow outside if needed
                opacity: isDraggingText ? 0.8 : 1, // Visual feedback when dragging
                boxShadow: isDraggingText ? '0 0 10px rgba(0,0,0,0.1)' : 'none',
                transition: 'box-shadow 0.1s, opacity 0.1s',
                userSelect: 'none',
                touchAction: 'none',
              }}
              onMouseDown={handleTextDragStart}
              onClick={(e) => {
                e.stopPropagation();
                // Deselect any selected sticker or icon when clicking on text
                setSelectedStickerId(null);
                setSelectedIconId(null);
                onIconSelect('');
                onStickerSelect(null);
              }}
            >
              {processText(text) || 'Start typing to add text...'}
            </div>

            {/* Stickers */}
            {stickers && stickers.map((sticker) => (
              <div
                key={sticker.id}
                className={`absolute cursor-move ${
                  selectedStickerId === sticker.id ? 'border-2 border-primary z-40' : 'z-30'
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
                  handleStickerSelect(sticker.id);
                  handleStickerDrag(sticker.id, e);
                }}
                tabIndex={0} // Make focusable for keyboard events
                title={`Sticker (ID: ${sticker.id})`}
              >
                <img
                  src={sticker.url}
                  alt="Sticker"
                  className="w-full h-full object-contain"
                  draggable={false}
                  onError={(e) => {
                    console.error(`Failed to load sticker image: ${sticker.url}`);
                    e.currentTarget.src = '/stickers/star.svg';
                  }}
                />
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
      </div>
    </div>
  );
}
