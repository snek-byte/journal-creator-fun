
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { textStyles } from '@/utils/unicodeTextStyles';

interface TextEffectsControlsProps {
  onTextStyleChange: (style: string) => void;
}

export function TextEffectsControls({
  onTextStyleChange
}: TextEffectsControlsProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Unicode Text Styles
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTextStyleChange('normal')}
          className="h-6 px-2 text-xs"
        >
          Clear
        </Button>
      </div>
      <ScrollArea className="h-44 border rounded-md p-2">
        <div className="grid grid-cols-2 gap-2">
          {textStyles.map((style) => (
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
        </div>
      </ScrollArea>
    </div>
  );
}
