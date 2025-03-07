
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { PaintBucket } from 'lucide-react';

interface ColorControlsProps {
  fontColor: string;
  gradient: string;
  onFontColorChange: (color: string) => void;
  onGradientChange: (gradient: string) => void;
}

export function ColorControls({
  fontColor,
  gradient,
  onFontColorChange,
  onGradientChange
}: ColorControlsProps) {
  // Color picker state
  const [pickerColor, setPickerColor] = useState(fontColor);
  
  const handleColorChange = (color: string) => {
    setPickerColor(color);
    onFontColorChange(color);
  };

  // Text Gradients
  const textGradients = [
    { name: 'None', value: '' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'},
    { name: 'Blue Sky', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'},
    { name: 'Green-Blue', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'},
    { name: 'Pink-Red', value: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)'},
    { name: 'Cosmic', value: 'linear-gradient(to right, #00dbde 0%, #fc00ff 100%)'},
    { name: 'Deep Blue', value: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)'},
    { name: 'Ocean', value: 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)'},
    { name: 'Sunny', value: 'linear-gradient(to right, #f83600 0%, #f9d423 100%)'},
    { name: 'Rainbow', value: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'},
    { name: 'Candy', value: 'linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)'},
    { name: 'Purple Love', value: 'linear-gradient(to right, #cc2b5e 0%, #753a88 100%)'},
  ].map(gradient => ({
    ...gradient,
    // Convert standard gradients to text gradients
    value: gradient.value ? `${gradient.value.replace('to right', '45deg')} text` : ''
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs">Text Color</span>
          <div className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-8 h-8 p-0 overflow-hidden"
                >
                  <div 
                    className="w-full h-full" 
                    style={{ backgroundColor: fontColor }}
                  ></div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="end">
                <HexColorPicker 
                  color={pickerColor} 
                  onChange={handleColorChange} 
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs flex items-center">
            <PaintBucket className="h-3 w-3 mr-1" />
            Text Gradient
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGradientChange('')}
            className="h-6 px-2 text-xs"
          >
            Clear
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {textGradients.slice(0, 9).map((g, index) => (
            <button
              key={index}
              className={`h-10 rounded ${gradient === g.value ? 'ring-2 ring-primary' : 'ring-1 ring-border'}`}
              style={g.value ? { 
                background: g.value.replace(' text', '')
              } : { 
                background: '#fff',
                border: '1px dashed #ccc'
              }}
              onClick={() => onGradientChange(g.value)}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
