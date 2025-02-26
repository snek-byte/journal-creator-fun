
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from 'lucide-react';
import { moodOptions } from './config/editorConfig';
import type { Mood } from '@/types/journal';
import { applyTextStyle } from '@/utils/unicodeTextStyles';

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
  const transformedText = applyTextStyle(text, textStyle as any);

  return (
    <div className="w-full lg:w-2/3 p-6 relative print:w-full print:p-0">
      <Button
        onClick={onTogglePreview}
        variant="ghost"
        className="absolute top-4 right-4 z-10 print:hidden"
      >
        {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>

      {showPreview && (
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
          className="w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 animate-fadeIn print:shadow-none print:rounded-none print:min-h-screen"
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
        </div>
      )}
    </div>
  );
}
