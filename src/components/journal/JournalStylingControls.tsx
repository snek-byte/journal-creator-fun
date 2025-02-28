
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fontOptions, fontSizes, fontWeights } from "./config/editorConfig";
import { textStyles } from "@/utils/unicodeTextStyles";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCw, RotateCcw } from "lucide-react";

interface JournalStylingControlsProps {
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  onFontChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onFontWeightChange: (value: string) => void;
  onFontColorChange: (value: string) => void;
  onGradientChange: (value: string) => void;
  onTextStyleChange: (value: string) => void;
  onEmojiRotate?: (degrees: number) => void;
  selectedIconId?: string | null;
  selectedEmojiId?: string | null;
}

export function JournalStylingControls({
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
  onFontColorChange,
  onGradientChange,
  onTextStyleChange,
  onEmojiRotate,
  selectedIconId,
  selectedEmojiId
}: JournalStylingControlsProps) {
  // Parse fontSize to number for the slider
  const currentSize = parseInt(fontSize.replace('px', '')) || 16;
  
  return (
    <div className="mt-0 pt-0 -mx-4 -mt-2">
      {/* Text Styling Controls Section - Only visible when no emoji or icon is selected */}
      {!selectedIconId && !selectedEmojiId && (
        <div className="space-y-1">
          <div>
            <label className="text-[10px] font-medium">Text Style</label>
            <Select 
              onValueChange={onTextStyleChange} 
              defaultValue="normal"
            >
              <SelectTrigger className="h-7 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {textStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="text-[10px]">
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[10px] font-medium">Font Family</label>
            <Select value={font} onValueChange={onFontChange}>
              <SelectTrigger className="h-7 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[10px]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[10px] font-medium">Font Size</label>
            <Select value={fontSize} onValueChange={onFontSizeChange}>
              <SelectTrigger className="h-7 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[10px]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[10px] font-medium">Font Weight</label>
            <Select value={fontWeight} onValueChange={onFontWeightChange}>
              <SelectTrigger className="h-7 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[10px]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[10px] font-medium">Font Color</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => onFontColorChange(e.target.value)}
              className="w-full h-7 rounded-md cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Icon Styling Section - Only visible when icon is selected */}
      {selectedIconId && (
        <div className="border-2 border-primary/10 bg-primary/5 p-2 rounded-md">
          <p className="text-[10px] text-primary/70 font-medium mb-1">
            Editing Icon
          </p>
          
          <div>
            <label className="text-[10px] font-medium">Icon Size</label>
            <Select value={fontSize} onValueChange={onFontSizeChange}>
              <SelectTrigger className="h-7 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[10px]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-1">
            <label className="text-[10px] font-medium">Icon Color</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => onFontColorChange(e.target.value)}
              className="w-full h-7 rounded-md cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Emoji Styling Section - Only visible when emoji is selected */}
      {selectedEmojiId && onEmojiRotate && (
        <div className="border-2 border-primary/10 bg-primary/5 p-2 rounded-md">
          <p className="text-[10px] text-primary/70 font-medium mb-1">
            Editing Emoji
          </p>
          
          <div>
            <label className="text-[10px] font-medium">Emoji Size</label>
            <div className="py-1">
              <Slider
                defaultValue={[currentSize]}
                min={12}
                max={120}
                step={1}
                onValueChange={(values) => onFontSizeChange(`${values[0]}px`)}
              />
            </div>
          </div>

          <div className="mt-1">
            <label className="text-[10px] font-medium">Rotation</label>
            <div className="flex justify-between gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => onEmojiRotate(-15)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => onEmojiRotate(15)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[9px] text-center text-muted-foreground mt-1">
              Double-click the emoji to rotate 45°
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
