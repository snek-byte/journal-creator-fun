
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fontOptions, fontSizes, fontWeights } from "./config/editorConfig";
import { textStyles } from "@/utils/unicodeTextStyles";
import { useState, useEffect } from "react";

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
  const [iconSize, setIconSize] = useState("48");
  const [iconColor, setIconColor] = useState("#000000");

  // When an icon is selected, update the local state to show its properties
  useEffect(() => {
    if (selectedIconId) {
      // Use default values initially, the actual icon properties would be set by the parent
      setIconSize("48");
      setIconColor(fontColor || "#000000");
    }
  }, [selectedIconId, fontColor]);

  // Handle icon size change and pass it to the parent
  const handleIconSizeChange = (value: string) => {
    setIconSize(value);
    onFontSizeChange(value);
  };

  // Handle icon color change and pass it to the parent
  const handleIconColorChange = (value: string) => {
    setIconColor(value);
    onFontColorChange(value);
  };

  return (
    <div className="space-y-6">
      {/* Text Styling Controls Section - Always visible */}
      {!selectedIconId && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-tight">Text Styling</h3>
          
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

            <div className="space-y-0.5">
              <label className="text-[10px] font-medium">Font Color</label>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => onFontColorChange(e.target.value)}
                className="w-full h-7 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Icon Styling Section - Only visible when icon is selected */}
      {selectedIconId && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-tight">Icon Styling</h3>
          <div className="space-y-2 border-2 border-primary/10 bg-primary/5 p-3 rounded-md">
            <p className="text-[10px] text-primary/70 font-medium">
              Editing Icon
            </p>
            
            <div className="space-y-0.5">
              <label className="text-[10px] font-medium">Icon Size</label>
              <Select value={iconSize} onValueChange={handleIconSizeChange}>
                <SelectTrigger className="h-7 text-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "24", label: "Small (24px)" },
                    { value: "48", label: "Medium (48px)" },
                    { value: "64", label: "Large (64px)" },
                    { value: "96", label: "X-Large (96px)" }
                  ].map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-[10px]">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-0.5">
              <label className="text-[10px] font-medium">Icon Color</label>
              <input
                type="color"
                value={iconColor}
                onChange={(e) => handleIconColorChange(e.target.value)}
                className="w-full h-7 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
