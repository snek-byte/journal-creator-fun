
import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Maximize2, Trash2, MinusSquare, PlusSquare, Paintbrush } from 'lucide-react';
import { moodOptions } from './config/editorConfig';
import type { Mood, Sticker, Icon } from '@/types/journal';
import { applyTextStyle } from '@/utils/unicodeTextStyles';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StickerSelector } from './StickerSelector';
import { IconSelector } from './IconSelector';
import { useJournalStore } from '@/store/journalStore';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";

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
  stickers: Sticker[];
  icons: Icon[];
  textPosition: { x: number, y: number };
  onStickerAdd: (sticker: Sticker) => void;
  onIconAdd: (icon: Icon) => void;
  onStickerMove: (stickerId: string, position: { x: number, y: number }) => void;
  onIconMove: (iconId: string, position: { x: number, y: number }) => void;
  onIconUpdate: (iconId: string, updates: Partial<Icon>) => void;
  onTextMove: (position: { x: number, y: number }) => void;
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
  textStyle = 'normal',
  stickers,
  icons,
  textPosition,
  onStickerAdd,
  onIconAdd,
  onStickerMove,
  onIconMove,
  onIconUpdate,
  onTextMove,
  onTogglePreview,
}: JournalPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showIconControls, setShowIconControls] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTextDragging, setIsTextDragging] = useState(false);
  const { removeSticker, removeIcon, updateIcon } = useJournalStore();

  const handleMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStickerId(stickerId);
    setSelectedIconId(null);
    setIsDragging(false);
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Check if moved more than a few pixels to count as dragging
      const diffX = Math.abs(moveEvent.clientX - startX);
      const diffY = Math.abs(moveEvent.clientY - startY);
      
      if (diffX > 3 || diffY > 3) {
        setIsDragging(true);
      }
      
      moveSticker(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      setSelectedStickerId(null);
      
      // If this wasn't a drag, then show delete button or delete on second click
      if (!isDragging) {
        // If delete button is already showing, delete on click
        if (showDeleteButton) {
          handleDeleteSticker(stickerId);
        } else {
          // Otherwise show delete button
          setShowDeleteButton(true);
          setSelectedStickerId(stickerId);
        }
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleIconMouseDown = (e: React.MouseEvent, iconId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIconId(iconId);
    setSelectedStickerId(null);
    setIsDragging(false);
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Check if moved more than a few pixels to count as dragging
      const diffX = Math.abs(moveEvent.clientX - startX);
      const diffY = Math.abs(moveEvent.clientY - startY);
      
      if (diffX > 3 || diffY > 3) {
        setIsDragging(true);
      }
      
      moveIcon(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      // If this wasn't a drag, then show controls for icon
      if (!isDragging) {
        setShowIconControls(true);
      } else {
        setSelectedIconId(null);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTextMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTextDragging(true);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveText(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = () => {
      setIsTextDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTextTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTextDragging(true);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveText(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      setIsTextDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const moveText = (clientX: number, clientY: number) => {
    if (!previewRef.current) return;
    
    const previewRect = previewRef.current.getBoundingClientRect();
    
    const x = ((clientX - previewRect.left) / previewRect.width) * 100;
    const y = ((clientY - previewRect.top) / previewRect.height) * 100;
    
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onTextMove({ x: clampedX, y: clampedY });
  };

  const handleTouchStart = (e: React.TouchEvent, stickerId: string) => {
    // Prevent default to avoid scrolling
    e.preventDefault();
    setSelectedStickerId(stickerId);
    setSelectedIconId(null);
    
    // Show delete button after long press (500ms)
    const timeoutId = window.setTimeout(() => {
      setShowDeleteButton(true);
    }, 500);
    
    setTouchTimeout(timeoutId);

    const touchStartX = e.touches[0].clientX;
    const touchStartY = e.touches[0].clientY;
    let hasMoved = false;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      // Check if touch has moved more than a small threshold
      const diffX = Math.abs(moveEvent.touches[0].clientX - touchStartX);
      const diffY = Math.abs(moveEvent.touches[0].clientY - touchStartY);
      
      if (diffX > 5 || diffY > 5) {
        hasMoved = true;
        // If moving, cancel the delete button timeout
        if (touchTimeout !== null) {
          clearTimeout(touchTimeout);
          setTouchTimeout(null);
        }
        setShowDeleteButton(false);
      }

      moveSticker(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      if (touchTimeout !== null) {
        clearTimeout(touchTimeout);
        setTouchTimeout(null);
      }
      
      // Only hide delete button if user moved the sticker
      if (hasMoved) {
        setShowDeleteButton(false);
      }
      
      setSelectedStickerId(null);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleIconTouchStart = (e: React.TouchEvent, iconId: string) => {
    // Prevent default to avoid scrolling
    e.preventDefault();
    setSelectedIconId(iconId);
    setSelectedStickerId(null);
    
    // Show controls after long press (500ms)
    const timeoutId = window.setTimeout(() => {
      setShowIconControls(true);
    }, 500);
    
    setTouchTimeout(timeoutId);

    const touchStartX = e.touches[0].clientX;
    const touchStartY = e.touches[0].clientY;
    let hasMoved = false;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      // Check if touch has moved more than a small threshold
      const diffX = Math.abs(moveEvent.touches[0].clientX - touchStartX);
      const diffY = Math.abs(moveEvent.touches[0].clientY - touchStartY);
      
      if (diffX > 5 || diffY > 5) {
        hasMoved = true;
        // If moving, cancel the controls timeout
        if (touchTimeout !== null) {
          clearTimeout(touchTimeout);
          setTouchTimeout(null);
        }
        setShowIconControls(false);
      }

      moveIcon(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      if (touchTimeout !== null) {
        clearTimeout(touchTimeout);
        setTouchTimeout(null);
      }
      
      // Only hide controls if user moved the icon
      if (hasMoved) {
        setShowIconControls(false);
        setSelectedIconId(null);
      }
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const moveSticker = (clientX: number, clientY: number) => {
    if (!previewRef.current || !selectedStickerId) return;
    
    const previewRect = previewRef.current.getBoundingClientRect();
    
    const x = ((clientX - previewRect.left) / previewRect.width) * 100;
    const y = ((clientY - previewRect.top) / previewRect.height) * 100;
    
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onStickerMove(selectedStickerId, { x: clampedX, y: clampedY });
  };

  const moveIcon = (clientX: number, clientY: number) => {
    if (!previewRef.current || !selectedIconId) return;
    
    const previewRect = previewRef.current.getBoundingClientRect();
    
    const x = ((clientX - previewRect.left) / previewRect.width) * 100;
    const y = ((clientY - previewRect.top) / previewRect.height) * 100;
    
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onIconMove(selectedIconId, { x: clampedX, y: clampedY });
  };

  const handleDeleteSticker = (stickerId: string) => {
    removeSticker(stickerId);
    setSelectedStickerId(null);
    setShowDeleteButton(false);
  };

  const handleDeleteIcon = (iconId: string) => {
    removeIcon(iconId);
    setSelectedIconId(null);
    setShowIconControls(false);
  };

  const handleResizeIcon = (iconId: string, increase: boolean) => {
    const selectedIcon = icons.find(icon => icon.id === iconId);
    if (!selectedIcon) return;
    
    const currentSize = selectedIcon.size || 48;
    const newSize = increase ? 
      Math.min(currentSize + 8, 128) : 
      Math.max(currentSize - 8, 16);
    
    onIconUpdate(iconId, { size: newSize });
  };
  
  const handleColorChange = (iconId: string, color: string) => {
    onIconUpdate(iconId, { color });
  };
  
  const handleBackgroundClick = () => {
    setSelectedStickerId(null);
    setSelectedIconId(null);
    setShowDeleteButton(false);
    setShowIconControls(false);
  };

  const PreviewContent = () => (
    <div
      ref={previewRef}
      style={{
        backgroundImage: gradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
      className="w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 animate-fadeIn print:shadow-none print:rounded-none print:min-h-screen relative"
      onClick={handleBackgroundClick}
    >
      {mood && (
        <div className="absolute top-4 left-4 text-lg">
          Mood: {moodOptions.find(m => m.value === mood)?.icon}
        </div>
      )}
      
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
          transform: 'translate(-50%, -50%)',
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
        <div
          key={sticker.id}
          className={`absolute touch-none select-none cursor-grab active:cursor-grabbing
            ${selectedStickerId === sticker.id ? 'z-50 scale-110' : 'z-10'}
            ${showDeleteButton && selectedStickerId === sticker.id ? 'ring-2 ring-destructive' : ''}`}
          style={{
            left: `${sticker.position.x}%`,
            top: `${sticker.position.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: selectedStickerId === sticker.id ? 'none' : 'all 0.2s ease',
            padding: '8px',
          }}
          onMouseDown={(e) => handleMouseDown(e, sticker.id)}
          onTouchStart={(e) => handleTouchStart(e, sticker.id)}
        >
          <img
            src={sticker.url}
            alt="Sticker"
            className="w-16 h-16 object-contain pointer-events-none"
            draggable={false}
          />
          {showDeleteButton && selectedStickerId === sticker.id && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-4 -right-4 h-8 w-8 rounded-full shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSticker(sticker.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {icons.map((icon) => (
        <div
          key={icon.id}
          className={`absolute touch-none select-none cursor-grab active:cursor-grabbing
            ${selectedIconId === icon.id ? 'z-50 scale-110' : 'z-10'}
            ${showIconControls && selectedIconId === icon.id ? 'ring-2 ring-primary' : ''}`}
          style={{
            left: `${icon.position.x}%`,
            top: `${icon.position.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: selectedIconId === icon.id ? 'none' : 'all 0.2s ease',
            padding: '8px',
          }}
          onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
          onTouchStart={(e) => handleIconTouchStart(e, icon.id)}
        >
          <img
            src={icon.url}
            alt="Icon"
            className="object-contain pointer-events-none"
            draggable={false}
            style={{ 
              width: `${icon.size || 48}px`, 
              height: `${icon.size || 48}px`,
              filter: icon.style === 'outline' && icon.color ? 
                `brightness(0) saturate(100%) ${icon.color === '#000000' ? '' : `drop-shadow(0 0 0 ${icon.color})`}` : 
                'none',
            }}
          />
          
          {showIconControls && selectedIconId === icon.id && (
            <div className="absolute -top-10 -right-4 flex flex-col gap-1">
              <div className="flex gap-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-md bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResizeIcon(icon.id, false);
                  }}
                >
                  <MinusSquare className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-md bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResizeIcon(icon.id, true);
                  }}
                >
                  <PlusSquare className="h-4 w-4" />
                </Button>
                
                {icon.style === 'outline' && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full shadow-md bg-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Paintbrush className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" onClick={(e) => e.stopPropagation()}>
                      <HexColorPicker 
                        color={icon.color || '#000000'} 
                        onChange={(color) => handleColorChange(icon.id, color)} 
                      />
                    </PopoverContent>
                  </Popover>
                )}
                
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteIcon(icon.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Instructions - show when sticker is selected */}
      {selectedStickerId && showDeleteButton && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 p-2 rounded-md text-xs text-center shadow-md backdrop-blur-sm">
          Click the delete button to remove sticker
        </div>
      )}
      
      {/* Instructions - show when icon is selected */}
      {selectedIconId && showIconControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 p-2 rounded-md text-xs text-center shadow-md backdrop-blur-sm">
          Use controls to resize, change color, or delete icon
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full lg:w-3/4 p-6 relative print:w-full print:p-0 min-h-[800px]">
      <div className="absolute top-4 right-4 z-10 flex gap-2 print:hidden">
        <StickerSelector onStickerSelect={onStickerAdd} />
        <IconSelector onIconSelect={onIconAdd} />
        <Button
          onClick={onTogglePreview}
          variant="ghost"
          size="icon"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        
        {showPreview && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh]">
              <PreviewContent />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {showPreview && <PreviewContent />}
    </div>
  );
}
