
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useJournalStore } from '@/store/journalStore';
import { useRef } from 'react';
import { Download, Eye, EyeOff } from 'lucide-react';

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
  { value: 'bg-gradient-to-r from-purple-400 to-pink-500', label: 'Lavender' },
  { value: 'bg-gradient-to-r from-cyan-400 to-blue-500', label: 'Ocean' },
  { value: 'bg-gradient-to-r from-green-400 to-emerald-500', label: 'Forest' },
  { value: 'bg-gradient-to-r from-rose-400 to-red-500', label: 'Sunset' },
  { value: 'bg-gradient-to-r from-amber-200 to-yellow-400', label: 'Dawn' },
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

  const exportAsPDF = async () => {
    if (!previewRef.current) return;
    
    const canvas = await html2canvas(previewRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('journal-entry.pdf');
  };

  const exportAsImage = async () => {
    if (!previewRef.current) return;
    
    const canvas = await html2canvas(previewRef.current);
    const link = document.createElement('a');
    link.download = 'journal-entry.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Control Panel */}
      <div className="w-full lg:w-1/3 p-6 border-r bg-white">
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

          <div className="flex gap-2">
            <Button onClick={exportAsPDF} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Save as PDF
            </Button>
            <Button onClick={exportAsImage} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Save as Image
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-full lg:w-2/3 p-6 relative">
        <Button
          onClick={togglePreview}
          variant="ghost"
          className="absolute top-4 right-4 z-10"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>

        {showPreview && (
          <div
            ref={previewRef}
            className={`w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 animate-fadeIn ${gradient}`}
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
