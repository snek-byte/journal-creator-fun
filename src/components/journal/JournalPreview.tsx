
import { useRef, useState } from 'react';
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
  onTogglePreview,
}: JournalPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [draggingSticker, setDraggingSticker] = useState<string | null>(null);
  const transformedText = applyTextStyle(text, textStyle as any);

  const handleStickerAdd = (sticker: Sticker) => {
    setStickers([...stickers, sticker]);
  };

  const handleMouseDown = (e: React.MouseEvent, stickerId: string) => {
    setDraggingSticker(stickerId);
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!previewRef.current) return;
      const previewRect = previewRef.current.getBoundingClientRect();
      
      const x = ((moveEvent.clientX - previewRect.left - offsetX) / previewRect.width) * 100;
      const y = ((moveEvent.clientY - previewRect.top - offsetY) / previewRect.height) * 100;
      
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setStickers(stickers.map(s => 
        s.id === stickerId 
          ? { ...s, position: { x: clampedX, y: clampedY } }
          : s
      ));
    };

    const handleMouseUp = () => {
      setDraggingSticker(null);
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
          {transformedText || "Start writing your journal entry..."}
        </div>
      </div>
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className={`absolute cursor-move select-none ${draggingSticker === sticker.id ? 'z-50' : 'z-10'}`}
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
        <StickerSelector onStickerSelect={handleStickerAdd} />
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
