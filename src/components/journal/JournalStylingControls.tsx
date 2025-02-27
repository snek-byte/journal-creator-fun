
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fontOptions, fontSizes, fontWeights } from "./config/editorConfig";
import { textStyles } from "@/utils/unicodeTextStyles";

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
}: JournalStylingControlsProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <label className="text-[10px] font-medium">Text Style</label>
        <Select onValueChange={onTextStyleChange} defaultValue="normal">
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

      <div className="space-y-0.5">
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

      <div className="grid grid-cols-2 gap-1.5">
        <div className="space-y-0.5">
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

        <div className="space-y-0.5">
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
      </div>

      <div className="space-y-0.5">
        <label className="text-[10px] font-medium">Font Color</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => onFontColorChange(e.target.value)}
          className="w-full h-7 rounded-md cursor-pointer"
        />
      </div>
      
      <div className="text-[9px] text-muted-foreground">
        <p>Use the background selector in the journal toolbar to set gradients or images.</p>
      </div>
    </div>
  );
}
