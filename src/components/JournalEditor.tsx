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
              backgroundImage: gradient,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
            className="w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 animate-fadeIn print:shadow-none print:rounded-none print:min-h-screen"
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
