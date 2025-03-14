
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { fontOptions, fontSizes, fontWeights } from '@/utils/editorConfig';
import { useEditorStore } from '@/store/editorStore';
import { Type, Bold, Italic, Underline } from 'lucide-react';

export function TextStyling() {
  const { 
    currentFont,
    currentFontSize,
    currentFontWeight,
    setFont,
    setFontSize,
    setFontWeight,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    activeMark
  } = useEditorStore();
  
  const handleFontSizeChange = (values: number[]) => {
    setFontSize(`${values[0]}px`);
  };
  
  // Extract numeric value from fontSize
  const fontSizeValue = parseInt(currentFontSize) || 16;
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="font-family">Font Family</Label>
        <Select
          value={currentFont}
          onValueChange={setFont}
        >
          <SelectTrigger id="font-family">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span className={`font-${font.value}`}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="font-size">Font Size</Label>
          <span className="text-xs font-medium">{fontSizeValue}px</span>
        </div>
        <Slider
          id="font-size"
          min={8}
          max={72}
          step={1}
          value={[fontSizeValue]}
          onValueChange={handleFontSizeChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="font-weight">Font Weight</Label>
        <Select
          value={currentFontWeight}
          onValueChange={setFontWeight}
        >
          <SelectTrigger id="font-weight">
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            {fontWeights.map((weight) => (
              <SelectItem key={weight.value} value={weight.value}>
                {weight.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Format</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeMark.includes('bold') ? "default" : "outline"}
            size="sm"
            onClick={toggleBold}
            className="flex-1"
          >
            <Bold className="h-4 w-4 mr-1" />
            Bold
          </Button>
          <Button
            variant={activeMark.includes('italic') ? "default" : "outline"}
            size="sm"
            onClick={toggleItalic}
            className="flex-1"
          >
            <Italic className="h-4 w-4 mr-1" />
            Italic
          </Button>
          <Button
            variant={activeMark.includes('underline') ? "default" : "outline"}
            size="sm"
            onClick={toggleUnderline}
            className="flex-1"
          >
            <Underline className="h-4 w-4 mr-1" />
            Underline
          </Button>
        </div>
      </div>
    </div>
  );
}
