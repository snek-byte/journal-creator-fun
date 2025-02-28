
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fontOptions, fontSizes, fontWeights, gradients } from "./config/editorConfig";
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
  selectedIconId?: string | null;
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
  selectedIconId
}: JournalStylingControlsProps) {
  return (
    <div className="space-y-4">
      {/* Text Styling Controls Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-tight">
          {selectedIconId ? "Icon Styling" : "Text Styling"}
        </h3>
        
        {!selectedIconId && (
          <div className="space-y-2">
            <div className="space-y-0.5">
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
        )}

        <div className="space-y-0.5">
          <label className="text-[10px] font-medium">
            {selectedIconId ? "Icon Size" : "Font Size"}
          </label>
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
          <label className="text-[10px] font-medium">
            {selectedIconId ? "Icon Color" : "Font Color"}
          </label>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => onFontColorChange(e.target.value)}
            className="w-full h-7 rounded-md cursor-pointer"
          />
        </div>
      </div>

      {/* Background Controls Section - Only show when not editing an icon */}
      {!selectedIconId && (
        <div className="space-y-3 mt-6 pt-6 border-t">
          <h3 className="text-xs font-semibold tracking-tight">Background</h3>
          
          <div className="space-y-2">
            <label className="text-[10px] font-medium">Background Gradient</label>
            <div className="grid grid-cols-3 gap-2">
              {gradients.slice(0, 6).map((gradientOption, index) => (
                <button
                  key={index}
                  onClick={() => onGradientChange(gradientOption.value)}
                  className={`h-12 rounded-md overflow-hidden border transition-all ${
                    gradient === gradientOption.value ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'
                  }`}
                  style={{ background: gradientOption.value }}
                  aria-label={gradientOption.label}
                />
              ))}
            </div>
          </div>
          
          <div className="text-[9px] text-muted-foreground">
            <p>Use the background selector in the journal toolbar to set images or view more gradients.</p>
          </div>
        </div>
      )}
    </div>
  );
}
