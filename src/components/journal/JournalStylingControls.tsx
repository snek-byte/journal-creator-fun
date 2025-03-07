
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TextStyleControls } from './styling/TextStyleControls';
import { ColorControls } from './styling/ColorControls';
import { TextEffectsControls } from './styling/TextEffectsControls';
import { textStyles } from '@/utils/unicodeTextStyles';

interface JournalStylingControlsProps {
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  selectedIconId?: string | null;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onFontWeightChange: (weight: string) => void;
  onFontColorChange: (color: string) => void;
  onGradientChange: (gradient: string) => void;
  onTextStyleChange: (style: string) => void;
}

export function JournalStylingControls({
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  selectedIconId,
  onFontChange,
  onFontSizeChange,
  onFontWeightChange,
  onFontColorChange,
  onGradientChange,
  onTextStyleChange
}: JournalStylingControlsProps) {
  const [activeTab, setActiveTab] = useState('style');
  
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold tracking-tight">Text Styling</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="style" className="text-[10px]">Style</TabsTrigger>
          <TabsTrigger value="color" className="text-[10px]">Color</TabsTrigger>
          <TabsTrigger value="effects" className="text-[10px]">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="mt-0 space-y-4">
          <TextStyleControls
            font={font}
            fontSize={fontSize}
            fontWeight={fontWeight}
            onFontChange={onFontChange}
            onFontSizeChange={onFontSizeChange}
            onFontWeightChange={onFontWeightChange}
            onTextStyleChange={onTextStyleChange}
          />
          
          {/* Add text styling options directly under style tab */}
          <div className="space-y-2 pt-2">
            <span className="text-xs">Text Style</span>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
              {textStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => onTextStyleChange(style.value)}
                  className="text-xs px-2 py-1.5 bg-muted hover:bg-muted/80 rounded text-left truncate"
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="color" className="mt-0 space-y-4">
          <ColorControls
            fontColor={fontColor}
            gradient={gradient}
            onFontColorChange={onFontColorChange}
            onGradientChange={onGradientChange}
          />
        </TabsContent>
        
        <TabsContent value="effects" className="mt-0 space-y-4">
          <TextEffectsControls
            onTextStyleChange={onTextStyleChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
