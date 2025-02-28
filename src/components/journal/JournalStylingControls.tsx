
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fontOptions, fontSizes, fontWeights } from "./config/editorConfig";
import { textStyles } from "@/utils/unicodeTextStyles";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="space-y-4">
      {selectedIconId ? (
        // Icon Styling Section - Only visible when icon is selected
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-tight">Icon Styling</h3>
          <div className="space-y-2 border-2 border-primary/10 bg-primary/5 p-3 rounded-md">
            <p className="text-[10px] text-primary/70 font-medium">
              Editing Icon
            </p>
            
            <div className="space-y-0.5">
              <Label className="text-[10px] font-medium">Icon Size</Label>
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
              <Label className="text-[10px] font-medium">Icon Color</Label>
              <input
                type="color"
                value={iconColor}
                onChange={(e) => handleIconColorChange(e.target.value)}
                className="w-full h-7 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>
      ) : (
        // Text Styling Controls Section - Visible when no icon is selected
        <Tabs defaultValue="font" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="font" className="text-[10px]">Font</TabsTrigger>
            <TabsTrigger value="color" className="text-[10px]">Color</TabsTrigger>
            <TabsTrigger value="style" className="text-[10px]">Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="font" className="space-y-3">
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-[10px] font-medium">Font Family</Label>
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

              <div className="space-y-1">
                <Label className="text-[10px] font-medium">Font Size</Label>
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

              <div className="space-y-1">
                <Label className="text-[10px] font-medium">Font Weight</Label>
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
          </TabsContent>
          
          <TabsContent value="color" className="space-y-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">Font Color</Label>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => onFontColorChange(e.target.value)}
                className="w-full h-7 rounded-md cursor-pointer"
              />
            </div>
            
            <div className="space-y-1 pt-2">
              <Label className="text-[10px] font-medium">Preview</Label>
              <div 
                className="w-full h-12 rounded-md flex items-center justify-center text-sm"
                style={{ 
                  backgroundColor: 'white',
                  color: fontColor,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontWeight: fontWeight
                }}
              >
                Sample Text
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">Text Style</Label>
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
            
            <div className="space-y-1 pt-2">
              <Label className="text-[10px] font-medium">Style Preview</Label>
              <div className="grid grid-cols-2 gap-2">
                {textStyles.slice(0, 6).map((style) => (
                  <div 
                    key={style.value}
                    className="p-2 text-[10px] border border-gray-200 rounded-md hover:bg-accent text-center cursor-default"
                    style={{
                      fontStyle: style.value.includes('italic') ? 'italic' : 'normal',
                      textDecoration: style.value.includes('underline') ? 'underline' : 'none',
                      textAlign: style.value.includes('center') ? 'center' : 'left',
                    }}
                  >
                    {style.label}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
