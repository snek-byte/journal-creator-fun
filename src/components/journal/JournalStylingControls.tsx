
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TextStyleControls } from './styling/TextStyleControls';
import { ColorControls } from './styling/ColorControls';
import { TextEffectsControls } from './styling/TextEffectsControls';
import { WordArtStyles } from './styling/WordArtStyles';
import { textStyles } from '@/utils/unicodeTextStyles';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMediaQuery } from '@/hooks/use-mobile';

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
  const [styleChunkIndex, setStyleChunkIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Define smaller chunks of styles with only 4 per group
  const chunkSize = 4;
  const styleChunks = [];
  
  // Create chunks of 4 styles each
  for (let i = 0; i < textStyles.length; i += chunkSize) {
    styleChunks.push(textStyles.slice(i, i + chunkSize));
  }
  
  const hasMoreStyles = styleChunkIndex < styleChunks.length - 1;
  
  // Handle "more" button click
  const handleShowMoreStyles = () => {
    setStyleChunkIndex(prev => Math.min(prev + 1, styleChunks.length - 1));
  };
  
  // Handle "close" button click to collapse back to initial chunk
  const handleCloseStyles = () => {
    setStyleChunkIndex(0);
  };

  // Handle word art style selection
  const handleWordArtStyleSelect = (styleId: string) => {
    // For word art styles, we'll pass a special identifier
    onTextStyleChange(`wordart:${styleId}`);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold tracking-tight">Text Styling</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="style" className="text-[10px]">Style</TabsTrigger>
          <TabsTrigger value="color" className="text-[10px]">Color</TabsTrigger>
          <TabsTrigger value="effects" className="text-[10px]">Effects</TabsTrigger>
          <TabsTrigger value="wordart" className="text-[10px]">Word Art</TabsTrigger>
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
            <div className="flex justify-between items-center">
              <span className="text-xs">Text Style</span>
              {styleChunkIndex > 0 && (
                <Button 
                  variant="ghost" 
                  size="xs" 
                  onClick={handleCloseStyles}
                  className="h-6 px-2 py-0 text-xs text-blue-500 flex items-center"
                >
                  <ChevronUp className="h-3 w-3 mr-1" />
                  close
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {styleChunks[0].map((style) => (
                <button
                  key={style.value}
                  onClick={() => onTextStyleChange(style.value)}
                  className="text-xs px-2 py-1.5 bg-muted hover:bg-muted/80 rounded text-left truncate"
                >
                  {style.label}
                </button>
              ))}
              {hasMoreStyles && (
                <button
                  onClick={handleShowMoreStyles}
                  className="text-xs px-2 py-1.5 bg-muted hover:bg-muted/80 rounded text-center font-medium text-blue-500"
                >
                  <ChevronDown className="h-3 w-3 inline mr-1" />
                  more...
                </button>
              )}
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

        <TabsContent value="wordart" className="mt-0 space-y-4">
          <WordArtStyles 
            onWordArtStyleSelect={handleWordArtStyleSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
