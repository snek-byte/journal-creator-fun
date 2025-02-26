
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fontOptions, fontSizes, fontWeights, gradients } from "./config/editorConfig";
import { textStyles } from "@/utils/unicodeTextStyles";
import { PatternGenerator } from "./PatternGenerator";

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
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Text Style</label>
        <Select onValueChange={onTextStyleChange} defaultValue="normal">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {textStyles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Font Family</label>
        <Select value={font} onValueChange={onFontChange}>
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
        <Select value={fontSize} onValueChange={onFontSizeChange}>
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
        <Select value={fontWeight} onValueChange={onFontWeightChange}>
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
          onChange={(e) => onFontColorChange(e.target.value)}
          className="w-full h-10 rounded-md cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Background</label>
        <Tabs defaultValue="gradients" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="gradients" className="flex-1">Gradients</TabsTrigger>
            <TabsTrigger value="patterns" className="flex-1">Patterns</TabsTrigger>
          </TabsList>
          <TabsContent value="gradients">
            <Select value={gradient} onValueChange={onGradientChange}>
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
          </TabsContent>
          <TabsContent value="patterns">
            <PatternGenerator onPatternSelect={onGradientChange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
