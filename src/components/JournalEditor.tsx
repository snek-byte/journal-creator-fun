import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useJournalStore } from '@/store/journalStore';
import { useEffect, useRef } from 'react';
import { Eye, EyeOff, Printer, LightbulbIcon, Award, Trophy } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { moodOptions } from "@/constants/moods";
import type { Mood } from '@/types/journal';

const fontOptions = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'lato', label: 'Lato' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'playfair-display', label: 'Playfair Display' },
  { value: 'merriweather', label: 'Merriweather' },
  { value: 'source-serif-pro', label: 'Source Serif Pro' },
  { value: 'josefin-sans', label: 'Josefin Sans' },
  { value: 'work-sans', label: 'Work Sans' },
  { value: 'quicksand', label: 'Quicksand' },
  { value: 'space-grotesk', label: 'Space Grotesk' },
  { value: 'dm-sans', label: 'DM Sans' },
  { value: 'nunito', label: 'Nunito' },
  { value: 'raleway', label: 'Raleway' },
  { value: 'dancing-script', label: 'Dancing Script' },
  { value: 'pacifico', label: 'Pacifico' },
  { value: 'great-vibes', label: 'Great Vibes' },
  { value: 'satisfy', label: 'Satisfy' },
  { value: 'caveat', label: 'Caveat' },
  { value: 'sacramento', label: 'Sacramento' },
  { value: 'carattere', label: 'Carattere' },
  { value: 'birthstone', label: 'Birthstone' },
  { value: 'lobster', label: 'Lobster' },
  { value: 'petit-formal-script', label: 'Petit Formal Script' }
];

const fontSizes = [
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '24px', label: '24px' },
];

const fontWeights = [
  { value: '300', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: 'bold', label: 'Bold' },
  { value: '700', label: 'Extra Bold' },
];

const gradients = [
  { 
    value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    label: 'Warm Flame'
  },
  { 
    value: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
    label: 'Morning Glory'
  },
  { 
    value: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
    label: 'Sweet Period'
  },
  { 
    value: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    label: 'Ocean Blue'
  },
  { 
    value: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    label: 'Soft Blue'
  },
  {
    value: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
    label: 'Peach'
  },
  {
    value: 'linear-gradient(to right, #b2f7ef 0%, #56cfe1 100%)',
    label: 'Crystal Clear'
  },
  {
    value: 'linear-gradient(to right, #f77062 0%, #fe5196 100%)',
    label: 'Burning Rose'
  },
  {
    value: 'linear-gradient(to right, #9795f0 0%, #fbc8d4 100%)',
    label: 'Lavender Blush'
  },
  {
    value: 'linear-gradient(to right, #e0c3fc 0%, #8ec5fc 100%)',
    label: 'Purple Lake'
  },
  {
    value: 'linear-gradient(to right, #c7ceea 0%, #a29bfe 100%)',
    label: 'Misty Mountains'
  },
  {
    value: 'linear-gradient(to right, #f7971e 0%, #ffd200 100%)',
    label: 'Golden Hour'
  },
  {
    value: 'linear-gradient(to right, #485563 0%, #29323c 100%)',
    label: 'Midnight'
  },
  {
    value: 'linear-gradient(to right, #ee9ca7 0%, #ffdde1 100%)',
    label: 'Cherry Blossom'
  },
  {
    value: 'linear-gradient(to right, #2193b0 0%, #6dd5ed 100%)',
    label: 'Caribbean Blue'
  }
];

export function JournalEditor() {
  const {
    currentEntry,
    dailyChallenge,
    progress,
    showPreview,
    setText,
    setFont,
    setFontSize,
    setFontWeight,
    setFontColor,
    setGradient,
    setMood,
    setMoodNote,
    setIsPublic,
    togglePreview,
    saveEntry,
    loadChallenge,
    applyChallenge
  } = useJournalStore();

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChallenge();
  }, []);

  const handlePrint = () => {
    if (!showPreview) {
      togglePreview();
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Journal Entry</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=${currentEntry.font}&display=swap');
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              min-height: 100vh;
              background-image: ${currentEntry.gradient};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .journal-page {
              padding: 40px;
              min-height: 100vh;
              font-family: ${currentEntry.font}, sans-serif;
              font-size: ${currentEntry.fontSize};
              font-weight: ${currentEntry.fontWeight};
              color: ${currentEntry.fontColor};
              box-sizing: border-box;
            }
            .mood {
              font-size: 2rem;
              margin-bottom: 1.5rem;
            }
            .entry-text {
              white-space: pre-wrap;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="journal-page">
            ${currentEntry.mood ? `<div class="mood">${moodOptions.find(m => m.value === currentEntry.mood)?.icon}</div>` : ''}
            <div class="entry-text">${currentEntry.text || "Start writing your journal entry..."}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="w-full lg:w-1/3 p-6 border-r bg-white print:hidden">
        {dailyChallenge && (
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <LightbulbIcon className="w-5 h-5 text-amber-500" />
                Daily Challenge
              </h3>
              <Badge variant="secondary">+20 XP</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{dailyChallenge.prompt}</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={applyChallenge}
            >
              Use This Prompt
            </Button>
          </div>
        )}

        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              Progress
            </h3>
            <Badge variant="secondary">
              {progress.totalXp} XP
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Current Streak:</span>
              <span>{progress.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span>Total Entries:</span>
              <span>{progress.totalEntries}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">How are you feeling?</label>
            <Select 
              value={currentEntry.mood} 
              onValueChange={(value: Mood) => setMood(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      {option.icon} {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Make Entry Public</label>
            <Switch
              checked={currentEntry.isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Font Family</label>
            <Select value={currentEntry.font} onValueChange={setFont}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <Select value={currentEntry.fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Font Weight</label>
            <Select value={currentEntry.fontWeight} onValueChange={setFontWeight}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Font Color</label>
            <input
              type="color"
              value={currentEntry.fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Background</label>
            <Select value={currentEntry.gradient} onValueChange={setGradient}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gradients.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

      <div className="w-full lg:w-2/3 p-6 relative print:w-full print:p-0">
        <Button
          onClick={togglePreview}
          variant="ghost"
          className="absolute top-4 right-4 z-10 print:hidden"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>

        {showPreview && (
          <div
            ref={previewRef}
            style={{
              backgroundImage: currentEntry.gradient,
              fontFamily: currentEntry.font,
              fontSize: currentEntry.fontSize,
              fontWeight: currentEntry.fontWeight,
              color: currentEntry.fontColor,
            }}
            className="w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 animate-fadeIn print:shadow-none print:rounded-none print:min-h-screen"
          >
            <div className="w-full h-full p-8">
              {currentEntry.mood && (
                <div className="mb-4 text-lg">
                  {moodOptions.find(m => m.value === currentEntry.mood)?.icon}
                </div>
              )}
              <div className="w-full h-full whitespace-pre-wrap">
                {currentEntry.text || "Start writing your journal entry..."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
