
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

  const handleStickerDragStart = (e: React.DragEvent, stickerId: string) => {
    setDraggingSticker(stickerId);
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    const img = e.currentTarget as HTMLImageElement;
    if (img) {
      e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
    }
  };

  const handleStickerDragEnd = (e: React.DragEvent) => {
    if (!draggingSticker || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp the position to stay within the preview bounds
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setStickers(stickers.map(s => 
      s.id === draggingSticker 
        ? { ...s, position: { x: clampedX, y: clampedY } }
        : s
    ));
    setDraggingSticker(null);
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
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleStickerDragEnd}
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
        <img
          key={sticker.id}
          src={sticker.url}
          alt="Sticker"
          className="absolute w-16 h-16 object-contain cursor-move"
          style={{
            left: `${sticker.position.x}%`,
            top: `${sticker.position.y}%`,
            transform: 'translate(-50%, -50%)',
            touchAction: 'none',
          }}
          draggable
          onDragStart={(e) => handleStickerDragStart(e, sticker.id)}
        />
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
