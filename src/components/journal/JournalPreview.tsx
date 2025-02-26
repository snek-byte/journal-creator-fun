
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Maximize2 } from 'lucide-react';
import { moodOptions } from './config/editorConfig';
import type { Mood, Sticker } from '@/types/journal';
import { applyTextStyle } from '@/utils/unicodeTextStyles';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StickerSelector } from './StickerSelector';

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

  const handleMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!previewRef.current) return;
      const previewRect = previewRef.current.getBoundingClientRect();
      
      const x = ((moveEvent.clientX - previewRect.left) / previewRect.width) * 100;
      const y = ((moveEvent.clientY - previewRect.top) / previewRect.height) * 100;
      
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      onStickerMove(stickerId, { x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
          {text || "Start writing your journal entry..."}
        </div>
      </div>
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className="absolute cursor-move select-none"
          style={{
            left: `${sticker.position.x}%`,
            top: `${sticker.position.y}%`,
            transform: 'translate(-50%, -50%)',
            touchAction: 'none',
          }}
          onMouseDown={(e) => handleMouseDown(e, sticker.id)}
        >
          <img
            src={sticker.url}
            alt="Sticker"
            className="w-16 h-16 object-contain pointer-events-none"
            draggable={false}
          />
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
