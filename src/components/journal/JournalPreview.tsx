
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Maximize2, Trash2, MinusSquare, PlusSquare, Pencil, ImagePlus, Filter, FileImage, X } from 'lucide-react';
import { moodOptions } from './config/editorConfig';
import type { Mood, Sticker as StickerType, Icon } from '@/types/journal';
import { applyTextStyle } from '@/utils/unicodeTextStyles';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StickerSelector } from './StickerSelector';
import { IconSelector } from './IconSelector';
import { BackgroundImageSelector } from './BackgroundImageSelector';
import { ImageFilterSelector } from './ImageFilterSelector';
import { DrawingLayer } from './DrawingLayer';

interface JournalPreviewProps {
  showPreview: boolean;
  text: string;
  mood?: Mood;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle?: string;
  stickers: StickerType[];
  icons: Icon[];
  textPosition: { x: number, y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
  isDraggingText?: boolean;
  onStickerAdd: (sticker: StickerType) => void;
  onIconAdd: (icon: Icon) => void;
  onStickerMove: (stickerId: string, position: { x: number, y: number }) => void;
  onIconMove: (iconId: string, position: { x: number, y: number }) => void;
  onIconUpdate: (iconId: string, updates: Partial<Icon>) => void;
  onTextMove: (position: { x: number, y: number }) => void;
  onTextDragStart?: () => void;
  onTextDragEnd?: () => void;
  onBackgroundSelect: (url: string) => void;
  onDrawingChange: (dataUrl: string) => void;
  onFilterChange: (filter: string) => void;
  onTogglePreview: () => void;
}

export function JournalPreview({
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
  filter = 'none',
  isDraggingText = false,
  onStickerAdd,
  onIconAdd,
  onIconMove,
  onIconUpdate,
  onStickerMove,
  onTextMove,
  onTextDragStart = () => {},
  onTextDragEnd = () => {},
  onBackgroundSelect,
  onDrawingChange,
  onFilterChange,
  onTogglePreview
}: JournalPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showIconControls, setShowIconControls] = useState(false);
  const [iconSize, setIconSize] = useState<number>(48);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [bgImagePosition, setBgImagePosition] = useState({ x: 50, y: 50 });
  const [isDraggingBgImage, setIsDraggingBgImage] = useState(false);
  const [isUploadedImage, setIsUploadedImage] = useState(false);
  const [isDraggingIcon, setIsDraggingIcon] = useState(false);
  const [isResizingIcon, setIsResizingIcon] = useState(false);
  const iconResizeStartSize = useRef(0);

  useEffect(() => {
    // Detect if the current background image is an uploaded image (data URL)
    setIsUploadedImage(!!backgroundImage && backgroundImage.startsWith('data:'));
  }, [backgroundImage]);

  useEffect(() => {
    if (selectedIconId) {
      const icon = icons.find(i => i.id === selectedIconId);
      if (icon) {
        setIconSize(icon.size || 48);
      }
    }
  }, [selectedIconId, icons]);

  const getBackground = () => {
    // For uploaded images, we'll handle them separately as positioned elements
    if (backgroundImage && backgroundImage.startsWith('data:')) {
      return gradient; // Use gradient as base layer
    }
    if (backgroundImage) {
      return `url(${backgroundImage})`;
    }
    return gradient;
  };

  const getBackgroundSize = () => {
    // No need to set background-size for uploaded images since we're handling them separately
    if (backgroundImage && !backgroundImage.startsWith('data:')) {
      return 'cover'; // Default behavior for other images
    }
    return undefined;
  };

  const getFilterStyle = () => {
    switch(filter) {
      case 'none':
        return '';
      case 'sepia':
        return 'sepia(80%)';
      case 'grayscale':
        return 'grayscale(100%)';
      case 'saturate':
        return 'saturate(200%)';
      case 'warm':
        return 'brightness(110%) saturate(120%) hue-rotate(10deg)';
      case 'cool':
        return 'brightness(105%) saturate(80%) hue-rotate(-10deg)';
      case 'dramatic':
        return 'contrast(130%) brightness(90%)';
      case 'vintage':
        return 'sepia(50%) contrast(110%) brightness(90%)';
      case 'duotone':
        return 'contrast(120%) brightness(90%)';
      case 'invert':
        return 'invert(100%)';
      case 'blur':
        return 'blur(1px) brightness(105%)';
      case 'pixelate':
        return 'contrast(130%) brightness(110%) saturate(130%)';
      default:
        return '';
    }
  };

