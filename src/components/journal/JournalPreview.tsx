
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { DrawingLayer } from './DrawingLayer';
import { Sticker, TextBox } from '@/types/journal';
import { IconContainer } from './IconContainer';
import { StickerContainer } from './StickerContainer';
import { TextBoxComponent } from './TextBoxComponent';
import { useScreenshot } from 'use-react-screenshot';
import type { Icon } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ScrollArea } from "@/components/ui/scroll-area";

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
  textBoxes: TextBox[];
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
  onTextBoxAdd: (textBox: TextBox) => void;
  onTextBoxUpdate: (id: string, updates: Partial<TextBox>) => void;
  onTextBoxRemove: (id: string) => void;
  onTextBoxSelect: (id: string | null) => void;
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
  textBoxes = [],
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
  onTextBoxAdd,
  onTextBoxUpdate,
  onTextBoxRemove,
  onTextBoxSelect,
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
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(500);
  const [previewHeight, setPreviewHeight] = useState(500);
  const [image, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });
  
  const [isTextDragging, setIsTextDragging] = useState(false);
  
  const [localDrawing, setLocalDrawing] = useState<string>(drawing || '');
  
  useEffect(() => {
    if (drawing && drawing !== localDrawing) {
      console.log("JournalPreview: Drawing prop updated, length:", drawing.length);
      setLocalDrawing(drawing);
    }
  }, [drawing]);

  const journalPageStyle = {
    backgroundColor: '#fff',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px', 
    width: '100%',
    minHeight: '600px', // Provide a minimum height
    position: 'relative' as 'relative',
    overflow: 'hidden',
    margin: '20px 0',
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

  useEffect(() => {
    console.log("JournalPreview: Drawing mode changed to:", isDrawingMode);
    console.log("JournalPreview: Current drawing length:", localDrawing?.length || 0);
  }, [isDrawingMode, localDrawing]);

  const handleIconSelect = (id: string) => {
    console.log("Icon selected:", id);
    setSelectedIconId(id);
    setSelectedStickerId(null);
    setSelectedTextBoxId(null);
    setIsTextSelected(false);
    onIconSelect(id);
    onStickerSelect(null);
    onTextBoxSelect(null);
  };

  const handleStickerSelect = (id: string) => {
    console.log(`handleStickerSelect in JournalPreview: ${id}`);
    setSelectedStickerId(id);
    setSelectedIconId(null);
    setSelectedTextBoxId(null);
    setIsTextSelected(false);
    onStickerSelect(id);
    onIconSelect('');
    onTextBoxSelect(null);
  };
  
  const handleTextBoxSelect = (id: string) => {
    console.log(`Text box selected: ${id}`);
    setSelectedTextBoxId(id);
    setSelectedStickerId(null);
    setSelectedIconId(null);
    setIsTextSelected(false);
    onTextBoxSelect(id);
    onStickerSelect(null);
    onIconSelect('');
  };

  const handlePageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (e.target === e.currentTarget || 
        (target.classList && target.classList.contains('journal-page'))) {
      setSelectedStickerId(null);
      setSelectedIconId(null);
      setSelectedTextBoxId(null);
      setIsTextSelected(false);
      onIconSelect('');
      onStickerSelect(null);
      onTextBoxSelect(null);
    }
  };

  const handleDrawingChange = (dataUrl: string) => {
    console.log("JournalPreview: Drawing changed, data URL length:", dataUrl.length);
    setLocalDrawing(dataUrl);
    onDrawingChange(dataUrl);
  };

  const processText = (text: string) => {
    if (!text) return '';
    
    if (textStyle && textStyles.includes(textStyle)) {
      return applyTextStyle(text, textStyle as TextStyle);
    }
    
    return text;
  };

  const textStyles = [
    'mathematical', 'gothic', 'cursive', 'double', 'circle', 'bold', 'italic', 
    'boldItalic', 'script', 'boldScript', 'fraktur', 'boldFraktur', 'sansSerif', 
    'sansSerifBold', 'sansSerifItalic', 'sansSerifBoldItalic', 'monospace', 
    'fullWidth', 'smallCaps', 'subscript', 'superscript', 'inverted', 'reversed', 
    'strikethrough', 'underline', 'bubbles', 'squares', 'medieval', 'old-english',
    'handwriting', 'vintage', 'cute', 'dotted', 'parenthesized', 'boxed'
  ];

  const handleTextElementDrag = (e: React.MouseEvent) => {
    if (isDrawingMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    onTextDragStart();
    setIsTextDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const initialPosition = { ...textPosition };
    
    const containerRect = previewRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const deltaXPercent = (deltaX / containerWidth) * 100;
      const deltaYPercent = (deltaY / containerHeight) * 100;
      
      const newX = Math.max(10, Math.min(90, initialPosition.x + deltaXPercent));
      const newY = Math.max(10, Math.min(90, initialPosition.y + deltaYPercent));
      
      onTextMove({ x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      onTextDragEnd();
      setIsTextDragging(false);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch event handler for dragging text
  const handleTextTouchStart = (e: React.TouchEvent) => {
    if (isDrawingMode) return;
    
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    
    onTextDragStart();
    setIsTextDragging(true);
    setIsTextSelected(true);
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    const initialPosition = { ...textPosition };
    
    const containerRect = previewRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      const deltaXPercent = (deltaX / containerWidth) * 100;
      const deltaYPercent = (deltaY / containerHeight) * 100;
      
      const newX = Math.max(10, Math.min(90, initialPosition.x + deltaXPercent));
      const newY = Math.max(10, Math.min(90, initialPosition.y + deltaYPercent));
      
      onTextMove({ x: newX, y: newY });
    };
    
    const handleTouchEnd = () => {
      onTextDragEnd();
      setIsTextDragging(false);
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const getTextStyles = () => {
    const usingGradient = gradient && gradient !== '';
    
    const styles: React.CSSProperties = {
      fontFamily: font || 'inherit',
      fontSize: fontSize || 'inherit',
      fontWeight: fontWeight || 'inherit',
      textAlign: textStyle?.includes('center') ? 'center' : 'left',
      padding: '1rem',
      maxWidth: '80%',
      minHeight: '30px',
      minWidth: '100px',
      userSelect: 'none',
      touchAction: 'none',
      border: isTextSelected && !isTextDragging ? '2px dashed rgba(59, 130, 246, 0.7)' : 'none',
      borderRadius: '4px',
    };
    
    if (textStyle) {
      if (textStyle.includes('italic')) {
        styles.fontStyle = 'italic';
      }
      
      if (textStyle.includes('underline')) {
        styles.textDecoration = 'underline';
      }
    }
    
    if (usingGradient) {
      styles.background = gradient;
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.backgroundClip = 'text';
      styles.color = 'transparent';
    } else {
      styles.color = fontColor || 'inherit';
    }
    
    return styles;
  };

  // Check if background is a gradient
  const isGradientBackground = backgroundImage && 
    typeof backgroundImage === 'string' &&
    backgroundImage.includes('linear-gradient');

  // Check if background is a combined texture+color
  const isCombinedBackground = backgroundImage && 
    typeof backgroundImage === 'string' &&
    backgroundImage.includes('url') && 
    !backgroundImage.includes('unsplash');

  const getCssFilter = () => {
    if (!filter || filter === 'none') return undefined;
    
    if (filter.includes('(')) {
      return filter;
    }
    
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

  const isPatternBackground = backgroundImage && 
    typeof backgroundImage === 'string' &&
    backgroundImage.includes('transparenttextures.com');

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
    
    if (isCombinedBackground) {
      // Parse the combined background string to get both the texture and color
      return {
        background: backgroundImage, 
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay',
        filter: filterValue,
      };
    }
    
    if (isPatternBackground) {
      console.log("Pattern background detected:", backgroundImage);
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#e0e0e0', // Darker background for better contrast
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        filter: filterValue,
      };
    }
    
    console.log("Regular image background:", backgroundImage);
    return {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: filterValue,
    };
  };

  const handleStickerResize = (id: string, size: number) => {
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;
    
    const updatedSticker: Sticker = {
      ...sticker,
      width: size,
      height: size
    };
    
    onStickerAdd(updatedSticker);
  };
  
  const handleAddTextBox = () => {
    // Only allow adding text boxes when not in drawing mode
    if (isDrawingMode) return;
    
    const newTextBox: TextBox = {
      id: uuidv4(),
      text: 'Double-click to edit this text box',
      position: { x: 50, y: 50 },
      width: 200,
      height: 100,
      font: font,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontColor: fontColor,
      gradient: gradient,
      textStyle: textStyle,
      rotation: 0,
      zIndex: textBoxes.length + 10
    };
    
    onTextBoxAdd(newTextBox);
    handleTextBoxSelect(newTextBox.id);
    toast.success("New text box added");
  };

  return (
    <div className={cn("relative flex-1 overflow-auto bg-gray-50", className)}>
      <ScrollArea className="h-full w-full">
        <div className="flex items-center justify-center p-4 min-h-screen" onClick={handlePageClick}>
          <div style={journalPageStyle} className="journal-page w-full max-w-4xl">
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

            <div className="relative h-full w-full min-h-[600px]" ref={previewRef}>
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
                onTouchStart={handleTextTouchStart}
                onClick={(e) => {
                  if (isDrawingMode) return;
                  e.stopPropagation();
                  setSelectedStickerId(null);
                  setSelectedIconId(null);
                  setSelectedTextBoxId(null);
                  setIsTextSelected(true);
                  onIconSelect('');
                  onStickerSelect(null);
                  onTextBoxSelect(null);
                }}
              >
                {processText(text) || 'Start typing to add text...'}
                {isTextSelected && !isTextDragging && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary/70 text-primary-foreground px-2 py-1 rounded text-xs whitespace-nowrap">
                    Touch and drag to move
                  </div>
                )}
              </div>

              {textBoxes.map((textBox) => (
                <TextBoxComponent
                  key={textBox.id}
                  textBox={textBox}
                  selected={selectedTextBoxId === textBox.id}
                  containerRef={previewRef}
                  onSelect={handleTextBoxSelect}
                  onUpdate={onTextBoxUpdate}
                  onRemove={onTextBoxRemove}
                  isDrawingMode={isDrawingMode}
                  style={{ 
                    filter: !backgroundImage ? getCssFilter() : undefined,
                    zIndex: 35,
                  }}
                />
              ))}

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
              
              {/* Add Text Box Button */}
              {!isDrawingMode && (
                <button
                  className="absolute bottom-4 right-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 shadow-lg z-50"
                  onClick={handleAddTextBox}
                  title="Add Text Box"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
