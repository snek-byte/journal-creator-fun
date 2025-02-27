import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Maximize2, Trash2 } from 'lucide-react';
import { moodOptions } from './config/editorConfig';
import type { Mood, Sticker } from '@/types/journal';
import { applyTextStyle } from '@/utils/unicodeTextStyles';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StickerSelector } from './StickerSelector';
import { useJournalStore } from '@/store/journalStore';

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
  onStickerAdd: (sticker: Sticker) => void;
  onStickerMove: (stickerId: string, position: { x: number, y: number }) => void;
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
  onStickerAdd,
  onStickerMove,
  onTogglePreview,
}: JournalPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState<number | null>(null);
  const { removeSticker } = useJournalStore();

  const handleMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.preventDefault();
    setSelectedStickerId(stickerId);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveSticker(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = () => {
      setSelectedStickerId(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent, stickerId: string) => {
    // Prevent default to avoid scrolling
    e.preventDefault();
    setSelectedStickerId(stickerId);
    
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

  const moveSticker = (clientX: number, clientY: number) => {
    if (!previewRef.current || !selectedStickerId) return;
    
    const previewRect = previewRef.current.getBoundingClientRect();
    
    const x = ((clientX - previewRect.left) / previewRect.width) * 100;
    const y = ((clientY - previewRect.top) / previewRect.height) * 100;
    
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onStickerMove(selectedStickerId, { x: clampedX, y: clampedY });
  };

  const handleDeleteSticker = (stickerId: string) => {
    removeSticker(stickerId);
    setSelectedStickerId(null);
    setShowDeleteButton(false);
  };
  
  const handleStickerClick = (e: React.MouseEvent, stickerId: string) => {
    e.stopPropagation();
    if (selectedStickerId === stickerId) {
      setShowDeleteButton(!showDeleteButton);
    } else {
      setSelectedStickerId(stickerId);
      setShowDeleteButton(true);
    }
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
      onClick={() => {
        setSelectedStickerId(null);
        setShowDeleteButton(false);
      }}
    >
      <div className="w-full h-full p-8">
        {mood && (
          <div className="mb-4 text-lg">
            Mood: {moodOptions.find(m => m.value === mood)?.icon}
          </div>
        )}
        <div
          style={{
            fontFamily: font,
            fontSize,
            fontWeight,
            color: fontColor,
          }}
          className="w-full h-full whitespace-pre-wrap"
        >
          {textStyle && textStyle !== 'normal' 
            ? applyTextStyle(text || "Start writing your journal entry...", textStyle as any) 
            : (text || "Start writing your journal entry...")}
        </div>
      </div>
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className={`absolute touch-none select-none ${selectedStickerId === sticker.id ? 'z-50 scale-110' : 'z-10'}`}
          style={{
            left: `${sticker.position.x}%`,
            top: `${sticker.position.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: selectedStickerId === sticker.id ? 'none' : 'all 0.2s ease',
          }}
          onMouseDown={(e) => handleMouseDown(e, sticker.id)}
          onTouchStart={(e) => handleTouchStart(e, sticker.id)}
          onClick={(e) => handleStickerClick(e, sticker.id)}
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
              className="absolute -top-4 -right-4 h-8 w-8 rounded-full"
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
    </div>
  );

  return (
    <div className="w-full lg:w-3/4 p-6 relative print:w-full print:p-0 min-h-[800px]">
      <div className="absolute top-4 right-4 z-10 flex gap-2 print:hidden">
        <StickerSelector onStickerSelect={onStickerAdd} />
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
