
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
    <div className={`${isDocked ? 'w-full lg:w-1/3' : 'w-96'} p-6 border-r bg-white print:hidden ${
      !isDocked ? 'absolute left-0 top-0 z-10 h-full shadow-lg transition-all duration-300 transform' : ''
    }`}>
      <div className="flex justify-end mb-2">
        <Button
          onClick={toggleDocked}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title={isDocked ? "Undock panel" : "Dock panel"}
        >
          {isDocked ? (
            <AreaChart className="h-4 w-4" />
          ) : (
            <Undo className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="space-y-6">
        {dailyChallenge && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm mb-6">
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
          <div className="absolute top-2 right-2 z-10">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="end">
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  width="100%"
                  height={400}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Textarea
            ref={textareaRef}
            placeholder="Start writing your journal entry..."
            value={currentEntry.text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none pr-10"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={saveEntry} className="flex-1">
            Save Entry
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button 
            onClick={() => setShowEmailDialog(true)} 
            variant="outline" 
            className="flex-1"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>
      </div>
    </div>
  );
}
