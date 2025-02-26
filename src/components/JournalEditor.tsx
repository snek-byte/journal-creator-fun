
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useJournalStore } from '@/store/journalStore';
import { useEffect } from 'react';
import { Printer, Lightbulb } from 'lucide-react';
import { MoodSelector } from './journal/MoodSelector';
import { JournalStylingControls } from './journal/JournalStylingControls';
import { JournalPreview } from './journal/JournalPreview';
import type { Mood } from '@/types/journal';

export function JournalEditor() {
  const {
    currentEntry,
    showPreview,
    dailyChallenge,
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
    applyChallenge,
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
          {dailyChallenge && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <h3 className="font-medium">Daily Challenge</h3>
                </div>
                <span className="text-sm font-medium text-yellow-800">+20 XP</span>
              </div>
              <p className="mb-4 text-gray-600">{dailyChallenge.prompt}</p>
              <Button 
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                variant="ghost"
                onClick={applyChallenge}
              >
                Use This Prompt
              </Button>
            </div>
          )}

          <div className="rounded-lg border border-pink-200 bg-pink-50/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-pink-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="font-medium">Progress</h3>
              </div>
              <span className="text-sm font-medium">0 XP</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span>0 days</span>
              </div>
              <div className="flex justify-between">
                <span>Total Entries:</span>
                <span>0</span>
              </div>
            </div>
          </div>

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
