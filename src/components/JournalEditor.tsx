
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useJournalStore } from '@/store/journalStore';
import { useEffect } from 'react';
import { Printer } from 'lucide-react';
import { MoodSelector } from './journal/MoodSelector';
import { JournalStylingControls } from './journal/JournalStylingControls';
import { JournalPreview } from './journal/JournalPreview';
import type { Mood } from '@/types/journal';

export function JournalEditor() {
  const {
    currentEntry,
    showPreview,
    setText,
    setFont,
    setFontSize,
    setFontWeight,
    setFontColor,
    setGradient,
    setMood,
    setIsPublic,
    togglePreview,
    saveEntry,
    loadChallenge,
  } = useJournalStore();

  useEffect(() => {
    loadChallenge();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="w-full lg:w-1/3 p-6 border-r bg-white print:hidden">
        <div className="space-y-6">
          <MoodSelector
            mood={currentEntry.mood}
            isPublic={currentEntry.isPublic}
            onMoodChange={(mood: Mood) => setMood(mood)}
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
          />

          <Textarea
            placeholder="Start writing your journal entry..."
            value={currentEntry.text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none"
          />

          <div className="flex gap-4">
            <Button onClick={saveEntry} className="flex-1">
              Save Entry
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <JournalPreview
        showPreview={showPreview}
        text={currentEntry.text}
        mood={currentEntry.mood}
        font={currentEntry.font}
        fontSize={currentEntry.fontSize}
        fontWeight={currentEntry.fontWeight}
        fontColor={currentEntry.fontColor}
        gradient={currentEntry.gradient}
        onTogglePreview={togglePreview}
      />
    </div>
  );
}
