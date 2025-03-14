
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/store/editorStore';
import { Palette, Droplet } from 'lucide-react';
import { gradients } from '@/utils/editorConfig';

export function ColorControls() {
  const { 
    currentColor, 
    setColor,
    currentGradient,
    setGradient
  } = useEditorStore();
  
  const colorPresets = [
    '#000000', '#5551FF', '#2563EB', '#059669', '#D97706', '#DC2626', '#8E44AD', '#7E22CE'
  ];
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text-color">Text Color</Label>
        <div className="flex gap-2">
          <div className="flex-grow">
            <Input
              id="text-color"
              type="color"
              value={currentColor}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 cursor-pointer"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {colorPresets.map((color) => (
              <Button
                key={color}
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 p-0 rounded-md"
                style={{ backgroundColor: color }}
                onClick={() => setColor(color)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <Droplet className="h-4 w-4" />
          Gradient Presets
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => setGradient('')}
            className={`h-10 flex justify-center items-center ${!currentGradient ? 'border-primary' : ''}`}
          >
            None
          </Button>
          
          {gradients.slice(0, 7).map((gradient) => (
            <Button
              key={gradient.value}
              variant="outline"
              className={`h-10 ${currentGradient === gradient.value ? 'border-primary' : ''}`}
              style={{ 
                background: gradient.value,
                color: 'transparent',
                backgroundClip: 'text'
              }}
              onClick={() => setGradient(gradient.value)}
            >
              {gradient.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <Palette className="h-4 w-4" />
          More Gradients
        </Label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
          {gradients.slice(7).map((gradient) => (
            <Button
              key={gradient.value}
              variant="outline"
              className={`h-10 ${currentGradient === gradient.value ? 'border-primary' : ''}`}
              style={{ 
                background: gradient.value,
                color: 'transparent',
                backgroundClip: 'text'
              }}
              onClick={() => setGradient(gradient.value)}
            >
              {gradient.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
