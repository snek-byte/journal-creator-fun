
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { DrawingLayer } from './DrawingLayer';
import { Sticker } from '@/types/journal';
import { IconContainer } from './IconContainer';
import { StickerContainer } from './StickerContainer';
import { useScreenshot } from 'use-react-screenshot';
import type { Icon } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { toast } from "sonner";

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
  onTextDragStart: () => void;
  onTextDragEnd: () => void;
  onBackgroundSelect: (image: string) => void;
  onDrawingChange: (dataUrl: string) => void;
  onFilterChange: (filter: string) => void;
  onTogglePreview: () => void;
  drawingTool?: string;
  drawingColor?: string;
  brushSize?: number;
  isDrawingMode: boolean;
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
  onTextDragStart,
  onTextDragEnd,
  onBackgroundSelect,
  onDrawingChange,
  onFilterChange,
  onTogglePreview,
  drawingTool = 'pen',
  drawingColor = '#000000',
  brushSize = 3,
  isDrawingMode = false
}: JournalPreviewProps) {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(500);
  const [previewHeight, setPreviewHeight] = useState(500);
  const [image, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });
  
  // Store the drawing state locally
  const [localDrawing, setLocalDrawing] = useState<string>(drawing || '');
  
  // Update local drawing when prop changes
  useEffect(() => {
    if (drawing && drawing !== localDrawing) {
      console.log("JournalPreview: Drawing prop updated, length:", drawing.length);
      setLocalDrawing(drawing);
    }
  }, [drawing]);

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

  useEffect(() => {
    if (!previewRef.current) return;

    const handleResize = () => {
      if (!previewRef.current) return;
      const width = previewRef.current.offsetWidth;
      const height = previewRef.current.offsetHeight;
      setPreviewWidth(width);
      setPreviewHeight(height);
      console.log("JournalPreview: Resized to", width, "x", height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Add global click handler to deselect text when clicking outside
    const handleGlobalClick = (e: MouseEvent) => {
      if (textRef.current && !textRef.current.contains(e.target as Node) && isTextSelected) {
        setIsTextSelected(false);
      }
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [isTextSelected]);

  // Effect to log drawing mode changes
  useEffect(() => {
    console.log("JournalPreview: Drawing mode changed to:", isDrawingMode);
    console.log("JournalPreview: Current drawing length:", localDrawing?.length || 0);
  }, [isDrawingMode, localDrawing]);

  const handleIconSelect = (id: string) => {
    console.log("Icon selected:", id);
    setSelectedIconId(id);
    setSelectedStickerId(null);
    setIsTextSelected(false);
    onIconSelect(id);
    onStickerSelect(null);
  };

  const handleStickerSelect = (id: string) => {
    console.log(`handleStickerSelect in JournalPreview: ${id}`);
    setSelectedStickerId(id);
    setIsTextSelected(false);
    onStickerSelect(id);
    setSelectedIconId(null);
    onIconSelect('');
  };

  // This stops the general page click from affecting text position
  const handlePageClick = (e: React.MouseEvent) => {
    // Only deselect items if clicking on the background, not on any specific element
    const target = e.target as HTMLElement;
    if (e.target === e.currentTarget || 
        (target.classList && target.classList.contains('journal-page'))) {
      setSelectedStickerId(null);
      setSelectedIconId(null);
      setIsTextSelected(false);
      onIconSelect('');
      onStickerSelect(null);
    }
  };

  const handleDrawingChange = (dataUrl: string) => {
    console.log("JournalPreview: Drawing changed, data URL length:", dataUrl.length);
    // Update local state immediately
    setLocalDrawing(dataUrl);
    // Then propagate to parent
    onDrawingChange(dataUrl);
  };

  // Function to process text and apply special Unicode text styles
  const processText = (text: string) => {
    if (!text) return '';
    
    // Handle special style transformations from the utility
    if (textStyle && textStyle !== 'normal' && !textStyle.includes(' ')) {
      // Type assertion to ensure textStyle is treated as a valid TextStyle
      // This is safe assuming the textStyle values are controlled by our app
      return applyTextStyle(text, textStyle as TextStyle);
    }
    
    // Return regular text if no special transformation is needed
    return text;
  };

  // COMPLETELY REWRITTEN TEXT DRAG IMPLEMENTATION
  const handleTextElementDrag = (e: React.MouseEvent) => {
    if (isDrawingMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Signal drag start to the store
    onTextDragStart();
    
    // Record initial mouse position
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Record initial text position
    const initialPosition = { ...textPosition };
    
    // Calculate dimensions for percentage calculations
    const containerRect = previewRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Set up mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      // Calculate how far mouse has moved
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Convert pixel movement to percentage movement
      const deltaXPercent = (deltaX / containerWidth) * 100;
      const deltaYPercent = (deltaY / containerHeight) * 100;
      
      // Calculate new position
      const newX = Math.max(10, Math.min(90, initialPosition.x + deltaXPercent));
      const newY = Math.max(10, Math.min(90, initialPosition.y + deltaYPercent));
      
      // Update position
      onTextMove({ x: newX, y: newY });
    };
    
    // Set up mouse up handler
    const handleMouseUp = () => {
      // Signal drag end to the store
      onTextDragEnd();
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Generate text style based on the gradient
  const getTextStyles = () => {
    // Check if we're using a gradient for the text
    const usingGradient = gradient && gradient !== '';
    
    // Base styles
    const styles: React.CSSProperties = {
      fontFamily: font || 'inherit',
      fontSize: fontSize || 'inherit',
      fontWeight: fontWeight || 'inherit',
      fontStyle: textStyle?.includes('italic') ? 'italic' : 'normal',
      textDecoration: textStyle?.includes('underline') ? 'underline' : 'none',
      textAlign: textStyle?.includes('center') ? 'center' : 'left',
      padding: '1rem',
      maxWidth: '80%',
      minHeight: '30px',
      minWidth: '100px',
      userSelect: 'none',
      touchAction: 'none',
      // Only show border when text is selected
      border: isTextSelected ? '2px dashed rgba(59, 130, 246, 0.7)' : 'none',
      borderRadius: '4px',
    };
    
    // If using gradient for text
    if (usingGradient) {
      styles.background = gradient;
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.backgroundClip = 'text';
      styles.color = 'transparent';
    } else {
      // Normal text color
      styles.color = fontColor || 'inherit';
    }
    
    return styles;
  };

  // Function to determine if backgroundImage is a URL or a gradient
  const isGradientBackground = backgroundImage && backgroundImage.includes('linear-gradient');

  // Helper function to get CSS filter based on filter name
  const getCssFilter = () => {
    if (!filter || filter === 'none') return undefined;
    
    // If the filter is already a CSS filter string (contains parentheses), use it directly
    if (filter.includes('(')) {
      return filter;
    }
    
    // Otherwise map the filter name to a CSS filter value
    switch (filter) {
      case 'grayscale': return 'grayscale(1)';
      case 'sepia': return 'sepia(0.7)';
      case 'blur': return 'blur(2px)';
      case 'brightness': return 'brightness(1.3)';
      case 'contrast': return 'contrast(1.5)';
      case 'invert': return 'invert(0.8)';
      default: return undefined;
    }
  };

  // Check if the background is a pattern or paper texture
  const isPatternBackground = backgroundImage && backgroundImage.includes('transparenttextures.com');

  // Get background style based on type
  const getBackgroundStyle = () => {
    if (!backgroundImage) return {};
    
    const filterValue = getCssFilter();
    console.log("JournalPreview: Applying filter:", filterValue, "to background:", backgroundImage);
    
    if (isGradientBackground) {
      return {
        background: backgroundImage,
        opacity: 0.9,
        filter: filterValue,
      };
    }
    
    if (isPatternBackground) {
      console.log("Pattern background detected:", backgroundImage);
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#faf9f6', // Off-white background for patterns
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        filter: filterValue,
      };
    }
    
    // Regular image background
    console.log("Regular image background:", backgroundImage);
    return {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: filterValue,
    };
  };

  // Handler for sticker resizing
  const handleStickerResize = (id: string, size: number) => {
    // Find the sticker
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;
    
    // Create updated sticker with new size
    const updatedSticker: Sticker = {
      ...sticker,
      width: size,
      height: size
    };
    
    // Update the sticker
    onStickerAdd(updatedSticker);
  };

  return (
    <div className={cn("relative flex-1 overflow-hidden bg-gray-50", className)}>
      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={handlePageClick}>
        {/* Journal page with proper styling */}
        <div style={journalPageStyle} className="journal-page">
          {/* Background layer */}
          {backgroundImage && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                ...getBackgroundStyle(),
                zIndex: 1
              }}
              className="journal-page-background"
            />
          )}

          {/* Apply global filter to the entire journal page when no background image exists */}
          {!backgroundImage && filter && filter !== 'none' && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                filter: getCssFilter(),
                zIndex: 1,
                pointerEvents: 'none'
              }}
              className="journal-page-filter"
            />
          )}

          <div className="relative h-full w-full" ref={previewRef}>
            {/* Display existing drawing when not in drawing mode */}
            {localDrawing && !isDrawingMode && (
              <img
                src={localDrawing}
                alt="Drawing"
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: !backgroundImage ? getCssFilter() : undefined
                }}
              />
            )}

            {/* Drawing Canvas (when in drawing mode) */}
            {isDrawingMode && (
              <div className="absolute inset-0 z-40">
                <DrawingLayer
                  width={previewWidth}
                  height={previewHeight}
                  onDrawingChange={handleDrawingChange}
                  tool={drawingTool}
                  color={drawingColor}
                  brushSize={brushSize}
                  initialDrawing={localDrawing}
                  onClear={() => handleDrawingChange('')}
                />
              </div>
            )}

            {/* Text element with proper gradient styling */}
            <div
              ref={textRef}
              className="absolute z-30 cursor-move whitespace-pre-wrap"
              style={{
                ...getTextStyles(),
                left: `${textPosition.x}%`,
                top: `${textPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                filter: !backgroundImage ? getCssFilter() : undefined,
                pointerEvents: isDrawingMode ? 'none' : 'auto'
              }}
              onMouseDown={handleTextElementDrag}
              onClick={(e) => {
                if (isDrawingMode) return;
                e.stopPropagation();
                setSelectedStickerId(null);
                setSelectedIconId(null);
                setIsTextSelected(true);
                onIconSelect('');
                onStickerSelect(null);
              }}
            >
              {processText(text) || 'Start typing to add text...'}
            </div>

            {/* Stickers using the StickerContainer component */}
            {stickers && stickers.map((sticker) => (
              <StickerContainer
                key={sticker.id}
                sticker={sticker}
                selected={selectedStickerId === sticker.id}
                onSelect={handleStickerSelect}
                onMove={onStickerMove}
                onResize={handleStickerResize}
                containerRef={previewRef}
                style={{ 
                  filter: !backgroundImage ? getCssFilter() : undefined,
                  pointerEvents: isDrawingMode ? 'none' : 'auto',
                  zIndex: 30 
                }}
              />
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
                style={{ 
                  filter: !backgroundImage ? getCssFilter() : undefined,
                  pointerEvents: isDrawingMode ? 'none' : 'auto',
                  zIndex: 30 
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
