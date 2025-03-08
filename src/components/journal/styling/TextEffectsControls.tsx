
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { textStyles } from '@/utils/unicodeTextStyles';

interface TextEffectsControlsProps {
  onTextStyleChange: (style: string) => void;
}

export function TextEffectsControls({
  onTextStyleChange
}: TextEffectsControlsProps) {
  const [displayCount, setDisplayCount] = useState(4);
  const chunkSize = 4;
  
  // Calculate how many styles to show
  const hasMoreStyles = displayCount < textStyles.length;
  
  // Handle "more" button click
  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + chunkSize, textStyles.length));
  };
  
  // Handle "less" button click
  const handleShowLess = () => {
    setDisplayCount(chunkSize);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Unicode Text Styles
        </span>
        <div className="flex space-x-1">
          {displayCount > chunkSize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowLess}
              className="h-6 px-2 text-xs"
            >
              <ChevronUp className="h-3 w-3 mr-1" />
              Less
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTextStyleChange('normal')}
            className="h-6 px-2 text-xs"
          >
            Clear
          </Button>
        </div>
      </div>
      <ScrollArea className="h-44 border rounded-md p-2">
        <div className="grid grid-cols-2 gap-2">
          {textStyles.slice(0, displayCount).map((style) => (
            <Button
              key={style.value}
              variant="outline"
              size="sm"
              onClick={() => onTextStyleChange(style.value)}
              className="h-8 px-2 text-xs justify-start overflow-hidden"
              type="button"
            >
              {style.label}
            </Button>
          ))}
          
          {hasMoreStyles && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowMore}
              className="h-8 px-2 text-xs justify-center text-blue-500"
              type="button"
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              More Styles...
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