  // Handle background image drag events
  const handleBgImageMouseDown = (e: React.MouseEvent) => {
    if (isDrawingMode || !isUploadedImage) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsDraggingBgImage(true);
    
    const previewRect = previewRef.current?.getBoundingClientRect();
    if (!previewRect) return;
    
    const offsetX = e.clientX - previewRect.left;
    const offsetY = e.clientY - previewRect.top;
    
    const onMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const previewRect = previewRef.current.getBoundingClientRect();
      
      // Calculate the new position as a percentage of the container
      const newX = ((e.clientX - previewRect.left) / previewRect.width) * 100;
      const newY = ((e.clientY - previewRect.top) / previewRect.height) * 100;
      
      // Ensure position stays within bounds (0-100%)
      const boundedX = Math.max(0, Math.min(100, newX));
      const boundedY = Math.max(0, Math.min(100, newY));
      
      setBgImagePosition({ x: boundedX, y: boundedY });
    };
    
    const onMouseUp = () => {
      setIsDraggingBgImage(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Text element mouse and touch event handlers
  const handleTextMouseDown = (e: React.MouseEvent) => {
    if (!previewRef.current || !textRef.current || isDrawingMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    const previewRect = previewRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();
    
    // Calculate the offset from the cursor to the top-left of the text element
    const offsetX = e.clientX - textRect.left;
    const offsetY = e.clientY - textRect.top;
    
    setDragStartPos({ x: offsetX, y: offsetY });
    onTextDragStart();
    
    const onMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const previewRect = previewRef.current.getBoundingClientRect();
      
      // Calculate the new position as a percentage of the container
      const newX = ((e.clientX - previewRect.left - dragStartPos.x) / previewRect.width) * 100;
      const newY = ((e.clientY - previewRect.top - dragStartPos.y) / previewRect.height) * 100;
      
      // Ensure position stays within bounds (0-100%)
      const boundedX = Math.max(0, Math.min(100, newX));
      const boundedY = Math.max(0, Math.min(100, newY));
      
      onTextMove({ x: boundedX, y: boundedY });
    };
    
    const onMouseUp = () => {
      onTextDragEnd();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  const handleTextTouchStart = (e: React.TouchEvent) => {
    if (!previewRef.current || !textRef.current || isDrawingMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const previewRect = previewRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();
    
    // Calculate the offset from the touch to the top-left of the text element
    const offsetX = touch.clientX - textRect.left;
    const offsetY = touch.clientY - textRect.top;
    
    setDragStartPos({ x: offsetX, y: offsetY });
    onTextDragStart();
    
    const onTouchMove = (e: TouchEvent) => {
      if (!previewRef.current) return;
      
      const touch = e.touches[0];
      const previewRect = previewRef.current.getBoundingClientRect();
      
      // Calculate the new position as a percentage of the container
      const newX = ((touch.clientX - previewRect.left - dragStartPos.x) / previewRect.width) * 100;
      const newY = ((touch.clientY - previewRect.top - dragStartPos.y) / previewRect.height) * 100;
      
      // Ensure position stays within bounds (0-100%)
      const boundedX = Math.max(0, Math.min(100, newX));
      const boundedY = Math.max(0, Math.min(100, newY));
      
      onTextMove({ x: boundedX, y: boundedY });
    };
    
    const onTouchEnd = () => {
      onTextDragEnd();
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
    
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };

  const handleStickerAdd = (sticker: StickerType) => {
    const newSticker = {
      ...sticker,
      position: { x: 50, y: 50 }
    };
    onStickerAdd(newSticker);
  };

  const handleIconAdd = (icon: Icon) => {
    onIconAdd(icon);
  };

  const handleStickerMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.stopPropagation();
    
    setSelectedStickerId(stickerId);
    setShowDeleteButton(true);
    
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker || !previewRef.current) return;
    
    const previewRect = previewRef.current.getBoundingClientRect();
    const startX = (sticker.position.x / 100) * previewRect.width;
    const startY = (sticker.position.y / 100) * previewRect.height;
    const offsetX = e.clientX - startX;
    const offsetY = e.clientY - startY;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const previewRect = previewRef.current.getBoundingClientRect();
      const x = ((e.clientX - offsetX) / previewRect.width) * 100;
      const y = ((e.clientY - offsetY) / previewRect.height) * 100;
      
      onStickerMove(stickerId, { x, y });
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle icon dragging
  const handleIconMouseDown = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    
    // Only set state if we're not already dragging/resizing
    if (!isDraggingIcon && !isResizingIcon) {
      setSelectedIconId(iconId);
      setShowIconControls(true);
      setIsDraggingIcon(true);
      
      const icon = icons.find(i => i.id === iconId);
      if (!icon || !previewRef.current) return;
      
      const previewRect = previewRef.current.getBoundingClientRect();
      const startX = (icon.position.x / 100) * previewRect.width;
      const startY = (icon.position.y / 100) * previewRect.height;
      const offsetX = e.clientX - startX;
      const offsetY = e.clientY - startY;
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!previewRef.current) return;
        
        const previewRect = previewRef.current.getBoundingClientRect();
        const x = ((e.clientX - offsetX) / previewRect.width) * 100;
        const y = ((e.clientY - offsetY) / previewRect.height) * 100;
        
        onIconMove(iconId, { x, y });
      };
      
      const handleMouseUp = () => {
        setIsDraggingIcon(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  };

  // Handle icon resizing
  const handleIconResizeStart = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    setSelectedIconId(iconId);
    setShowIconControls(true);
    setIsResizingIcon(true);
    
    const icon = icons.find(i => i.id === iconId);
    if (!icon) return;
    
    const startSize = icon.size || 48;
    iconResizeStartSize.current = startSize;
    const startX = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newSize = Math.max(16, iconResizeStartSize.current + deltaX / 2);
      
      setIconSize(newSize);
      onIconUpdate(iconId, { size: newSize });
    };
    
    const handleMouseUp = () => {
      setIsResizingIcon(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleIconClick = (iconId: string) => {
    if (!isDraggingIcon && !isResizingIcon) {
      setSelectedIconId(iconId);
      setShowIconControls(true);
    }
  };

  const handleIconSizeChange = (increase: boolean) => {
    if (!selectedIconId) return;
    
    const newSize = increase ? iconSize + 8 : Math.max(16, iconSize - 8);
    setIconSize(newSize);
    
    onIconUpdate(selectedIconId, { size: newSize });
  };

  const handleRemoveSticker = () => {
    if (!selectedStickerId) return;
    
    onStickerMove(selectedStickerId, { x: -999, y: -999 });
    
    setSelectedStickerId(null);
    setShowDeleteButton(false);
  };

  const handleRemoveIcon = () => {
    if (!selectedIconId) return;
    
    onIconMove(selectedIconId, { x: -999, y: -999 });
    
    setSelectedIconId(null);
    setShowIconControls(false);
  };

  const handleRemoveBackgroundImage = () => {
    onBackgroundSelect('');
  };

  const handleBackgroundClick = () => {
    setSelectedStickerId(null);
    setShowDeleteButton(false);
    setSelectedIconId(null);
    setShowIconControls(false);
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  const handleDrawingChange = (dataUrl: string) => {
    if (dataUrl === '') {
      setIsDrawingMode(false);
    }
    onDrawingChange(dataUrl);
  };

  // Function to render the journal content (text, stickers, icons, etc.)
  const renderJournalContent = (isDialog = false) => {
    return (
      <>
        {mood && (
          <div className="absolute top-4 left-4 text-lg">
            Mood: {moodOptions.find(m => m.value === mood)?.icon}
          </div>
        )}
        
        {/* Render uploaded background image as a draggable element */}
        {isUploadedImage && backgroundImage && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="relative inline-block">
              <img
                ref={backgroundImageRef}
                src={backgroundImage}
                alt="Background"
                className={`absolute max-w-[80%] max-h-[80%] ${isDraggingBgImage ? 'ring-2 ring-primary/50' : 'hover:ring-2 hover:ring-primary/30'} pointer-events-auto cursor-move transition-all`}
                style={{
                  left: `${bgImagePosition.x}%`,
                  top: `${bgImagePosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  filter: getFilterStyle(),
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={handleBgImageMouseDown}
                draggable={false}
              />
              {isUploadedImage && !isDialog && (
                <button
                  className="absolute z-10 w-4 h-4 -mt-1 -ml-1 bg-white/50 hover:bg-white/80 rounded-full flex items-center justify-center cursor-pointer"
                  style={{
                    left: `${bgImagePosition.x}%`,
                    top: `${bgImagePosition.y}%`,
                    transform: 'translate(-100%, -100%)',
                  }}
                  onClick={handleRemoveBackgroundImage}
                  title="Remove image"
                  type="button"
                >
                  <X className="w-2 h-2 text-gray-800" />
                </button>
              )}
            </div>
          </div>
        )}
        
        {isDrawingMode && !isDialog && (
          <DrawingLayer
            width={previewRef.current?.clientWidth || 800}
            height={previewRef.current?.clientHeight || 600}
            className="absolute inset-0 z-50"
            onDrawingChange={handleDrawingChange}
          />
        )}
        
        {!isDrawingMode && (
          <>
            {/* Text content - draggable in regular preview, static in dialog */}
            <div
              ref={!isDialog ? textRef : undefined}
              style={{
                fontFamily: font,
                fontSize,
                fontWeight,
                color: fontColor,
                left: `${textPosition.x}%`,
                top: `${textPosition.y}%`,
                position: 'absolute',
                maxWidth: '80%',
                zIndex: 10,
                cursor: isDialog ? 'default' : 'move',
              }}
              className={`whitespace-pre-wrap p-6 select-none transition-colors rounded-lg
                ${isDraggingText && !isDialog ? 'bg-black/5 ring-2 ring-primary/30' : 'hover:bg-black/5'}
              `}
              onMouseDown={!isDialog ? handleTextMouseDown : undefined}
              onTouchStart={!isDialog ? handleTextTouchStart : undefined}
            >
              {textStyle && textStyle !== 'normal' 
                ? applyTextStyle(text || "Start writing your journal entry...", textStyle as any) 
                : (text || "Start writing your journal entry...")}
            </div>
            
            {stickers.map((sticker) => (
              <img
                key={sticker.id}
                src={sticker.url}
                alt={sticker.id}
                style={{
                  left: `${sticker.position.x}%`,
                  top: `${sticker.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  position: 'absolute',
                }}
                className={`w-16 h-16 cursor-move transition-all hover:ring-2 hover:ring-primary
                  ${selectedStickerId === sticker.id ? 'ring-2 ring-primary' : ''}
                `}
                draggable={false}
                onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
              />
            ))}

            {/* Icons - now with dragging and resizing capabilities */}
            {icons.filter(icon => icon.position.x > -100 && icon.position.y > -100).map((icon) => (
              <div
                key={icon.id}
                className={`absolute cursor-move ${selectedIconId === icon.id ? 'z-20' : 'z-10'}`}
                style={{
                  left: `${icon.position.x}%`,
                  top: `${icon.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <img
                  src={icon.url}
                  alt="Icon"
                  style={{
                    width: `${icon.size || 48}px`,
                    height: `${icon.size || 48}px`,
                    color: icon.color,
                  }}
                  className={`transition-all hover:ring-2 hover:ring-primary
                    ${selectedIconId === icon.id ? 'ring-2 ring-primary' : ''}
                    ${isDraggingIcon && selectedIconId === icon.id ? 'opacity-80' : 'opacity-100'}
                  `}
                  onClick={() => handleIconClick(icon.id)}
                  onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
                  draggable={false}
                />
                
                {selectedIconId === icon.id && !isDialog && (
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-se-resize"
                    onMouseDown={(e) => handleIconResizeStart(e, icon.id)}
                  />
                )}
              </div>
            ))}
            
            {selectedStickerId && showDeleteButton && !isDialog && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute z-10 right-4 bottom-4"
                onClick={handleRemoveSticker}
                type="button"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Sticker
              </Button>
            )}
            
            {selectedIconId && showIconControls && !isDialog && (
              <div className="absolute z-30 right-4 bottom-4 flex gap-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleIconSizeChange(false)}
                  type="button"
                >
                  <MinusSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleIconSizeChange(true)}
                  type="button"
                >
                  <PlusSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveIcon}
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}

            {drawing && (
              <img
                src={drawing}
                alt="Journal drawing"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ mixBlendMode: 'multiply' }}
              />
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="w-full lg:w-3/4 p-6 relative print:w-full print:p-0 min-h-[800px]">
      <div className="absolute top-4 right-4 z-10 flex gap-0.5 print:hidden">
        <StickerSelector onStickerSelect={handleStickerAdd} />
        
        {/* Use the IconSelector without children */}
        <IconSelector onIconSelect={handleIconAdd} />
        
        <BackgroundImageSelector onImageSelect={onBackgroundSelect} />
        
        <ImageFilterSelector 
          onFilterSelect={onFilterChange}
          currentFilter={filter || 'none'}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent hover:text-accent-foreground relative"
            title="Apply image filter"
          >
            <Filter className="w-4 h-4" />
            {filter !== 'none' && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
            )}
          </Button>
        </ImageFilterSelector>
        
        <Button
          onClick={toggleDrawingMode}
          variant={isDrawingMode ? "secondary" : "ghost"}
          size="icon"
          title={isDrawingMode ? "Exit drawing mode" : "Enter drawing mode"}
          type="button"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={onTogglePreview}
          variant="ghost"
          size="icon"
          type="button"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        
        {showPreview && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" type="button">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[100vw] h-[100vh] max-w-[100vw] max-h-[100vh] p-6 border border-white">
              <div
                style={{
                  background: getBackground(),
                  backgroundSize: getBackgroundSize(),
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  filter: !isUploadedImage ? getFilterStyle() : undefined,
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                {/* Render journal content for the dialog */}
                {renderJournalContent(true)}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {showPreview && (
        <div
          ref={previewRef}
          style={{
            background: getBackground(),
            backgroundSize: getBackgroundSize(),
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
            filter: !isUploadedImage ? getFilterStyle() : undefined,
          }}
          className="w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 animate-fadeIn print:shadow-none print:rounded-none print:min-h-screen relative"
          onClick={handleBackgroundClick}
        >
          {renderJournalContent(false)}
        </div>
      )}
    </div>
  );
}
