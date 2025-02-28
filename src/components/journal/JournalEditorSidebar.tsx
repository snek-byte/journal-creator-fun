
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Smile, Mail, Undo, AreaChart } from 'lucide-react';
import { MoodSelector } from './MoodSelector';
import { JournalStylingControls } from './JournalStylingControls';
import { DailyChallenge } from './DailyChallenge';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiPicker from 'emoji-picker-react';
import type { Mood } from '@/types/journal';
import { EmojiClickData } from 'emoji-picker-react';
import { RefObject } from 'react';

interface JournalEditorSidebarProps {
  isDocked: boolean;
  toggleDocked: () => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  currentEntry: {
    text: string;
    font: string;
    fontSize: string;
    fontWeight: string;
    fontColor: string;
    gradient: string;
    mood?: Mood;
    isPublic: boolean;
  };
  dailyChallenge: {
    prompt: string;
  } | null;
  handlePrint: () => void;
  handleEmojiSelect: (emojiData: EmojiClickData) => void;
  setShowEmailDialog: (show: boolean) => void;
  setText: (text: string) => void;
  setMood: (mood: Mood) => void;
  setIsPublic: (isPublic: boolean) => void;
  setFont: (font: string) => void;
  setFontSize: (size: string) => void;
  setFontWeight: (weight: string) => void;
  setFontColor: (color: string) => void;
  setGradient: (gradient: string) => void;
  setTextStyle: (style: string) => void;
  saveEntry: () => void;
  loadChallenge: () => void;
  applyChallenge: () => void;
}

export function JournalEditorSidebar({
  isDocked,
  toggleDocked,
  textareaRef,
  currentEntry,
  dailyChallenge,
  handlePrint,
  handleEmojiSelect,
  setShowEmailDialog,
  setText,
  setMood,
  setIsPublic,
  setFont,
  setFontSize,
  setFontWeight,
  setFontColor,
  setGradient,
  setTextStyle,
  saveEntry,
  loadChallenge,
  applyChallenge,
}: JournalEditorSidebarProps) {
  return (
    <div className={`${
      isDocked 
        ? 'w-full lg:w-1/4 2xl:w-1/5 relative' 
        : 'w-64 fixed left-0 top-0 h-screen z-10 shadow-lg'
      } p-2 border-r bg-white print:hidden overflow-y-auto h-full transition-all duration-300`}>
      <div className="flex justify-end mb-0.5">
        <Button
          onClick={toggleDocked}
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          title={isDocked ? "Undock panel" : "Dock panel"}
        >
          {isDocked ? (
            <AreaChart className="h-2.5 w-2.5" />
          ) : (
            <Undo className="h-2.5 w-2.5" />
          )}
        </Button>
      </div>
      
      <div className="space-y-2 text-xs">
        {dailyChallenge && (
          <div className="mb-2">
            <DailyChallenge
              prompt={dailyChallenge.prompt}
              onRefresh={loadChallenge}
              onApply={applyChallenge}
            />
          </div>
        )}

        <MoodSelector
          mood={currentEntry.mood}
          isPublic={currentEntry.isPublic}
          onMoodChange={setMood}
          onIsPublicChange={setIsPublic}
        />

        <JournalStylingControls
          font={currentEntry.font}
          fontSize={currentEntry.fontSize}
          fontWeight={currentEntry.fontWeight}
          fontColor={currentEntry.fontColor}
          gradient={currentEntry.gradient}
          onFontChange={setFont}
          onFontSizeChange={setFontSize}
          onFontWeightChange={setFontWeight}
          onFontColorChange={setFontColor}
          onGradientChange={setGradient}
          onTextStyleChange={setTextStyle}
        />

        <div className="relative">
          <div className="absolute top-1 right-1 z-10">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <Smile className="h-2.5 w-2.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="end">
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  width="100%"
                  height={250}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Textarea
            ref={textareaRef}
            placeholder="Start writing your journal entry..."
            value={currentEntry.text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] resize-none pr-7 text-xs"
          />
        </div>

        <div className="flex gap-1 pt-1">
          <Button onClick={saveEntry} className="flex-1 h-7 text-[10px] px-1.5 py-0">
            Save Entry
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1 h-7 text-[10px] px-1.5 py-0">
            <Printer className="w-2.5 h-2.5 mr-1" />
            Print
          </Button>
          <Button 
            onClick={() => setShowEmailDialog(true)} 
            variant="outline" 
            className="flex-1 h-7 text-[10px] px-1.5 py-0"
          >
            <Mail className="w-2.5 h-2.5 mr-1" />
            Email
          </Button>
        </div>
      </div>
    </div>
  );
}
