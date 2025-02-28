
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Maximize2, Trash2, Pencil, Filter, FileImage, X } from 'lucide-react';
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
  onIconSelect: (iconId: string | null) => void;
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
  onIconSelect,
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
  const [bgImagePosition, setBgImagePosition] = useState({ x: 50, y: 50 });
  const [isDraggingBgImage, setIsDraggingBgImage] = useState(false);
  const [isUploadedImage, setIsUploadedImage] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsUploadedImage(!!backgroundImage && backgroundImage.startsWith('data:'));
  }, [backgroundImage]);

  useEffect(() => {
    onIconSelect(selectedIconId);
  }, [selectedIconId, onIconSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedStickerId) {
          console.log("Deleting sticker:", selectedStickerId);
          onStickerMove(selectedStickerId, { x: -999, y: -999 });
          setSelectedStickerId(null);
        }
        if (selectedIconId) {
          console.log("Deleting icon:", selectedIconId);
          onIconMove(selectedIconId, { x: -999, y: -999 });
          setSelectedIconId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedStickerId, selectedIconId, onStickerMove, onIconMove]);

  const getBackground = () => {
    if (backgroundImage && backgroundImage.startsWith('data:')) {
      return gradient;
    }
    if (backgroundImage) {
      return `url(${backgroundImage})`;
    }
    return gradient;
  };

  const getBackgroundSize = () => {
    if (backgroundImage && !backgroundImage.startsWith('data:')) {
      return 'cover';
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
      
      const newX = ((e.clientX - previewRect.left) / previewRect.width) * 100;
      const newY = ((e.clientY - previewRect.top) / previewRect.height) * 100;
      
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

  const handleTextMouseDown = (e: React.MouseEvent) => {
    if (!previewRef.current || !textRef.current || isDrawingMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedIconId(null);
    setSelectedStickerId(null);
    
    const previewRect = previewRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();
    
    const offsetX = e.clientX - textRect.left;
    const offsetY = e.clientY - textRect.top;
    
    setDragStartPos({ x: offsetX, y: offsetY });
    onTextDragStart();
    
    const onMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const previewRect = previewRef.current.getBoundingClientRect();
      
      const newX = ((e.clientX - previewRect.left - dragStartPos.x) / previewRect.width) * 100;
      const newY = ((e.clientY - previewRect.top - dragStartPos.y) / previewRect.height) * 100;
      
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
    
    setSelectedIconId(null);
    setSelectedStickerId(null);
    
    const touch = e.touches[0];
    const previewRect = previewRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();
    
    const offsetX = touch.clientX - textRect.left;
    const offsetY = touch.clientY - textRect.top;
    
    setDragStartPos({ x: offsetX, y: offsetY });
    onTextDragStart();
    
    const onTouchMove = (e: TouchEvent) => {
      if (!previewRef.current) return;
      
      const touch = e.touches[0];
      const previewRect = previewRef.current.getBoundingClientRect();
      
      const newX = ((touch.clientX - previewRect.left - dragStartPos.x) / previewRect.width) * 100;
      const newY = ((touch.clientY - previewRect.top - dragStartPos.y) / previewRect.height) * 100;
      
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

  const handleStickerClick = (e: React.MouseEvent, stickerId: string) => {
    e.stopPropagation();
    setSelectedStickerId(stickerId);
    setSelectedIconId(null);
    onIconSelect(null);
  };

  const handleStickerMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.stopPropagation();
    
    setSelectedIconId(null);
    setSelectedStickerId(stickerId);
    onIconSelect(null);
    
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker || !previewRef.current) return;
    
    const previewRect = previewRef.current.getBoundingClientRect();
    const stickerElem = e.currentTarget;
    const stickerRect = stickerElem.getBoundingClientRect();
    
    const offsetX = e.clientX - stickerRect.left;
    const offsetY = e.clientY - stickerRect.top;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const previewRect = previewRef.current.getBoundingClientRect();
      
      const x = ((e.clientX - offsetX - previewRect.left + stickerRect.width / 2) / previewRect.width) * 100;
      const y = ((e.clientY - offsetY - previewRect.top + stickerRect.height / 2) / previewRect.height) * 100;
      
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));
      
      onStickerMove(stickerId, { x: boundedX, y: boundedY });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleIconClick = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    setSelectedIconId(iconId);
    setSelectedStickerId(null);
    onIconSelect(iconId);
  };

  const handleIconMouseDown = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    
    setSelectedIconId(iconId);
    setSelectedStickerId(null);
    onIconSelect(iconId);
    
    const icon = icons.find(i => i.id === iconId);
    if (!icon || !previewRef.current) return;
    
    const previewRect = previewRef.current.getBoundingClientRect();
    const iconRect = e.currentTarget.getBoundingClientRect();
    
    const offsetX = e.clientX - iconRect.left;
    const offsetY = e.clientY - iconRect.top;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const previewRect = previewRef.current.getBoundingClientRect();
      
      const x = ((e.clientX - offsetX - previewRect.left + iconRect.width / 2) / previewRect.width) * 100;
      const y = ((e.clientY - offsetY - previewRect.top + iconRect.height / 2) / previewRect.height) * 100;
      
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));
      
      onIconMove(iconId, { x: boundedX, y: boundedY });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRemoveBackgroundImage = () => {
    onBackgroundSelect('');
  };

  const handleBackgroundClick = () => {
    setSelectedStickerId(null);
    setSelectedIconId(null);
    onIconSelect(null);
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

  const renderJournalContent = (isDialog = false) => {
    return (
      <>
        {mood && (
          <div className="absolute top-4 left-4 text-lg">
            Mood: {moodOptions.find(m => m.value === mood)?.icon}
          </div>
        )}
        
        {isUploadedImage && backgroundImage && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              <div 
                className="absolute z-10 w-4 h-4 bg-white/30 hover:bg-white/60 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto"
                style={{
                  left: `${bgImagePosition.x - 20}%`,
                  top: `${bgImagePosition.y - 20}%`,
                }}
                onClick={handleRemoveBackgroundImage}
                title="Remove image"
              >
                <X className="w-2 h-2 text-gray-800" />
              </div>
            )}
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
            
            {stickers.filter(sticker => sticker.position.x > -100 && sticker.position.y > -100).map((sticker) => (
              <div
                key={sticker.id}
                className={`absolute cursor-move transition-all ${
                  selectedStickerId === sticker.id ? 'ring-2 ring-primary z-50' : 'hover:ring-1 hover:ring-primary/30 z-40'
                }`}
                style={{
                  left: `${sticker.position.x}%`,
                  top: `${sticker.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
                onClick={(e) => handleStickerClick(e, sticker.id)}
                tabIndex={0}
              >
                <img
                  src={sticker.url}
                  alt="Sticker"
                  className="w-16 h-16"
                  draggable={false}
                />
              </div>
            ))}

            {icons.filter(icon => icon.position.x > -100 && icon.position.y > -100).map((icon) => (
              <div
                key={icon.id}
                className={`absolute cursor-move transition-all ${
                  selectedIconId === icon.id ? 'ring-2 ring-primary z-50' : 'hover:ring-1 hover:ring-primary/30 z-40'
                }`}
                style={{
                  left: `${icon.position.x}%`,
                  top: `${icon.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
                onClick={(e) => handleIconClick(e, icon.id)}
                tabIndex={0}
              >
                {icon.style === 'outline' ? (
                  <div style={{
                    width: `${icon.size || 48}px`,
                    height: `${icon.size || 48}px`,
                    position: 'relative', 
                    isolation: 'isolate',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: icon.color || 'currentColor',
                      WebkitMaskImage: `url(${icon.url})`,
                      maskImage: `url(${icon.url})`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                    }} />
                  </div>
                ) : (
                  <img
                    src={icon.url}
                    alt="Icon"
                    style={{
                      width: `${icon.size || 48}px`,
                      height: `${icon.size || 48}px`,
                    }}
                    draggable={false}
                  />
                )}
              </div>
            ))}

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

  const getHueRotate = (hexColor: string): number => {
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    
    if (max === min) {
      h = 0; // achromatic
    } else {
      const d = max - min;
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    
    return h;
  };

  return (
    <div className="w-full lg:w-3/4 p-6 relative print:w-full print:p-0 min-h-[800px]">
      <div className="absolute top-4 right-4 z-10 flex gap-0.5 print:hidden">
        <StickerSelector onStickerSelect={handleStickerAdd} />
        
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
