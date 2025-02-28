
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Maximize2, Trash2, MinusSquare, PlusSquare, Pencil, ImagePlus, Palette, Sticker, Bookmark } from 'lucide-react';
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
  onStickerAdd: (sticker: StickerType) => void;
  onIconAdd: (icon: Icon) => void;
  onStickerMove: (stickerId: string, position: { x: number, y: number }) => void;
  onIconMove: (iconId: string, position: { x: number, y: number }) => void;
  onIconUpdate: (iconId: string, updates: Partial<Icon>) => void;
  onTextMove: (position: { x: number, y: number }) => void;
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
  onStickerAdd,
  onIconAdd,
  onIconMove,
  onIconUpdate,
  onStickerMove,
  onTextMove,
  onBackgroundSelect,
  onDrawingChange,
  onFilterChange,
  onTogglePreview
}: JournalPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isTextDragging, setIsTextDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showIconControls, setShowIconControls] = useState(false);
  const [iconSize, setIconSize] = useState<number>(48);

  useEffect(() => {
    if (selectedIconId) {
      const icon = icons.find(i => i.id === selectedIconId);
      if (icon) {
        setIconSize(icon.size || 48);
      }
    }
  }, [selectedIconId, icons]);

  const getBackground = () => {
    if (backgroundImage) {
      return `url(${backgroundImage})`;
    }
    return gradient;
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

  const handleTextMouseDown = (e: React.MouseEvent) => {
    if (!textRef.current) return;
    
    e.preventDefault();
    
    const rect = textRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsTextDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isTextDragging || !previewRef.current) return;
      
      const previewRect = previewRef.current.getBoundingClientRect();
      const x = ((e.clientX - previewRect.left - dragOffset.x) / previewRect.width) * 100;
      const y = ((e.clientY - previewRect.top - dragOffset.y) / previewRect.height) * 100;
      
      onTextMove({ x, y });
    };
    
    const handleMouseUp = () => {
      setIsTextDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTextTouchStart = (e: React.TouchEvent) => {
    if (!textRef.current) return;
    
    const touch = e.touches[0];
    const rect = textRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsTextDragging(true);
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTextDragging || !previewRef.current) return;
      
      const touch = e.touches[0];
      const previewRect = previewRef.current.getBoundingClientRect();
      const x = ((touch.clientX - previewRect.left - dragOffset.x) / previewRect.width) * 100;
      const y = ((touch.clientY - previewRect.top - dragOffset.y) / previewRect.height) * 100;
      
      onTextMove({ x, y });
    };
    
    const handleTouchEnd = () => {
      setIsTextDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
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

  const handleIconClick = (iconId: string) => {
    setSelectedIconId(iconId);
    setShowIconControls(true);
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

  return (
    <div className="w-full lg:w-3/4 p-6 relative print:w-full print:p-0 min-h-[800px]">
      <div className="absolute top-4 right-4 z-10 flex gap-2 print:hidden">
        <StickerSelector onStickerSelect={handleStickerAdd}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent hover:text-accent-foreground"
            title="Add stickers"
          >
            <Sticker className="w-4 h-4" />
          </Button>
        </StickerSelector>
        
        <IconSelector onIconSelect={handleIconAdd}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent hover:text-accent-foreground"
            title="Add icons"
          >
            <Bookmark className="w-4 h-4" />
          </Button>
        </IconSelector>
        
        <BackgroundImageSelector onImageSelect={onBackgroundSelect}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent hover:text-accent-foreground"
            title="Choose background"
          >
            <ImagePlus className="w-4 h-4" />
          </Button>
        </BackgroundImageSelector>
        
        <ImageFilterSelector 
          onFilterSelect={onFilterChange}
          currentFilter={filter || 'none'}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent hover:text-accent-foreground"
            title="Apply filters"
          >
            <Palette className="w-4 h-4" />
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
            <DialogContent className="w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh]">
              <div
                style={{
                  background: getBackground(),
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  filter: getFilterStyle(),
                }}
                className="w-full h-full rounded-lg overflow-hidden shadow-lg"
              >
                {/* Dialog Preview Content */}
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
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
            filter: getFilterStyle(),
          }}
          className="w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 animate-fadeIn print:shadow-none print:rounded-none print:min-h-screen relative"
          onClick={handleBackgroundClick}
        >
          {mood && (
            <div className="absolute top-4 left-4 text-lg">
              Mood: {moodOptions.find(m => m.value === mood)?.icon}
            </div>
          )}
          
          {isDrawingMode && (
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
                ref={textRef}
                style={{
                  fontFamily: font,
                  fontSize,
                  fontWeight,
                  color: fontColor,
                  left: `${textPosition.x}%`,
                  top: `${textPosition.y}%`,
                  maxWidth: '80%',
                  transform: 'translate(0, 0)',
                  transformOrigin: 'top left',
                }}
                className={`absolute whitespace-pre-wrap p-6 cursor-move select-none transition-colors rounded-lg
                  ${isTextDragging ? 'bg-black/5 ring-2 ring-primary/30' : 'hover:bg-black/5'}
                `}
                onMouseDown={handleTextMouseDown}
                onTouchStart={handleTextTouchStart}
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
                  }}
                  className={`absolute w-16 h-16 cursor-move transition-all hover:ring-2 hover:ring-primary
                    ${selectedStickerId === sticker.id ? 'ring-2 ring-primary' : ''}
                  `}
                  draggable={false}
                  onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
                />
              ))}

              {icons.filter(icon => icon.position.x > -100 && icon.position.y > -100).map((icon) => (
                <img
                  key={icon.id}
                  src={icon.url}
                  alt="Icon"
                  style={{
                    left: `${icon.position.x}%`,
                    top: `${icon.position.y}%`,
                    width: `${icon.size || 48}px`,
                    height: `${icon.size || 48}px`,
                    transform: 'translate(-50%, -50%)',
                    color: icon.color,
                  }}
                  className={`absolute cursor-pointer transition-all hover:ring-2 hover:ring-primary
                    ${selectedIconId === icon.id ? 'ring-2 ring-primary' : ''}
                  `}
                  onClick={() => handleIconClick(icon.id)}
                  draggable={false}
                />
              ))}
              
              {selectedStickerId && showDeleteButton && (
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
              
              {selectedIconId && showIconControls && (
                <div className="absolute z-10 right-4 bottom-4 flex gap-2">
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
        </div>
      )}
    </div>
  );
}
