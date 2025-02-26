
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Maximize2 } from 'lucide-react';
import { moodOptions } from './config/editorConfig';
import type { Mood } from '@/types/journal';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JournalPreviewProps {
  showPreview: boolean;
  text: string;
  mood?: Mood;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
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
  onTogglePreview,
}: JournalPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const PreviewContent = () => (
    <div
      style={{
        fontFamily: font,
        fontSize,
        fontWeight,
        color: fontColor,
      }}
      className="w-full h-full whitespace-pre-wrap"
    >
      {mood && (
        <div className="mb-4 text-lg">
          Mood: {moodOptions.find(m => m.value === mood)?.icon}
        </div>
      )}
      {text || "Start writing your journal entry..."}
    </div>
  );

  return (
    <div className="w-full lg:w-3/4 p-6 relative print:w-full print:p-0">
      <div className="flex gap-2 absolute top-4 right-4 z-10 print:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/80"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-6">
            <div
              style={{
                backgroundImage: gradient,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
              className="w-full h-full rounded-lg overflow-auto p-8"
            >
              <PreviewContent />
            </div>
          </DialogContent>
        </Dialog>
        <Button
          onClick={onTogglePreview}
          variant="ghost"
          size="icon"
          className="hover:bg-white/80"
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {showPreview && (
        <div
          ref={previewRef}
          style={{
            backgroundImage: gradient,
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          }}
          className="w-full h-full min-h-[calc(100vh-3rem)] rounded-lg overflow-hidden shadow-lg transition-all duration-300 animate-fadeIn print:shadow-none print:rounded-none print:min-h-screen p-8"
        >
          <PreviewContent />
        </div>
      )}
    </div>
  );
}
