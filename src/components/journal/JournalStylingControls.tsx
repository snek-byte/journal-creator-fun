
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fontOptions, fontSizes, fontWeights } from "./config/editorConfig";
import { textStyles, applyTextStyle } from "@/utils/unicodeTextStyles";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bold, Italic, AlignCenter, AlignLeft, Underline } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("font");
  const [iconSize, setIconSize] = useState(48);
  const [iconColor, setIconColor] = useState(fontColor || "#000000");
  const [textStyle, setTextStyle] = useState("normal");
  const [stylePreviewText, setStylePreviewText] = useState("Sample Text");
  const [textStylesInnerTab, setTextStylesInnerTab] = useState("basic");

  // Update local state when props change
  useEffect(() => {
    if (selectedIconId) {
      // For icons, we focus on size and color
      const numericSize = parseInt(fontSize);
      if (!isNaN(numericSize)) {
        setIconSize(numericSize);
      }
      setIconColor(fontColor || "#000000");
    }
  }, [selectedIconId, fontSize, fontColor]);

  // Handle icon size change
  const handleIconSizeChange = (value: number[]) => {
    setIconSize(value[0]);
    onFontSizeChange(`${value[0]}px`);
  };

  // Handle icon color change
  const handleIconColorChange = (value: string) => {
    setIconColor(value);
    onFontColorChange(value);
  };

  // Handle individual text style toggles
  const handleStyleToggle = (style: string) => {
    let newStyles: string[] = textStyle.split(" ").filter(s => s !== "");
    
    if (style === "normal") {
      // Reset all styles
      newStyles = ["normal"];
    } else if (newStyles.includes(style)) {
      // Remove this style
      newStyles = newStyles.filter(s => s !== style);
      if (newStyles.length === 0) newStyles = ["normal"];
    } else {
      // Add this style, remove 'normal' if present
      newStyles = newStyles.filter(s => s !== "normal");
      newStyles.push(style);
    }
    
    const newStyleString = newStyles.join(" ");
    setTextStyle(newStyleString);
    onTextStyleChange(newStyleString);
  };

  // Apply the specialized text style
  const applySpecialTextStyle = (style: string) => {
    setTextStyle(style);
    onTextStyleChange(style);
  };

  return (
    <div className="space-y-4">
      {selectedIconId ? (
        // Icon Styling Controls
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold tracking-tight">Icon Styling</h3>
            <div className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-sm">
              Icon Selected
            </div>
          </div>
          
          <Card className="p-4 space-y-4 bg-accent/30">
            {/* Icon Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-[11px] font-medium">Size</Label>
                <span className="text-[11px] font-mono">{iconSize}px</span>
              </div>
              <Slider
                value={[iconSize]}
                min={16}
                max={128}
                step={4}
                onValueChange={handleIconSizeChange}
              />
            </div>
            
            {/* Icon Color Picker */}
            <div className="space-y-2">
              <Label className="text-[11px] font-medium">Icon Color</Label>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded-full border flex-shrink-0"
                  style={{ backgroundColor: iconColor }}
                ></div>
                <Input
                  type="color"
                  value={iconColor}
                  onChange={(e) => handleIconColorChange(e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </div>
            
            {/* Delete Icon Reminder */}
            <div className="bg-muted/50 p-2 rounded-sm text-[10px] flex items-center gap-1 text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              <span>Press Delete key to remove the selected icon</span>
            </div>
          </Card>
        </div>
      ) : (
        // Text Styling Controls
        <Tabs defaultValue="font" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="font" className="text-[10px]">Font</TabsTrigger>
            <TabsTrigger value="color" className="text-[10px]">Color</TabsTrigger>
            <TabsTrigger value="style" className="text-[10px]">Style</TabsTrigger>
          </TabsList>
          
          {/* Font Selection Tab */}
          <TabsContent value="font" className="mt-4 space-y-4">
            <div className="space-y-3">
              {/* Font Family */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium">Font Family</Label>
                <Select value={font} onValueChange={onFontChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        style={{ fontFamily: option.value }}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Font Size */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium">Font Size</Label>
                <Select value={fontSize} onValueChange={onFontSizeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
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
              
              {/* Font Weight */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium">Font Weight</Label>
                <Select value={fontWeight} onValueChange={onFontWeightChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
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
            </div>
          </TabsContent>
          
          {/* Color Selection Tab */}
          <TabsContent value="color" className="mt-4 space-y-4">
            <div className="space-y-3">
              {/* Font Color */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium">Font Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded-full border flex-shrink-0"
                    style={{ backgroundColor: fontColor }}
                  ></div>
                  <Input
                    type="color"
                    value={fontColor}
                    onChange={(e) => onFontColorChange(e.target.value)}
                    className="w-full h-8"
                  />
                </div>
              </div>
              
              {/* Text Gradient */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium">Text Gradient</Label>
                <div className="grid grid-cols-3 gap-2">
                  {/* No gradient option */}
                  <button
                    className={`p-0.5 rounded border ${!gradient ? 'border-primary' : 'border-muted'} hover:border-primary`}
                    onClick={() => onGradientChange('')}
                  >
                    <div className="h-8 flex items-center justify-center text-[10px]">
                      No Gradient
                    </div>
                  </button>
                  
                  {/* Gradient options */}
                  <button
                    className={`p-0.5 rounded border ${gradient === 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' ? 'border-primary' : 'border-muted'} hover:border-primary`}
                    onClick={() => onGradientChange('linear-gradient(135deg, #f6d365 0%, #fda085 100%)')}
                    style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}
                  >
                    <div className="h-8"></div>
                  </button>
                  <button
                    className={`p-0.5 rounded border ${gradient === 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' ? 'border-primary' : 'border-muted'} hover:border-primary`}
                    onClick={() => onGradientChange('linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)')}
                    style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
                  >
                    <div className="h-8"></div>
                  </button>
                  <button
                    className={`p-0.5 rounded border ${gradient === 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' ? 'border-primary' : 'border-muted'} hover:border-primary`}
                    onClick={() => onGradientChange('linear-gradient(135deg, #fa709a 0%, #fee140 100%)')}
                    style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
                  >
                    <div className="h-8"></div>
                  </button>
                  <button
                    className={`p-0.5 rounded border ${gradient === 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' ? 'border-primary' : 'border-muted'} hover:border-primary`}
                    onClick={() => onGradientChange('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    <div className="h-8"></div>
                  </button>
                  <button
                    className={`p-0.5 rounded border ${gradient === 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' ? 'border-primary' : 'border-muted'} hover:border-primary`}
                    onClick={() => onGradientChange('linear-gradient(135deg, #ff0844 0%, #ffb199 100%)')}
                    style={{ background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' }}
                  >
                    <div className="h-8"></div>
                  </button>
                </div>
              </div>
              
              {/* Preview */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium">Preview</Label>
                <div className="border rounded-md p-3 min-h-12 flex items-center justify-center">
                  <div
                    className="text-center"
                    style={{
                      fontFamily: font,
                      fontSize: fontSize,
                      fontWeight: fontWeight,
                      color: fontColor,
                      backgroundImage: gradient,
                      WebkitBackgroundClip: gradient ? 'text' : 'unset',
                      WebkitTextFillColor: gradient ? 'transparent' : 'unset',
                    }}
                  >
                    Sample Text
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Style Selection Tab */}
          <TabsContent value="style" className="mt-4 space-y-4">
            <div className="space-y-3">
              {/* Text Style Tabs */}
              <Tabs defaultValue="basic" value={textStylesInnerTab} onValueChange={setTextStylesInnerTab}>
                <TabsList className="w-full grid grid-cols-2 mb-2">
                  <TabsTrigger value="basic" className="text-[10px]">Basic Styling</TabsTrigger>
                  <TabsTrigger value="fancy" className="text-[10px]">Text Styler</TabsTrigger>
                </TabsList>
                
                {/* Basic Styling Tab */}
                <TabsContent value="basic" className="mt-2 space-y-3">
                  {/* Text Style Buttons */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium">Text Style</Label>
                    <div className="flex gap-1">
                      <Button
                        variant={textStyle.includes("normal") ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStyleToggle("normal")}
                        title="Normal"
                      >
                        Normal
                      </Button>
                      <Button
                        variant={textStyle.includes("italic") ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleStyleToggle("italic")}
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={textStyle.includes("underline") ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleStyleToggle("underline")}
                        title="Underline"
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={textStyle.includes("bold") ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleStyleToggle("bold")}
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={textStyle.includes("center") ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleStyleToggle("center")}
                        title="Center"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Text Styler Tab */}
                <TabsContent value="fancy" className="mt-2 space-y-3">
                  {/* Text Styler Preview */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium">Preview Text</Label>
                    <Input 
                      value={stylePreviewText}
                      onChange={(e) => setStylePreviewText(e.target.value)}
                      placeholder="Enter text to style"
                      className="mb-3"
                    />
                  </div>
                  
                  {/* Fancy Text Styles */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium">Fancy Text Styles</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
                      {textStyles.map((style) => (
                        <button
                          key={style.value}
                          className={`p-2 rounded border ${
                            textStyle === style.value ? 'border-primary bg-primary/10' : 'border-muted'
                          } hover:border-primary text-left`}
                          onClick={() => applySpecialTextStyle(style.value)}
                        >
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">{style.label}</span>
                            <div className="mt-1 text-sm">
                              {style.value === 'normal' 
                                ? stylePreviewText 
                                : applyTextStyle(stylePreviewText, style.value)}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
