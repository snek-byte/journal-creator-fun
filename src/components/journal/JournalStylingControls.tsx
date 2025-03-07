
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TextStyleControls } from './styling/TextStyleControls';
import { ColorControls } from './styling/ColorControls';
import { TextEffectsControls } from './styling/TextEffectsControls';

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
