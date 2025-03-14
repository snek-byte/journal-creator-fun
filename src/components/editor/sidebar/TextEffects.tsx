
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, CircleCheck } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { textStyles } from '@/utils/unicodeTextStyles';

export function TextEffects() {
  const { applyTextStyle } = useEditorStore();
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          Text Transformations
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {textStyles.slice(0, 12).map((style) => (
            <Button
              key={style.value}
              variant="outline"
              size="sm"
              className="h-10 justify-start text-left truncate"
              onClick={() => applyTextStyle(style.value)}
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <CircleCheck className="h-4 w-4" />
          Special Effects
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Highlight', value: 'highlight' },
            { label: 'Shadow', value: 'shadow' },
            { label: 'Glow', value: 'glow' },
            { label: 'Outline', value: 'outline' },
            { label: 'Blur', value: 'blur' },
            { label: 'Reveal', value: 'reveal' },
          ].map((effect) => (
            <Button
              key={effect.value}
              variant="outline"
              size="sm"
              className="h-10"
              onClick={() => applyTextStyle(effect.value)}
            >
              {effect.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>More Styles</Label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
          {textStyles.slice(12).map((style) => (
            <Button
              key={style.value}
              variant="outline"
              size="sm"
              className="h-10 justify-start text-left truncate"
              onClick={() => applyTextStyle(style.value)}
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
