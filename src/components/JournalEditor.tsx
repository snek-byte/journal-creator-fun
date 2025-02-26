
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useJournalStore } from '@/store/journalStore';
import { useRef } from 'react';
import { Eye, EyeOff, Printer } from 'lucide-react';

const fontOptions = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'lato', label: 'Lato' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'montserrat', label: 'Montserrat' },
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
  { value: 'bg-[linear-gradient(135deg,#f6d365_0%,#fda085_100%)]', label: 'Warm Flame' },
  { value: 'bg-[linear-gradient(120deg,#84fab0_0%,#8fd3f4_100%)]', label: 'Morning Glory' },
  { value: 'bg-[linear-gradient(120deg,#f093fb_0%,#f5576c_100%)]', label: 'Sweet Period' },
  { value: 'bg-[linear-gradient(to_right,#4facfe_0%,#00f2fe_100%)]', label: 'Ocean Blue' },
  { value: 'bg-[linear-gradient(120deg,#a1c4fd_0%,#c2e9fb_100%)]', label: 'Soft Blue' },
];

export function JournalEditor() {
  const {
    text,
    font,
    fontSize,
    fontWeight,
    fontColor,
    gradient,
    showPreview,
    setText,
    setFont,
    setFontSize,
    setFontWeight,
    setFontColor,
    setGradient,
    togglePreview,
  } = useJournalStore();

  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Control Panel - Hide during printing */}
      <div className="w-full lg:w-1/3 p-6 border-r bg-white print:hidden">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Family</label>
            <Select value={font} onValueChange={setFont}>
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
            <Select value={fontSize} onValueChange={setFontSize}>
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
            <Select value={fontWeight} onValueChange={setFontWeight}>
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
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Background</label>
            <Select value={gradient} onValueChange={setGradient}>
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
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none"
          />

          <Button onClick={handlePrint} className="w-full">
            <Printer className="w-4 h-4 mr-2" />
            Print Journal
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
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
            className={`w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 animate-fadeIn print:shadow-none print:rounded-none print:min-h-screen ${gradient}`}
          >
            <div className="w-full h-full p-8">
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
          </div>
        )}
      </div>
    </div>
  );
}
